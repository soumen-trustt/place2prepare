package com.soumenprogramming.onlinelearning.place2prepare.payments;

import com.soumenprogramming.onlinelearning.place2prepare.admin.dto.PremiumPriceResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/pricing")
public class PublicPricingController {

    private final PremiumPriceSettingService premiumPriceSettingService;
    private final String currency;

    public PublicPricingController(
            PremiumPriceSettingService premiumPriceSettingService,
            @Value("${app.payments.premium.currency:INR}") String currency) {
        this.premiumPriceSettingService = premiumPriceSettingService;
        this.currency = currency;
    }

    @GetMapping("/premium")
    public PremiumPriceResponse getPremiumPrice() {
        return new PremiumPriceResponse(premiumPriceSettingService.getEffectivePriceInr(), currency);
    }
}
