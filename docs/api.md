# API Contract

Base path: `/api`  
Content-Type: `application/json`

## Error Format

모든 에러는 아래 형식을 따른다.

```json
{
  "code": "VALIDATION_ERROR",
  "message": "groupId: must not be null"
}
```

## 1) GET /health

목적: 백엔드 생존 확인

성공 응답 (200):
```json
{
  "status": "ok"
}
```

## 2) GET /rules

목적: 도메인 규칙 조회

성공 응답 (200):
```json
{
  "maxCheckinsPerDay": 1,
  "requiredCheckinsPerWeek": 3,
  "weekStartsOn": "MONDAY",
  "weekEndsOn": "SUNDAY",
  "weeklyFineKrw": 10000
}
```

## 3) POST /checkins

목적: 체크인 등록

요청 바디:
```json
{
  "groupId": 1,
  "memberId": 100,
  "checkinDate": "2026-02-17"
}
```

`memberId`는 DB의 `members.id`(PK)를 의미한다.

성공 응답 (201):
```json
{
  "id": 10,
  "groupId": 1,
  "memberId": 100,
  "checkinDate": "2026-02-17"
}
```

오류 응답 (409, 중복 체크인):
```json
{
  "code": "DUPLICATE_CHECKIN",
  "message": "Only one check-in per day is allowed."
}
```

오류 응답 (400, 검증 실패 예시):
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Request body is malformed or contains invalid values."
}
```

## 4) GET /weekly-status

목적: 특정 주간의 체크인 달성 여부 조회

Query Parameters:
- `groupId` (required, number)
- `memberId` (required, number, DB `members.id`)
- `date` (optional, `YYYY-MM-DD`)

요청 예시:
```text
GET /api/weekly-status?groupId=1&memberId=100&date=2026-02-17
```

성공 응답 (200):
```json
{
  "weekStart": "2026-02-16",
  "weekEnd": "2026-02-22",
  "checkinCount": 2,
  "requiredCount": 3,
  "passed": false,
  "fineKrw": 10000
}
```

오류 응답 (400, 파라미터 누락/타입 오류):
```json
{
  "code": "VALIDATION_ERROR",
  "message": "groupId: is required"
}
```

## Error Codes

- `DUPLICATE_CHECKIN`: 동일 `groupId` + `memberId` + `checkinDate`가 이미 존재
- `VALIDATION_ERROR`: 요청 파라미터/본문 형식 또는 제약 위반
