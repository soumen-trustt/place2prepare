package com.soumenprogramming.onlinelearning.place2prepare.payments;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "premium_price_setting")
public class PremiumPriceSetting {

    public static final long SINGLETON_ID = 1L;

    @Id
    @Column(nullable = false)
    private Long id;

    @Column(name = "price_inr", nullable = false, precision = 12, scale = 2)
    private BigDecimal priceInr;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "updated_by", length = 255)
    private String updatedBy;

    protected PremiumPriceSetting() {
    }

    public PremiumPriceSetting(Long id, BigDecimal priceInr, Instant updatedAt, String updatedBy) {
        this.id = id;
        this.priceInr = priceInr;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
    }

    public Long getId() {
        return id;
    }

    public BigDecimal getPriceInr() {
        return priceInr;
    }

    public void setPriceInr(BigDecimal priceInr) {
        this.priceInr = priceInr;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}
