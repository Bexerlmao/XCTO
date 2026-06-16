-- XCTO 数据库初始化
-- 执行方式：docker exec -i xcto-db psql -U postgres < 01-create-tables.sql

CREATE DATABASE xcto;
\c xcto

-- 课程表
CREATE TABLE IF NOT EXISTS chaoxingClass (
    id SERIAL PRIMARY KEY,
    class_id BIGINT,
    class_name VARCHAR(255),
    question_total BIGINT
);
CREATE INDEX IF NOT EXISTS idx_class_id ON chaoxingClass (class_id);

-- 题目表
CREATE TABLE IF NOT EXISTS question (
    id SERIAL PRIMARY KEY,
    class_id BIGINT,
    question_type SMALLINT,
    question TEXT,
    options TEXT,
    answer TEXT,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_question_class_id ON question(class_id);
