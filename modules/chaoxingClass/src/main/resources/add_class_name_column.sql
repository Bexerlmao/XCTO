-- 为已有的 chaoxingClass 表添加 class_name 字段
-- 如果列已存在则跳过（使用 DO 块处理）

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'chaoxingclass'
          AND column_name = 'class_name'
    ) THEN
        ALTER TABLE chaoxingclass ADD COLUMN class_name VARCHAR(255);
    END IF;
END $$;
