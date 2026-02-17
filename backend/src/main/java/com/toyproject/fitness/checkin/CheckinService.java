package com.toyproject.fitness.checkin;

import jakarta.validation.constraints.NotNull;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Optional;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CheckinService {

    public static final int REQUIRED_WEEKLY_COUNT = 3;
    public static final int WEEKLY_FINE_KRW = 10000;

    private final CheckinRepository checkinRepository;

    public CheckinService(CheckinRepository checkinRepository) {
        this.checkinRepository = checkinRepository;
    }

    @Transactional
    public Checkin createCheckin(@NotNull Long groupId, @NotNull Long memberId, @NotNull LocalDate date) {
        boolean exists = checkinRepository.existsByGroupIdAndMemberIdAndCheckinDate(groupId, memberId, date);
        if (exists) {
            throw new DuplicateCheckinException("Only one check-in per day is allowed.");
        }
        try {
            return checkinRepository.save(new Checkin(groupId, memberId, date));
        } catch (DataIntegrityViolationException ex) {
            throw mapToDomainException(ex, groupId, memberId);
        }
    }

    @Transactional(readOnly = true)
    public WeeklyStatus getWeeklyStatus(Long groupId, Long memberId, LocalDate anyDateInWeek) {
        LocalDate weekStart = anyDateInWeek.with(DayOfWeek.MONDAY);
        LocalDate weekEnd = anyDateInWeek.with(DayOfWeek.SUNDAY);
        long checkinCount = checkinRepository.countByGroupIdAndMemberIdAndCheckinDateBetween(groupId, memberId, weekStart, weekEnd);

        boolean passed = checkinCount >= REQUIRED_WEEKLY_COUNT;
        int fine = passed ? 0 : WEEKLY_FINE_KRW;
        return new WeeklyStatus(weekStart, weekEnd, checkinCount, REQUIRED_WEEKLY_COUNT, passed, fine);
    }

    private RuntimeException mapToDomainException(DataIntegrityViolationException ex, Long groupId, Long memberId) {
        String constraintName = findConstraintName(ex).map(String::toLowerCase).orElse("");

        if (constraintName.contains("fk_checkins_group")) {
            return new GroupNotFoundException("Group not found: " + groupId);
        }
        if (constraintName.contains("fk_checkins_member")) {
            return new MemberNotFoundException("Member not found: " + memberId);
        }
        if (constraintName.contains("uk_checkins_group_member_date")) {
            return new DuplicateCheckinException("Only one check-in per day is allowed.");
        }
        return ex;
    }

    private Optional<String> findConstraintName(Throwable throwable) {
        Throwable current = throwable;
        while (current != null) {
            if (current instanceof ConstraintViolationException constraintViolationException) {
                return Optional.ofNullable(constraintViolationException.getConstraintName());
            }
            current = current.getCause();
        }
        return Optional.empty();
    }
}
