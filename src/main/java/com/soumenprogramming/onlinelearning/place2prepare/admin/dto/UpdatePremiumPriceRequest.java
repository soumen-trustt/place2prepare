package com.soumenprogramming.onlinelearning.place2prepare.admin.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record UpdatePremiumPriceRequest(
        @NotNull
        @DecimalMin("0.01")
        @DecimalMax("999999.99")
        @Digits(integer = 6, fraction = 2)
        BigDecimal priceInr
) {
}
