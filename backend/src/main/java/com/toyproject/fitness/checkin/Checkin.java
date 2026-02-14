package com.toyproject.fitness.checkin;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "checkins")
public class Checkin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long groupId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private LocalDate checkinDate;

    protected Checkin() {
    }

    public Checkin(Long groupId, Long memberId, LocalDate checkinDate) {
        this.groupId = groupId;
        this.memberId = memberId;
        this.checkinDate = checkinDate;
    }

    public Long getId() {
        return id;
    }

    public Long getGroupId() {
        return groupId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public LocalDate getCheckinDate() {
        return checkinDate;
    }
}
