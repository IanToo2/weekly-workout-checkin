# Overview

이 문서는 프로젝트의 구조, 컴포넌트 책임, 데이터 흐름을 설명한다.

## System Context

- Frontend: React + TypeScript (Vite)
- Backend: Spring Boot 3 (Java 17)
- Database: PostgreSQL 16
- Schema migration: Flyway (`backend/src/main/resources/db/migration`)

사용자는 Frontend에서 체크인 등록/주간 상태 조회를 수행하고, Backend는 규칙 검증 및 데이터 저장/집계를 담당한다.

## Directory Layout

- `frontend/`: UI, API client, 화면 상태
- `backend/`: API 엔드포인트, 도메인 규칙, JPA 저장소
- `docs/`: 운영 문서, API 계약, 워크플로, 런북, ADR
- `docker-compose.yml`: 로컬 PostgreSQL 실행
- `skills/`: 내부 작업 스킬 문서(서비스 기능 문서 아님)

## Runtime Data Flow

1. Frontend가 `/api/*` 요청을 전송한다.
2. Backend Controller가 요청을 수신하고 입력을 검증한다.
3. Service가 도메인 규칙(1일 1회, 주간 집계)을 적용한다.
4. Repository가 PostgreSQL에 저장/조회한다.
5. Backend가 JSON 응답 또는 표준 에러 포맷을 반환한다.
6. Frontend가 성공/오류 상태를 UI에 반영한다.

## Responsibility Boundaries

- Frontend 책임
  - 폼 입력 처리, 상태 표시, 사용자 메시지
  - API 호출 및 오류 코드 기반 분기
- Backend 책임
  - 비즈니스 규칙 강제
  - 데이터 정합성 및 집계
  - 일관된 에러 응답(`code`, `message`)
- Database 책임
  - 체크인 데이터 영속화
  - Flyway 마이그레이션 기반 스키마 변경 이력 관리

## Current Functional Surface

- Health 확인
- Rule 조회
- Check-in 생성
- Weekly Status 조회

세부 계약은 `docs/api.md`, 규칙 설명은 `docs/rules.md`를 따른다.

## Data Model (v1)

- `groups`
  - PK: `id`
  - 주요 필드: `name`, `weekly_fine_krw`(default `10000`), `timezone`(default `Asia/Seoul`)
- `members`
  - PK: `id`
  - 체크인 API의 `memberId`는 `members.id`를 의미
- `group_members`
  - PK: (`group_id`, `member_id`)
  - 그룹-멤버 소속 관계 저장
- `checkins`
  - PK: `id`
  - FK: `group_id -> groups.id`, `member_id -> members.id`
  - UNIQUE: (`group_id`, `member_id`, `checkin_date`)
  - 인덱스: 주간 조회 최적화를 위한 `idx_checkins_weekly_status (group_id, checkin_date, member_id)`
