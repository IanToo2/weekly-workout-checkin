package com.toyproject.fitness.checkin;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.SQLException;
import java.time.LocalDate;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.dao.DataIntegrityViolationException;

class CheckinServiceTest {

    private CheckinRepository checkinRepository;
    private CheckinService checkinService;

    @BeforeEach
    void setUp() {
        checkinRepository = Mockito.mock(CheckinRepository.class);
        checkinService = new CheckinService(checkinRepository);
    }

    @Test
    void createCheckin_successWithValidIds() {
        LocalDate date = LocalDate.of(2026, 2, 17);
        Checkin saved = new Checkin(1L, 100L, date);

        when(checkinRepository.existsByGroupIdAndMemberIdAndCheckinDate(1L, 100L, date)).thenReturn(false);
        when(checkinRepository.save(any(Checkin.class))).thenReturn(saved);

        Checkin result = checkinService.createCheckin(1L, 100L, date);

        assertEquals(1L, result.getGroupId());
        assertEquals(100L, result.getMemberId());
        assertEquals(date, result.getCheckinDate());
        verify(checkinRepository).save(any(Checkin.class));
    }

    @Test
    void createCheckin_failWhenGroupDoesNotExist() {
        LocalDate date = LocalDate.of(2026, 2, 17);

        when(checkinRepository.existsByGroupIdAndMemberIdAndCheckinDate(999L, 100L, date)).thenReturn(false);
        when(checkinRepository.save(any(Checkin.class)))
                .thenThrow(dataIntegrityViolation("fk_checkins_group"));

        GroupNotFoundException ex = assertThrows(
                GroupNotFoundException.class,
                () -> checkinService.createCheckin(999L, 100L, date)
        );

        assertEquals("Group not found: 999", ex.getMessage());
    }

    @Test
    void createCheckin_failWhenMemberDoesNotExist() {
        LocalDate date = LocalDate.of(2026, 2, 17);

        when(checkinRepository.existsByGroupIdAndMemberIdAndCheckinDate(1L, 999L, date)).thenReturn(false);
        when(checkinRepository.save(any(Checkin.class)))
                .thenThrow(dataIntegrityViolation("fk_checkins_member"));

        MemberNotFoundException ex = assertThrows(
                MemberNotFoundException.class,
                () -> checkinService.createCheckin(1L, 999L, date)
        );

        assertEquals("Member not found: 999", ex.getMessage());
    }

    @Test
    void createCheckin_failWhenDuplicateCheckinExists() {
        LocalDate date = LocalDate.of(2026, 2, 17);

        when(checkinRepository.existsByGroupIdAndMemberIdAndCheckinDate(1L, 100L, date)).thenReturn(true);

        DuplicateCheckinException ex = assertThrows(
                DuplicateCheckinException.class,
                () -> checkinService.createCheckin(1L, 100L, date)
        );

        assertEquals("Only one check-in per day is allowed.", ex.getMessage());
    }

    private DataIntegrityViolationException dataIntegrityViolation(String constraintName) {
        ConstraintViolationException constraintViolationException = new ConstraintViolationException(
                "constraint violation",
                new SQLException("constraint error"),
                "insert into checkins",
                constraintName
        );
        return new DataIntegrityViolationException("save failed", constraintViolationException);
    }
}
