package com.soumenprogramming.onlinelearning.place2prepare.payments;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import java.math.BigDecimal;
import java.math.RoundingMode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE;

/**
 * Stripe Checkout (hosted payment page). Activate with {@code app.payments.provider=stripe} and
 * {@code app.payments.stripe.secret-key}. Configure the webhook endpoint in Stripe Dashboard:
 * {@code POST /api/v1/public/payments/webhook/stripe} with signing secret
 * {@code app.payments.stripe.webhook-secret}.
 */
@Component
@ConditionalOnProperty(
        prefix = "app.payments",
        name = "provider",
        havingValue = "stripe"
)
public class StripePaymentGateway implements PaymentGateway {

    public static final String PROVIDER = "stripe";

    private static final Logger log = LoggerFactory.getLogger(StripePaymentGateway.class);

    private final String secretKey;
    private final String webhookSecret;

    public StripePaymentGateway(@Value("${app.payments.stripe.secret-key:}") String secretKey,
                                @Value("${app.payments.stripe.webhook-secret:}") String webhookSecret) {
        this.secretKey = secretKey == null ? "" : secretKey.trim();
        this.webhookSecret = webhookSecret == null ? "" : webhookSecret.trim();
        if (!this.secretKey.isBlank()) {
            Stripe.apiKey = this.secretKey;
        }
        if (this.secretKey.isBlank()) {
            log.warn("StripePaymentGateway activated but app.payments.stripe.secret-key is empty.");
        }
    }

    @Override
    public String provider() {
        return PROVIDER;
    }

    @Override
    public CheckoutSession createCheckout(PaymentOrder order, String successUrl, String cancelUrl) {
        if (secretKey.isBlank()) {
            throw new ResponseStatusException(
                    SERVICE_UNAVAILABLE,
                    "Stripe is not configured. Set app.payments.stripe.secret-key (e.g. sk_test_… or sk_live_…)."
            );
        }
        long unitAmountMinor;
        try {
            unitAmountMinor = order.getAmount()
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(0, RoundingMode.HALF_UP)
                    .longValueExact();
        } catch (ArithmeticException ex) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid payment amount for Stripe.");
        }
        if (unitAmountMinor <= 0) {
            throw new ResponseStatusException(BAD_REQUEST, "Amount must be greater than zero.");
        }

        String currency = order.getCurrency() == null ? "inr" : order.getCurrency().trim().toLowerCase();
        String productName = "Premium — " + order.getCourse().getTitle();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(currency)
                                                .setUnitAmount(unitAmountMinor)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(productName)
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .putMetadata("order_id", String.valueOf(order.getId()))
                .putMetadata("course_id", String.valueOf(order.getCourse().getId()))
                .build();

        try {
            Session session = Session.create(params);
            String url = session.getUrl();
            if (url == null || url.isBlank()) {
                log.error("Stripe returned checkout session {} without a URL", session.getId());
                throw new ResponseStatusException(SERVICE_UNAVAILABLE, "Stripe did not return a checkout URL.");
            }
            return new CheckoutSession(url, session.getId());
        } catch (StripeException ex) {
            log.error("Stripe Checkout.Session.create failed: {}", ex.getMessage());
            throw new ResponseStatusException(
                    BAD_REQUEST,
                    "Could not start Stripe checkout. Check your Stripe account and API key."
            );
        }
    }

    /**
     * Stripe replaces this literal in the success URL with the Checkout Session id after payment.
     */
    static String appendStripeSessionPlaceholder(String successUrl) {
        String base = successUrl == null ? "" : successUrl.trim();
        if (base.contains("{CHECKOUT_SESSION_ID}")) {
            return base;
        }
        String joiner = base.contains("?") ? "&" : "?";
        return base + joiner + "session_id={CHECKOUT_SESSION_ID}";
    }

    @Override
    public WebhookEvent parseWebhook(String payload, String signatureHeader) {
        if (webhookSecret.isBlank()) {
            log.warn("Stripe webhook received but app.payments.stripe.webhook-secret is empty — ignoring.");
            return null;
        }
        if (signatureHeader == null || signatureHeader.isBlank()) {
            log.warn("Stripe webhook missing Stripe-Signature header.");
            throw new ResponseStatusException(BAD_REQUEST, "Missing Stripe-Signature header");
        }
        final Event event;
        try {
            event = Webhook.constructEvent(payload, signatureHeader, webhookSecret);
        } catch (SignatureVerificationException ex) {
            log.warn("Stripe webhook signature verification failed: {}", ex.getMessage());
            throw new ResponseStatusException(BAD_REQUEST, "Invalid Stripe webhook signature");
        } catch (Exception ex) {
            log.warn("Stripe webhook parse error: {}", ex.getMessage());
            return null;
        }

        String type = event.getType();
        if ("checkout.session.completed".equals(type)) {
            return checkoutSessionToWebhookEvent(event, PaymentStatus.COMPLETED);
        }
        if ("checkout.session.expired".equals(type)) {
            return checkoutSessionToWebhookEvent(event, PaymentStatus.CANCELLED);
        }
        if ("checkout.session.async_payment_failed".equals(type)) {
            return checkoutSessionToWebhookEvent(event, PaymentStatus.FAILED);
        }
        return null;
    }

    private WebhookEvent checkoutSessionToWebhookEvent(Event event, PaymentStatus status) {
        EventDataObjectDeserializer deser = event.getDataObjectDeserializer();
        if (!deser.getObject().isPresent()) {
            log.warn("Stripe event {} missing deserialized object", event.getId());
            return null;
        }
        StripeObject obj = deser.getObject().get();
        if (!(obj instanceof Session session)) {
            return null;
        }
        String orderIdStr = session.getMetadata() != null ? session.getMetadata().get("order_id") : null;
        if (orderIdStr == null || orderIdStr.isBlank()) {
            log.warn("Stripe session {} missing order_id metadata", session.getId());
            return null;
        }
        long orderId;
        try {
            orderId = Long.parseLong(orderIdStr.trim());
        } catch (NumberFormatException ex) {
            log.warn("Invalid order_id in Stripe metadata: {}", orderIdStr);
            return null;
        }
        if (status == PaymentStatus.COMPLETED && !"paid".equalsIgnoreCase(session.getPaymentStatus())) {
            log.info("Ignoring checkout.session.completed for session {} — payment_status={}",
                    session.getId(), session.getPaymentStatus());
            return null;
        }
        return new WebhookEvent(orderId, status, session.getId());
    }

    @Override
    public PaymentStatus resolveCheckoutStatus(PaymentOrder order, String checkoutSessionId) {
        if (secretKey.isBlank() || checkoutSessionId == null || checkoutSessionId.isBlank()) {
            return null;
        }
        try {
            Stripe.apiKey = secretKey;
            Session session = Session.retrieve(checkoutSessionId);
            String metaOrder = session.getMetadata() != null ? session.getMetadata().get("order_id") : null;
            if (metaOrder == null || !String.valueOf(order.getId()).equals(metaOrder.trim())) {
                log.warn("Stripe session {} metadata order_id does not match order {}", checkoutSessionId, order.getId());
                return null;
            }
            if ("paid".equalsIgnoreCase(session.getPaymentStatus())) {
                return PaymentStatus.COMPLETED;
            }
            if ("open".equalsIgnoreCase(session.getStatus())) {
                return null;
            }
            if ("expired".equalsIgnoreCase(session.getStatus())) {
                return PaymentStatus.CANCELLED;
            }
            if ("complete".equalsIgnoreCase(session.getStatus()) && !"paid".equalsIgnoreCase(session.getPaymentStatus())) {
                return PaymentStatus.FAILED;
            }
        } catch (StripeException ex) {
            log.warn("Stripe Session.retrieve failed: {}", ex.getMessage());
            return null;
        }
        return null;
    }
}
