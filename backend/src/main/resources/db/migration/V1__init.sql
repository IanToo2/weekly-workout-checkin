CREATE TABLE groups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    weekly_fine_krw INTEGER NOT NULL DEFAULT 10000,
    timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Seoul',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE group_members (
    group_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (group_id, member_id),
    CONSTRAINT fk_group_members_group
        FOREIGN KEY (group_id) REFERENCES groups (id),
    CONSTRAINT fk_group_members_member
        FOREIGN KEY (member_id) REFERENCES members (id)
);

CREATE TABLE checkins (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    checkin_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_checkins_group
        FOREIGN KEY (group_id) REFERENCES groups (id),
    CONSTRAINT fk_checkins_member
        FOREIGN KEY (member_id) REFERENCES members (id),
    CONSTRAINT uk_checkins_group_member_date
        UNIQUE (group_id, member_id, checkin_date)
);

CREATE INDEX idx_checkins_weekly_status
    ON checkins (group_id, checkin_date, member_id);
