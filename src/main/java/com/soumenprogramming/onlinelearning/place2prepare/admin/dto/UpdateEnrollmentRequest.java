package com.soumenprogramming.onlinelearning.place2prepare.admin.dto;

/**
 * Partial update — include only fields to change.
 */
public record UpdateEnrollmentRequest(
        String planType,
        String status,
        Integer progressPercentage,
        Integer lessonsLeft
) {
}
