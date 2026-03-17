-- 创建课程表

CREATE TABLE IF NOT EXISTS chaoxingClass (
    id SERIAL PRIMARY KEY,
    class_id BIGINT,
    question_total BIGINT
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_class_id ON chaoxingClass (class_id);
