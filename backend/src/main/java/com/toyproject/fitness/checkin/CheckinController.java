package com.toyproject.fitness.checkin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Validated
public class CheckinController {

    private final CheckinService checkinService;

    public CheckinController(CheckinService checkinService) {
        this.checkinService = checkinService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    @GetMapping("/rules")
    public Map<String, Object> rules() {
        return Map.of(
                "maxCheckinsPerDay", 1,
                "requiredCheckinsPerWeek", CheckinService.REQUIRED_WEEKLY_COUNT,
                "weekStartsOn", "MONDAY",
                "weekEndsOn", "SUNDAY",
                "weeklyFineKrw", CheckinService.WEEKLY_FINE_KRW
        );
    }

    @PostMapping("/checkins")
    public ResponseEntity<CreateCheckinResponse> createCheckin(@Valid @RequestBody CreateCheckinRequest request) {
        Checkin created = checkinService.createCheckin(request.groupId(), request.memberId(), request.checkinDate());
        CreateCheckinResponse response = new CreateCheckinResponse(
                created.getId(),
                created.getGroupId(),
                created.getMemberId(),
                created.getCheckinDate()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/weekly-status")
    public WeeklyStatusResponse weeklyStatus(
            @RequestParam @NotNull Long groupId,
            @RequestParam @NotNull Long memberId,
            @RequestParam(required = false) LocalDate date
    ) {
        LocalDate targetDate = date == null ? LocalDate.now() : date;
        WeeklyStatus status = checkinService.getWeeklyStatus(groupId, memberId, targetDate);
        return new WeeklyStatusResponse(
                status.weekStart(),
                status.weekEnd(),
                status.checkinCount(),
                status.requiredCount(),
                status.passed(),
                status.fineKrw()
        );
    }

    public record CreateCheckinRequest(
            @NotNull Long groupId,
            @NotNull Long memberId,
            @NotNull LocalDate checkinDate
    ) {
    }

    public record CreateCheckinResponse(
            Long id,
            Long groupId,
            Long memberId,
            LocalDate checkinDate
    ) {
    }

    public record WeeklyStatusResponse(
            LocalDate weekStart,
            LocalDate weekEnd,
            long checkinCount,
            int requiredCount,
            boolean passed,
            int fineKrw
    ) {
    }
}
