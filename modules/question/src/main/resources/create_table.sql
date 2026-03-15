-- 创建题目表
CREATE TABLE IF NOT EXISTS question (
    id SERIAL PRIMARY KEY,
    class_id BIGINT,
    question TEXT,
    options JSONB,
    answer INTEGER,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_question_class_id ON question(class_id);
