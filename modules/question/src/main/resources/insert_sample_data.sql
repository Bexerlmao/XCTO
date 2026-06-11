-- 迁移：options/answer 列从 JSONB 改为 TEXT（与实体 String 类型对应）
ALTER TABLE question ALTER COLUMN options TYPE TEXT;
ALTER TABLE question ALTER COLUMN answer TYPE TEXT;

-- 课程1: 大学英语 (class_id = 2024001, 10题)
-- 课程2: 计算机导论 (class_id = 2024002, 10题)

-- question_type 值: 0=SINGLE_CHOICE(单选), 1=MULTIPLE_CHOICE(多选), 2=FILL_BLANK(填空), 3=TRUE_FALSE(判断)

-- ====== 课程表 ======
INSERT INTO chaoxingclass (class_id, question_total) VALUES
(2024001, 10),
(2024002, 10)
ON CONFLICT DO NOTHING;

-- ============================================
-- 课程1: 大学英语 (class_id = 2024001)
-- ============================================

-- 单选题
INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024001, 0, 'The company is looking for someone with ___ experience in marketing.',
 '{"0": "a few", "1": "a little", "2": "many", "3": "much"}',
 '["a little"]');

INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024001, 0, 'If I ___ you, I would accept the offer.',
 '{"0": "am", "1": "was", "2": "were", "3": "be"}',
 '["were"]');

INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024001, 0, 'Which of the following sentences is grammatically correct?',
 '{"0": "She don''t like coffee.", "1": "She doesn''t likes coffee.", "2": "She doesn''t like coffee.", "3": "She not like coffee."}',
 '["She doesn''t like coffee."]');

-- 多选题
INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024001, 1, 'Which of the following are modal verbs? (Select all that apply)',
 '{"0": "can", "1": "must", "2": "run", "3": "should"}',
 '["can", "must", "should"]');

INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024001, 1, 'Which words are synonyms of "happy"? (Select all that apply)',
 '{"0": "joyful", "1": "angry", "2": "content", "3": "cheerful"}',
 '["joyful", "content", "cheerful"]');

-- 判断题
INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024001, 3, '"He go to school every day" is grammatically correct.',
 '{"0": "正确", "1": "错误"}',
 '["错误"]');

INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024001, 3, 'The past tense of "teach" is "taught".',
 '{"0": "正确", "1": "错误"}',
 '["正确"]');

-- 填空题（{0}{1} 标记空格，options 存放每个空的 placeholder）
INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024001, 2, 'Translate the following sentence: "{0}" means {1} in Chinese.',
 '{"0": "请输入英文短句", "1": "请输入中文翻译"}',
 '["Knowledge is power.", "知识就是力量"]');

INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024001, 2, 'The plural form of {0} is {1}.',
 '{"0": "请输入单数名词", "1": "请输入复数形式"}',
 '["crisis", "crises"]');

INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024001, 2, 'Complete the sentence: I {0} (finish) my homework already.',
 '{"0": "请输入动词的正确时态"}',
 '["have finished"]');

-- ============================================
-- 课程2: 计算机导论 (class_id = 2024002)
-- ============================================

-- 单选题
INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024002, 0, 'HTTP 状态码 404 表示什么？',
 '{"0": "服务器内部错误", "1": "请求成功", "2": "资源未找到", "3": "请求被重定向"}',
 '["资源未找到"]');

INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024002, 0, '以下哪种数据结构是 LIFO（后进先出）？',
 '{"0": "队列", "1": "栈", "2": "链表", "3": "树"}',
 '["栈"]');

INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024002, 0, '在二进制中，1010 对应的十进制是多少？',
 '{"0": "8", "1": "9", "2": "10", "3": "12"}',
 '["10"]');

-- 多选题
INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024002, 1, '以下哪些是关系型数据库？(多选)',
 '{"0": "MySQL", "1": "MongoDB", "2": "PostgreSQL", "3": "Redis"}',
 '["MySQL", "PostgreSQL"]');

INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024002, 1, '以下哪些属于 TCP/IP 协议栈的层次？(多选)',
 '{"0": "应用层", "1": "传输层", "2": "表示层", "3": "网络层"}',
 '["应用层", "传输层", "网络层"]');

-- 判断题
INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024002, 3, 'Java 是一种纯解释型语言。',
 '{"0": "正确", "1": "错误"}',
 '["错误"]');

INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024002, 3, 'HTTPS 使用 TLS/SSL 协议对通信进行加密。',
 '{"0": "正确", "1": "错误"}',
 '["正确"]');

-- 填空题
INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024002, 2, '{0} 是资源分配的基本单位，{1} 是 CPU 调度的基本单位。',
 '{"0": "请输入第一个概念", "1": "请输入第二个概念"}',
 '["进程", "线程"]');

INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024002, 2, 'RESTful API 使用 HTTP 方法对资源进行操作，其中 {0} 用于查询，{1} 用于创建。',
 '{"0": "请输入查询方法", "1": "请输入创建方法"}',
 '["GET", "POST"]');

INSERT INTO question (class_id, question_type, question, options, answer) VALUES
(2024002, 2, 'SQL 查询所有姓"张"的学生的语句是：{0}。',
 '{"0": "请输入 SQL 语句"}',
 '["SELECT * FROM student WHERE name LIKE ''张%'';"]');
