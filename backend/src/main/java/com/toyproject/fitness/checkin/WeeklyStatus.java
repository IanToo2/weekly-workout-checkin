package com.toyproject.fitness.checkin;

import java.time.LocalDate;

public record WeeklyStatus(
        LocalDate weekStart,
        LocalDate weekEnd,
        long checkinCount,
        int requiredCount,
        boolean passed,
        int fineKrw
) {
}
