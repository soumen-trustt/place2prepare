package com.soumenprogramming.onlinelearning.place2prepare.payments;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class PremiumPriceSettingService {

    private static final int SCALE = 2;
    private static final BigDecimal MIN = new BigDecimal("0.01");
    private static final BigDecimal MAX = new BigDecimal("999999.99");

    private final PremiumPriceSettingRepository repository;
    private final BigDecimal defaultPriceInr;

    public PremiumPriceSettingService(
            PremiumPriceSettingRepository repository,
            @Value("${app.payments.premium.price-inr:999}") BigDecimal defaultPriceInr) {
        this.repository = repository;
        this.defaultPriceInr = defaultPriceInr.setScale(SCALE, RoundingMode.HALF_UP);
    }

    @Transactional(readOnly = true)
    public BigDecimal getEffectivePriceInr() {
        return repository.findById(PremiumPriceSetting.SINGLETON_ID)
                .map(PremiumPriceSetting::getPriceInr)
                .map(p -> p.setScale(SCALE, RoundingMode.HALF_UP))
                .orElse(defaultPriceInr);
    }

    @Transactional
    public BigDecimal updatePriceInr(BigDecimal requested, String updatedByEmail) {
        BigDecimal normalized = requested.setScale(SCALE, RoundingMode.HALF_UP);
        if (normalized.compareTo(MIN) < 0 || normalized.compareTo(MAX) > 0) {
            throw new ResponseStatusException(
                    BAD_REQUEST,
                    "Premium price must be between " + MIN + " and " + MAX + " INR."
            );
        }
        PremiumPriceSetting row = repository.findById(PremiumPriceSetting.SINGLETON_ID)
                .orElseThrow(() -> new ResponseStatusException(
                        NOT_FOUND,
                        "Premium price setting is not initialized. Restart the application to run migrations."
                ));
        row.setPriceInr(normalized);
        row.setUpdatedAt(Instant.now());
        row.setUpdatedBy(updatedByEmail);
        repository.save(row);
        return normalized;
    }
}
