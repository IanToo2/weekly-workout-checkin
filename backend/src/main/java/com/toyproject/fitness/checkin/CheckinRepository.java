package com.toyproject.fitness.checkin;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckinRepository extends JpaRepository<Checkin, Long> {
    boolean existsByGroupIdAndMemberIdAndCheckinDate(Long groupId, Long memberId, LocalDate checkinDate);
    long countByGroupIdAndMemberIdAndCheckinDateBetween(Long groupId, Long memberId, LocalDate startDate, LocalDate endDate);
    List<Checkin> findAllByGroupIdAndCheckinDateBetween(Long groupId, LocalDate startDate, LocalDate endDate);
}
