// ==UserScript==
// @name         XCTO 题目获取
// @namespace    Bexerlmao
// @version      0.1.0
// @description  获取题目、调试界面、自动翻页功能
// @author       Bexerlmao
// @match        *://*.chaoxing.com/*
// @connect      aichathelper.top
// @connect      localhost
// @connect      127.0.0.1
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .no-select {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
        }
        input {
            outline: none;
            border: none;
        }
        div {
            box-sizing: border-box;
        }
        .log-wrap {
            font: 14px Menlo, Monaco, Consolas, Courier New, monospace;
        }
        .log-wrap .console {
            height: 150px;
            overflow-y: scroll;
            scroll-behavior: smooth;
            background-color: #292929;
            padding: 8px 6px;
            color: #ececec;
            font-size: 11px;
        }
        .log-wrap .console div {
            padding: 3px 0;
        }
        .log-wrap .console div span {
            margin: 0 2px;
        }
        .log-wrap .console div span .module {
            background-color: #ececec;
            color: #292929;
        }
        .log-wrap .console .log {
            background-color: #9e9e9ec4;
        }
        .log-wrap .console .warning {
            background-color: #ffc107db;
        }
        .main-wrap {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 99999 !important;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
        .main-box {
            padding: 5px 10px;
            font: 14px Menlo, Monaco, Consolas, Courier New, monospace;
            color: #636363;
            background-color: #fff;
            box-shadow: 0 0 24px -12px #3f3f3f;
            border-radius: 8px;
            letter-spacing: .5px;
            min-width: 280px;
            max-width: 350px;
            width: fit-content;
        }
        .main-box .box-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 28px;
            border-bottom: 1px solid #eee;
            margin-bottom: 8px;
            cursor: move;
            padding: 0 2px;
        }
        .main-box .box-header div {
            margin: 0;
        }
        .main-box .box-header .script-info {
            font-weight: bold;
            -webkit-user-select: none !important;
            user-select: none !important;
        }
        .main-box .box-content {
            display: block;
        }
        .config-section {
            margin-bottom: 15px;
        }
        .config-section .section-title {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 13px;
            color: #333;
        }
        .config-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 12px;
        }
        .config-row span {
            margin-right: 5px;
        }
        .config-row input[type="text"] {
            width: 200px;
            padding: 2px 4px;
            font-size: 12px;
            border: 1px solid #ddd;
            border-radius: 3px;
        }
        .config-row input[type="checkbox"] {
            margin-right: 5px;
        }
        .config-row button {
            margin-left: 5px;
            padding: 2px 6px;
            font-size: 12px;
            border: 1px solid #ddd;
            border-radius: 3px;
            background: #fff;
            cursor: pointer;
        }
        .btn-primary {
            padding: 5px 10px;
            font-size: 12px;
            border: 1px solid #ddd;
            border-radius: 3px;
            background: #fff;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // 日志存储
    const logList = [];

    // 添加日志函数
    function insertLog(text, type = 'log') {
        const now = new Date();
        const time = now.toLocaleTimeString();
        const logItem = { text, type, time };
        logList.push(logItem);

        // 更新UI
        const consoleEl = document.getElementById('log-console');
        if (consoleEl) {
            const logDiv = document.createElement('div');
            logDiv.innerHTML = `<span class="${type}">[${type === 'log' ? '日志' : type === 'warning' ? '警告' : '错误'}]</span><span>${time} - ${text}</span>`;
            consoleEl.appendChild(logDiv);
            consoleEl.scrollTop = consoleEl.scrollHeight;
        }

        // 同时输出到浏览器控制台
        console.log(`[${type}] ${text}`);
    }

    // 题目类型映射
    const questionType = {
        "单选题": "0",
        "A1型题": "0",
        "多选题": "1",
        "X型题": "1",
        "填空题": "2",
        "判断题": "3",
        "简答题": "4",
        "名词解释": "5",
        "论述题": "6",
        "计算题": "7",
        "单选": "0",
        "A1型": "0",
        "多选": "1",
        "填空": "2",
        "判断": "3",
        "简答": "4"
    };

    // 清理HTML标签
    function removeHtml(html) {
        if (!html) return '';
        return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    }

    // 清理特殊标记
    function clearMark(str) {
        return str.replace(/[【】\[\]（）\(\)（）\s]/g, '');
    }

    // 清理题目文本
    function clean(str) {
        return str.replace(/[\n\r]/g, '').replace(/\s+/g, ' ').trim();
    }

    // 等待函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 等待iframe加载完成
    function waitIframeLoad(iframe) {
        return new Promise((resolve) => {
            const intervalId = setInterval(() => {
                if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                    clearInterval(intervalId);
                    resolve();
                }
            }, 500);
        });
    }

    // 获取所有嵌套的iframe
    function getAllNestedIframes(element) {
        const iframes = Array.from(element.querySelectorAll('iframe'));
        const result = [];
        
        function processIframe(iframe) {
            if (iframe.contentDocument) {
                result.push(iframe);
                const nestedIframes = iframe.contentDocument.querySelectorAll('iframe');
                nestedIframes.forEach(nested => processIframe(nested));
            }
        }
        
        iframes.forEach(iframe => processIframe(iframe));
        return result;
    }

    // 题目处理器类 - 从other.js完整复制
    class QuestionHandler {
        constructor(type, iframe) {
            this.type = type;
            this.questions = [];
            
            if (iframe) {
                this._document = iframe.contentDocument;
                this._window = iframe.contentWindow;
            } else {
                this._document = document;
                this._window = window;
            }
        }

        // 解析HTML中的题目
        parseHtml() {
            if (!this._document) return [];
            
            if (["zj"].includes(this.type)) {
                const questionElements = this._document.querySelectorAll(".TiMu");
                this.addQuestions(questionElements);
            } else if (["zy", "ks"].includes(this.type)) {
                const questionElements = this._document.querySelectorAll(".questionLi");
                this.addQuestions(questionElements);
            }
            
            return this.questions;
        }

        // 添加题目到列表
        addQuestions(questionElements) {
            questionElements.forEach((element) => {
                let questionTitle = "";
                let questionTypeText = "";
                let optionElements;
                let optionsObject = {};
                let optionTexts = [];
                
                if (["zj"].includes(this.type)) {
                    questionTitle = removeHtml(
                        element.querySelector(".fontLabel")?.innerHTML || ""
                    );
                    questionTypeText = removeHtml(
                        element.querySelector(".newZy_TItle")?.innerHTML || ""
                    );
                    
                    // 优先使用 .Zy_ulTop li 作为选项（已批阅页面）
                    optionElements = element.querySelectorAll(".Zy_ulTop li");
                    if (optionElements.length === 0) {
                        optionElements = element.querySelectorAll('[class*="before-after"]');
                        [optionsObject, optionTexts] = this.extractOptions(optionElements, ".fl.after");
                    } else {
                        // 从 li 中提取选项文本
                        optionElements.forEach((li) => {
                            const text = removeHtml(li.querySelector("a")?.innerHTML || li.innerHTML);
                            // 去掉 A、B、C、D 前缀
                            const cleanText = text.replace(/^[A-D]、/, "").trim();
                            optionTexts.push(cleanText);
                        });
                    }
                } else if (["zy", "ks"].includes(this.type)) {
                    const titleElement = element.querySelector("h3")?.innerHTML || "";
                    const colorShallowElement = element.querySelector(".colorShallow")?.outerHTML || "";
                    
                    if (["zy"].includes(this.type)) {
                        questionTypeText = element.getAttribute("typename") || "";
                    } else if (["ks"].includes(this.type)) {
                        questionTypeText = removeHtml(colorShallowElement).slice(1, 4) || "";
                    }
                    
                    questionTitle = removeHtml(
                        titleElement.split(colorShallowElement || "")[1] || ""
                    );
                    optionElements = element.querySelectorAll(".answerBg");
                    [optionsObject, optionTexts] = this.extractOptions(optionElements, ".answer_p");
                }
                
                // 提取我的答案和正确答案（从已批阅页面）
                const myAnswerText = this.extractMyAnswer(element);
                const correctAnswerText = this.extractCorrectAnswer(element);
                
                // 处理答案格式（多选题可能是ACD，判断题是对/错，填空题用分号分隔）
                const userAnswerList = this.parseAnswerText(myAnswerText, optionTexts);
                const correctAnswerList = correctAnswerText ? [correctAnswerText.trim()] : [];
                
                this.questions.push({
                    element,
                    type: questionType[questionTypeText.replace("【", "").replace("】", "")] || "999",
                    typeText: questionTypeText,
                    title: clean(questionTitle),
                    optionsText: optionTexts,
                    options: optionsObject,
                    answer: { 
                        code: correctAnswerText && correctAnswerText.trim() ? 1 : -1, 
                        answer: correctAnswerList
                    },
                    userAnswer: userAnswerList,
                    workType: this.type,
                    refer: this._window.location.href
                });
            });
        }

        // 解析答案文本（处理单选、多选、判断题、填空题）
        parseAnswerText(answerText, optionTexts) {
            if (!answerText) return [];
            
            const trimmed = answerText.trim();
            const result = [];
            
            // 判断题
            if (trimmed === '对' || trimmed === '正确') {
                return [{ optionLabel: '对', optionText: '正确' }];
            }
            if (trimmed === '错' || trimmed === '错误') {
                return [{ optionLabel: '错', optionText: '错误' }];
            }
            
            // 填空题（用分号分隔）
            if (trimmed.includes(';')) {
                const parts = trimmed.split(';');
                parts.forEach((part, index) => {
                    if (part.trim()) {
                        result.push({
                            optionLabel: `第${index + 1}空`,
                            optionText: part.trim()
                        });
                    }
                });
                return result;
            }
            
            // 单选题或多选题（如 "D" 或 "ACD"）
            for (const char of trimmed) {
                if (/[A-D]/.test(char)) {
                    const index = char.charCodeAt(0) - 65;
                    result.push({
                        optionLabel: char,
                        optionText: optionTexts[index] || ''
                    });
                }
            }
            
            return result;
        }

        // 根据选项标签获取选项文本
        getOptionTextByLabel(optionTexts, label) {
            const index = label.charCodeAt(0) - 65;
            return optionTexts[index] || "";
        }

        // 提取我的答案（从已批阅页面）
        extractMyAnswer(element) {
            // 单选/多选/判断题
            let myAnswerEl = element.querySelector(".myAnswerBx .myAnswer .answerCon") || 
                             element.querySelector(".myAnswer .answerCon") ||
                             element.querySelector(".myAnswerBx .answerCon");
            if (myAnswerEl && myAnswerEl.innerText.trim()) {
                return myAnswerEl.innerText.trim();
            }
            
            // 填空题
            const fillAnswerEls = element.querySelectorAll(".myAllAnswerBx .myAnswer p");
            if (fillAnswerEls.length > 0) {
                const answers = [];
                fillAnswerEls.forEach(p => {
                    answers.push(p.innerText.trim());
                });
                return answers.join(";");
            }
            
            return "";
        }

        // 提取正确答案（从已批阅页面）
        extractCorrectAnswer(element) {
            // 单选/多选/判断题
            let correctAnswerEl = element.querySelector(".correctAnswerBx .correctAnswer .answerCon") || 
                                  element.querySelector(".correctAnswer .answerCon") ||
                                  element.querySelector(".correctAnswerBx .answerCon");
            if (correctAnswerEl && correctAnswerEl.innerText.trim()) {
                return correctAnswerEl.innerText.trim();
            }
            
            // 填空题
            const fillCorrectEls = element.querySelectorAll(".correctAnswerBx .correctAnswer.marTop16");
            if (fillCorrectEls.length > 0) {
                const answers = [];
                fillCorrectEls.forEach(div => {
                    const text = div.innerText.trim();
                    // 提取答案内容（去掉 "第一空：" 前缀）
                    const match = text.match(/第[一二三四五六七八九十]+空[：:]\s*(.+)/);
                    if (match) {
                        answers.push(match[1].trim());
                    } else {
                        answers.push(text);
                    }
                });
                return answers.join(";");
            }
            
            return "";
        }

        // 提取选项
        extractOptions(optionElements, optionSelector) {
            const optionsObject = {};
            const optionTexts = [];
            
            optionElements.forEach((optionElement) => {
                const optionTextContent = removeHtml(
                    optionElement.querySelector(optionSelector)?.innerHTML || ""
                );
                optionsObject[optionTextContent] = optionElement;
                optionTexts.push(optionTextContent);
            });
            
            return [optionsObject, optionTexts];
        }

        // 提取用户已选择的答案（用于未批阅页面）
        extractUserAnswer(element, optionElements, optionTexts) {
            const userAnswers = [];
            
            if (["zj"].includes(this.type)) {
                optionElements.forEach((optEl, index) => {
                    if (optEl.getAttribute("aria-checked") === "true") {
                        userAnswers.push({
                            optionIndex: index,
                            optionLabel: String.fromCharCode(65 + index),
                            optionText: optionTexts[index] || ""
                        });
                    }
                });
            } else if (["zy", "ks"].includes(this.type)) {
                optionElements.forEach((optEl, index) => {
                    const checkAnswer = optEl.querySelector(".check_answer");
                    const checkAnswerDx = optEl.querySelector(".check_answer_dx");
                    if (checkAnswer || checkAnswerDx) {
                        userAnswers.push({
                            optionIndex: index,
                            optionLabel: String.fromCharCode(65 + index),
                            optionText: optionTexts[index] || ""
                        });
                    }
                });
            }
            
            return userAnswers;
        }
    }

    // 封装JSON数据的函数
    function buildJsonResult(questions, workType, refer, courseInfo) {
        const result = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            refer: refer,
            title: document.title,
            workType: workType,
            workTypeName: workType === 'zj' ? '章节测验' : (workType === 'zy' ? '作业' : (workType === 'ks' ? '考试' : '未知')),
            course: courseInfo,
            totalCount: questions.length,
            questions: questions.map((q, index) => ({
                index: index + 1,
                type: q.type,
                typeText: q.typeText,
                typeName: getTypeName(q.type),
                title: q.title,
                optionsText: q.optionsText,
                options: q.optionsText.map((opt, optIndex) => ({
                    label: String.fromCharCode(65 + optIndex),
                    content: opt
                })),
                userAnswer: q.userAnswer || [],
                answer: q.answer,
                workType: q.workType,
                refer: q.refer
            }))
        };
        return result;
    }

    // 获取题目类型名称
    function getTypeName(type) {
        const typeNames = {
            "0": "单选题",
            "1": "多选题",
            "2": "填空题",
            "3": "判断题",
            "4": "简答题",
            "5": "名词解释",
            "6": "论述题",
            "7": "计算题",
            "999": "未知类型"
        };
        return typeNames[type] || "未知类型";
    }

    // ========== 课程映射（classId → className）==========

    const COURSE_MAP_KEY = 'xcto_course_map';

    /** 从 GM 存储加载课程映射表 */
    function loadCourseMap() {
        const raw = GM_getValue(COURSE_MAP_KEY, '{}');
        try {
            return JSON.parse(raw);
        } catch {
            return {};
        }
    }

    /** 保存课程映射表到 GM 存储 */
    function saveCourseMap(map) {
        GM_setValue(COURSE_MAP_KEY, JSON.stringify(map));
    }

    /** 根据 classId 查课程名 */
    function getCourseNameByClassId(classId) {
        if (!classId) return null;
        const map = loadCourseMap();
        return map[String(classId)] || null;
    }

    /** 通过 API 抓取课程列表（POST mooc2-ans.chaoxing.com） */
    /** 在指定文档中查找课程卡片并提取映射 */
    function scrapeFromDoc(doc, label) {
        const courseDivs = doc.querySelectorAll(
            '#stuNormalCourseListDiv .course.clearfix, ' +
            '#stuTopCourseListDiv .course.clearfix, ' +
            '#isState .course.clearfix'
        );
        if (courseDivs.length === 0) return 0;

        insertLog(`[DOM:${label}] 找到 ${courseDivs.length} 个课程卡片`, 'log');
        const map = loadCourseMap();
        let count = 0;

        courseDivs.forEach(div => {
            const clazzInput = div.querySelector('.course-cover input.clazzId');
            const classId = clazzInput ? clazzInput.value : null;
            const nameSpan = div.querySelector('.course-info .course-name');
            const className = nameSpan ? (nameSpan.getAttribute('title') || nameSpan.innerText || '').trim() : null;

            if (classId && className) {
                map[String(classId)] = className;
                count++;
                insertLog(`  [DOM] ${classId} → "${className}"`, 'log');
            }
        });

        if (count > 0) saveCourseMap(map);
        insertLog(`[DOM:${label}] 抓取: ${count} 门 (总计 ${Object.keys(map).length} 门)`, 'log');
        return count;
    }

    /** 通过 DOM 抓取课程列表（先查主文档，再查 #frame_content iframe，再查所有 iframe） */
    function scrapeCourseMap() {
        // 1. 主文档
        let count = scrapeFromDoc(document, 'main');
        if (count > 0) return count;

        // 2. #frame_content iframe（i.chaoxing.com/base 的课程列表在这里）
        const frameIframe = document.querySelector('#frame_content');
        if (frameIframe && frameIframe.contentDocument) {
            count = scrapeFromDoc(frameIframe.contentDocument, 'frame_content');
            if (count > 0) return count;
        }

        // 3. 遍历所有 iframe
        const allIframes = document.querySelectorAll('iframe');
        for (const iframe of allIframes) {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                if (doc) {
                    count = scrapeFromDoc(doc, iframe.id || iframe.src?.slice(0, 50));
                    if (count > 0) return count;
                }
            } catch (e) {
                // 跨域 iframe 无法访问，跳过
            }
        }

        return 0;
    }

    /** 更新面板中的课程信息显示 */
    function updateCourseInfoDisplay(classId, className) {
        const el = document.getElementById('current-course-info');
        if (el) {
            el.value = className || classId || '';
            el.title = `classId: ${classId}`;
        }
    }

    // 获取课程信息
    function getCourseInfo(iframeDoc) {
        const courseInfo = {
            courseId: '',
            courseName: '',
            chapterId: '',
            chapterName: '',
            workName: '',
            clazzId: '',
            cpi: ''
        };

        // 从URL获取参数
        const urlParams = new URLSearchParams(window.location.search);
        courseInfo.courseId = urlParams.get('courseId') || '';
        courseInfo.chapterId = urlParams.get('chapterId') || urlParams.get('knowledgeid') || '';
        courseInfo.clazzId = urlParams.get('clazzid') || urlParams.get('classId') || '';
        courseInfo.cpi = urlParams.get('cpi') || '';

        // 从课程映射表查找，命中则使用；未命中直接用 classId
        const mappedName = getCourseNameByClassId(courseInfo.clazzId);
        courseInfo.courseName = mappedName || courseInfo.clazzId || '';

        // 更新面板显示
        updateCourseInfoDisplay(courseInfo.clazzId, courseInfo.courseName);

        // 从页面获取章节名称
        const chapterNameEl = document.querySelector('.posCatalog_select.posCatalog_active > .posCatalog_name') ||
                              document.querySelector('.chapter-name') ||
                              document.querySelector('[class*="chapter"] h4');
        if (chapterNameEl) {
            courseInfo.chapterName = chapterNameEl.innerText.trim();
        }

        // 从iframe获取测验名称
        if (iframeDoc) {
            const workNameEl = iframeDoc.querySelector('#RightCon > div.radiusBG > div > div.ceyan_name > h3') ||
                               iframeDoc.querySelector('.ceyan_name h3') ||
                               iframeDoc.querySelector('.workName') ||
                               iframeDoc.querySelector('h3.title');
            if (workNameEl) {
                courseInfo.workName = workNameEl.innerText.trim();
            }
        }

        return courseInfo;
    }

    // 获取正确答案
    async function fetchAnswers(questions, courseId) {
        const apiUrl = "https://aichathelper.top/api/question/accurateSearch";
        
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            
            try {
                insertLog(`正在获取第 ${i + 1} 题答案...`, 'log');
                
                const data = JSON.stringify({
                    question: question.title,
                    options: question.optionsText,
                    type: question.type,
                    workType: question.workType,
                    id: courseId || ''
                });

                const response = await new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        url: apiUrl,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: data,
                        timeout: 10000,
                        onload: (res) => {
                            try {
                                resolve(JSON.parse(res.responseText));
                            } catch (e) {
                                resolve({ code: -1, data: { answer: [] } });
                            }
                        },
                        onerror: () => resolve({ code: -1, data: { answer: [] } }),
                        ontimeout: () => resolve({ code: -1, data: { answer: [] } })
                    });
                });

                if (response.code === 1 && response.data && response.data.answer) {
                    question.answer = {
                        code: response.code,
                        answer: response.data.answer
                    };
                    insertLog(`第 ${i + 1} 题答案: ${response.data.answer.join(', ')}`, 'log');
                } else {
                    question.answer = {
                        code: response.code || -1,
                        answer: [],
                        msg: response.msg || '未找到答案'
                    };
                    insertLog(`第 ${i + 1} 题未找到答案`, 'warning');
                }

                await new Promise(r => setTimeout(r, 500));
                
            } catch (e) {
                insertLog(`第 ${i + 1} 题获取答案失败: ${e.message}`, 'warning');
                question.answer = { code: -1, answer: [] };
            }
        }
        
        return questions;
    }

    // 将答案文本解析为后端格式的数组
    function parseAnswerForBackend(answerText) {
        if (!answerText) return [];
        const trimmed = answerText.trim();
        // 判断题
        if (trimmed === '对' || trimmed === '正确') return ['对'];
        if (trimmed === '错' || trimmed === '错误') return ['错'];
        // 填空题（分号分隔）
        if (trimmed.includes(';')) {
            return trimmed.split(';').map(s => s.trim()).filter(s => s);
        }
        // 单选或多选（如 "D" 或 "ACD"），拆分为单个字母
        if (/^[A-D]+$/.test(trimmed)) {
            return trimmed.split('');
        }
        return [trimmed];
    }

    // 将解析结果保存到后端数据库
    async function saveToBackend(result) {
        const backendUrl = GM_getValue('backendUrl', 'http://localhost:65535');
        const clazzIdStr = result.course.clazzId || result.course.courseId;

        if (!clazzIdStr) {
            insertLog('未获取到 classId，跳过保存到后端', 'warning');
            return;
        }

        const classId = parseInt(clazzIdStr);
        if (isNaN(classId) || classId <= 0) {
            insertLog(`无效的 classId: ${clazzIdStr}，跳过保存`, 'warning');
            return;
        }

        const backendQuestions = result.questions.map(q => {
            const answerArray = q.answer && q.answer.code === 1
                ? parseAnswerForBackend(q.answer.answer[0] || '')
                : [];

            return {
                questionType: parseInt(q.type) || 0,
                question: q.title,
                options: JSON.stringify(q.optionsText || []),
                answer: answerArray.length > 0 ? JSON.stringify(answerArray) : null
            };
        });

        const payload = {
            classId: classId,
            className: result.course.courseName || null,
            questions: backendQuestions
        };

        insertLog(`正在保存 ${backendQuestions.length} 道题目到后端...`, 'log');

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: backendUrl + '/question/saveBatchNew',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(payload),
                    timeout: 15000,
                    onload: (res) => {
                        if (res.status === 200) {
                            resolve(res.responseText);
                        } else {
                            reject(new Error(`HTTP ${res.status}: ${res.responseText}`));
                        }
                    },
                    onerror: () => reject(new Error('网络请求失败')),
                    ontimeout: () => reject(new Error('请求超时'))
                });
            });

            insertLog(`保存成功: ${response}`, 'log');
        } catch (e) {
            insertLog(`保存到后端失败: ${e.message}`, 'warning');
        }
    }

    // 主解析函数
    async function parseQuestions() {
        insertLog('开始解析页面题目...', 'log');
        
        const documentElement = document.documentElement;
        let allQuestions = [];
        let workType = 'unknown';
        let refer = window.location.href;
        let foundIframeDoc = null;

        // 方法1: 检查主文档中是否有题目
        const mainTiMu = document.querySelectorAll('.TiMu');
        const mainQuestionLi = document.querySelectorAll('.questionLi');

        if (mainTiMu.length > 0) {
            insertLog(`主文档中检测到 ${mainTiMu.length} 道章节测验题目`, 'log');
            const handler = new QuestionHandler('zj', null);
            allQuestions = handler.parseHtml();
            workType = 'zj';
        } else if (mainQuestionLi.length > 0) {
            insertLog(`主文档中检测到 ${mainQuestionLi.length} 道作业/考试题目`, 'log');
            const handler = new QuestionHandler('zy', null);
            allQuestions = handler.parseHtml();
            workType = 'zy';
        }

        // 方法2: 检查iframe中的题目
        if (allQuestions.length === 0) {
            insertLog('主文档中未检测到题目，正在检查iframe...', 'log');
            
            const iframes = getAllNestedIframes(documentElement);
            insertLog(`找到 ${iframes.length} 个iframe`, 'log');

            for (const iframe of iframes) {
                try {
                    await waitIframeLoad(iframe);
                    
                    const iframeDoc = iframe.contentDocument;
                    if (!iframeDoc) continue;

                    // 检查iframe中的题目
                    const iframeTiMu = iframeDoc.querySelectorAll('.TiMu');
                    const iframeQuestionLi = iframeDoc.querySelectorAll('.questionLi');

                    if (iframeTiMu.length > 0) {
                        insertLog(`iframe中检测到 ${iframeTiMu.length} 道章节测验题目`, 'log');
                        const handler = new QuestionHandler('zj', iframe);
                        const questions = handler.parseHtml();
                        allQuestions = allQuestions.concat(questions);
                        workType = 'zj';
                        refer = iframe.contentWindow?.location?.href || refer;
                        foundIframeDoc = iframeDoc;
                    } else if (iframeQuestionLi.length > 0) {
                        insertLog(`iframe中检测到 ${iframeQuestionLi.length} 道作业/考试题目`, 'log');
                        const handler = new QuestionHandler('zy', iframe);
                        const questions = handler.parseHtml();
                        allQuestions = allQuestions.concat(questions);
                        workType = 'zy';
                        refer = iframe.contentWindow?.location?.href || refer;
                        foundIframeDoc = iframeDoc;
                    }
                } catch (e) {
                    insertLog(`处理iframe时出错: ${e.message}`, 'warning');
                }
            }
        }

        if (allQuestions.length === 0) {
            insertLog('当前页面没有测验或未公布答案，准备跳转下一页...', 'warning');
            // 返回空结果而不是null，让翻页逻辑继续执行
            return {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                refer: refer,
                title: document.title,
                workType: workType,
                course: getCourseInfo(foundIframeDoc),
                totalCount: 0,
                questions: []
            };
        }

        // 获取课程信息
        const courseInfo = getCourseInfo(foundIframeDoc);
        insertLog(`课程: ${courseInfo.courseName || '未获取到'}`, 'log');
        insertLog(`章节: ${courseInfo.chapterName || '未获取到'}`, 'log');
        insertLog(`测验: ${courseInfo.workName || '未获取到'}`, 'log');

        // 统计答案获取情况
        const hasAnswerCount = allQuestions.filter(q => q.answer.code === 1).length;
        insertLog(`已从页面获取到 ${hasAnswerCount}/${allQuestions.length} 道题目的答案`, 'log');

        // 只对没有答案的题目调用API
        const noAnswerQuestions = allQuestions.filter(q => q.answer.code !== 1);
        if (noAnswerQuestions.length > 0) {
            insertLog(`正在为 ${noAnswerQuestions.length} 道题目获取答案...`, 'log');
            await fetchAnswers(noAnswerQuestions, courseInfo.courseId);
        }

        // 调用封装JSON函数
        const result = buildJsonResult(allQuestions, workType, refer, courseInfo);

        // 输出日志
        insertLog('=================================', 'log');
        insertLog(`共解析到 ${allQuestions.length} 道题目`, 'log');
        insertLog(`题目类型: ${workType === 'zj' ? '章节测验' : '作业/考试'}`, 'log');
        insertLog('JSON数据已生成，请查看控制台(F12)', 'log');
        insertLog('=================================', 'log');

        // 打印完整的JSON到控制台
        console.log('========== 题目JSON数据 ==========');
        console.log(JSON.stringify(result, null, 2));
        console.log('==================================');

        return result;
    }

    // 创建调试面板 HTML
    const createDebugPanel = () => {
        const panel = document.createElement('div');
        panel.className = 'main-wrap';
        panel.innerHTML = `
            <div class="main-box">
                <div class="box-header">
                    <div class="script-info">调试界面</div>
                    <div></div>
                </div>
                <div class="box-content">
                    <div class="config-section">
                        <div class="section-title">当前课程</div>
                        <div class="config-row">
                            <input type="text" id="current-course-info" placeholder="classId" style="width:160px;">
                            <button id="save-course-name" title="保存课程名到映射表">💾</button>
                        </div>
                    </div>
                    <div class="config-section">
                        <div class="section-title">配置信息</div>
                        <div class="config-row">
                            <span>后端地址:</span>
                            <input type="text" id="backend-url" placeholder="http://localhost:65535">
                            <button id="save-backend-url">保存</button>
                        </div>
                        <div class="config-row">
                            <span>自动获取:</span>
                            <input type="checkbox" id="auto-answer" checked>
                            <button id="save-auto-answer">保存</button>
                        </div>
                        <div class="config-row">
                            <span>自动翻页:</span>
                            <input type="checkbox" id="auto-change-next" checked>
                            <button id="save-auto-change-next">保存</button>
                        </div>
                    </div>
                    <div class="config-section">
                        <div class="section-title">操作</div>
                        <button class="btn-primary" id="start-fetch">开始获取题目</button>
                    </div>
                    <div class="config-section">
                        <div class="section-title">日志信息</div>
                        <div class="log-wrap">
                            <div class="console" id="log-console">
                                <div>
                                    <span class="log">[日志]</span>
                                    <span>等待用户进入正确页面..</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return panel;
    };

    // 绑定按钮事件
    function bindEvents() {
        // 保存课程名按钮（手动编辑后写入映射表）
        const saveCourseNameBtn = document.getElementById('save-course-name');
        if (saveCourseNameBtn) {
            saveCourseNameBtn.addEventListener('click', () => {
                const input = document.getElementById('current-course-info');
                const urlParams = new URLSearchParams(window.location.search);
                const classId = urlParams.get('clazzid') || urlParams.get('classId') || '';
                if (!classId) {
                    insertLog('未检测到 classId，无法保存', 'warning');
                    return;
                }
                const newName = input.value.trim();
                if (!newName) {
                    insertLog('课程名不能为空', 'warning');
                    return;
                }
                const map = loadCourseMap();
                map[String(classId)] = newName;
                saveCourseMap(map);
                insertLog(`课程名已保存: ${newName} (classId: ${classId})`, 'log');
                updateCourseInfoDisplay(classId, newName);
            });
        }

        // 开始获取题目按钮
        const startBtn = document.getElementById('start-fetch');
        if (startBtn) {
            startBtn.addEventListener('click', async () => {
                insertLog('用户点击【开始获取题目】按钮', 'log');
                await runAutoLoop();
            });
        }

        // 保存获取题目开关
        const saveAutoAnswerBtn = document.getElementById('save-auto-answer');
        if (saveAutoAnswerBtn) {
            saveAutoAnswerBtn.addEventListener('click', () => {
                const checked = document.getElementById('auto-answer').checked;
                GM_setValue('autoAnswer', checked);
                insertLog(`自动获取已${checked ? '开启' : '关闭'}`, 'log');
            });
        }

        // 保存自动翻页开关
        const saveAutoChangeNextBtn = document.getElementById('save-auto-change-next');
        if (saveAutoChangeNextBtn) {
            saveAutoChangeNextBtn.addEventListener('click', () => {
                const checked = document.getElementById('auto-change-next').checked;
                GM_setValue('autoChangeNext', checked);
                insertLog(`自动翻页已${checked ? '开启' : '关闭'}`, 'log');
            });
        }

        // 保存后端地址
        const saveBackendUrlBtn = document.getElementById('save-backend-url');
        if (saveBackendUrlBtn) {
            saveBackendUrlBtn.addEventListener('click', () => {
                const url = document.getElementById('backend-url').value.trim();
                if (url) {
                    GM_setValue('backendUrl', url);
                    insertLog(`后端地址已设置为: ${url}`, 'log');
                }
            });
        }

        // 加载保存的设置
        const autoAnswer = GM_getValue('autoAnswer', true);
        const autoChangeNext = GM_getValue('autoChangeNext', true);
        const backendUrl = GM_getValue('backendUrl', 'http://localhost:65535');
        document.getElementById('auto-answer').checked = autoAnswer;
        document.getElementById('auto-change-next').checked = autoChangeNext;
        document.getElementById('backend-url').value = backendUrl;

    // 监听"课程"菜单点击 → 等 iframe 加载完成 → 自动抓取
    function setupAutoScrape() {
        const courseMenuItem = document.querySelector('[name="课程"]');
        if (!courseMenuItem) {
            // 不在 i.chaoxing.com/base，不启用
            return;
        }

        // 等待 iframe 加载 → 轮询课程卡片出现 → 抓取
        async function doScrape() {
            const frameIframe = document.querySelector('#frame_content');
            if (!frameIframe) return;

            insertLog('[自动] 等待课程卡片渲染...', 'log');

            // 轮询等待卡片出现，最多等 30 秒
            for (let i = 0; i < 60; i++) {
                await new Promise(r => setTimeout(r, 500));
                let doc = null;
                try { doc = frameIframe.contentDocument; } catch (e) {}
                if (!doc) continue;
                const cards = doc.querySelectorAll(
                    '#stuNormalCourseListDiv .course.clearfix, ' +
                    '#stuTopCourseListDiv .course.clearfix, ' +
                    '#isState .course.clearfix'
                );
                if (cards.length > 0) {
                    insertLog(`[自动] 检测到 ${cards.length} 个课程卡片`, 'log');
                    break;
                }
            }

            const count = scrapeCourseMap();
            if (count > 0) {
                insertLog(`[自动] 抓取完成: ${count} 门`, 'log');
                const p = new URLSearchParams(window.location.search);
                const id = p.get('clazzid') || p.get('classId') || '';
                updateCourseInfoDisplay(id, getCourseNameByClassId(id) || id);
            }
        }

        // 点击"课程"菜单 → 抓取
        courseMenuItem.addEventListener('click', () => {
            insertLog('[自动] 检测到"课程"菜单点击', 'log');
            doScrape();
        });

        // 初始就在课程 tab → 自动抓取
        if (courseMenuItem.classList.contains('active') || courseMenuItem.classList.contains('cur')) {
            insertLog('[自动] 初始在课程 tab', 'log');
            doScrape();
        }
    }

        // 启动自动抓取
        setupAutoScrape();

        // 刷新当前课程显示
        const urlParams = new URLSearchParams(window.location.search);
        const classId = urlParams.get('clazzid') || urlParams.get('classId') || '';
        const className = getCourseNameByClassId(classId);
        updateCourseInfoDisplay(classId, className);

        // 添加拖动功能
        makeDraggable();

        // 如果开启了自动获取，则自动开始
        if (autoAnswer) {
            setTimeout(async () => {
                await runAutoLoop();
            }, 2000);
        }
    }

    // 自动循环：获取题目 -> 翻页 -> 等待加载 -> 继续
    async function runAutoLoop() {
        const autoChangeNext = GM_getValue('autoChangeNext', true);
        
        while (true) {
            insertLog('开始获取题目...', 'log');
            const result = await parseQuestions();
            
            if (result && result.totalCount > 0) {
                GM_setValue('lastParsedQuestions', JSON.stringify(result));
                await saveToBackend(result);
            }

            // 如果没有开启自动翻页，停止循环
            if (!autoChangeNext) {
                insertLog('自动翻页已关闭，停止自动获取', 'log');
                break;
            }
            
            // 尝试翻页
            const canContinue = await autoNextPage();
            
            // 如果无法继续翻页，停止循环
            if (!canContinue) {
                break;
            }
            
            // 等待新页面加载
            insertLog('等待新页面加载...', 'log');
            await new Promise(r => setTimeout(r, 3000));
        }
    }

    // 自动翻页功能，返回是否成功翻页
    async function autoNextPage() {
        insertLog('正在检查是否可以翻页...', 'log');
        
        await new Promise(r => setTimeout(r, 1000));
        
        // 获取当前章节名称
        const chapterNameEl = document.querySelector('.posCatalog_select.posCatalog_active > .posCatalog_name');
        const chapterName = chapterNameEl ? chapterNameEl.innerText : '未知章节';
        
        // 查找下一页按钮
        const nextBtn = document.querySelector('#prevNextFocusNext');
        const nextChapterBtn = document.querySelector('.jb_btn.jb_btn_92.fr.fs14.nextChapter');
        
        if (nextBtn && nextBtn.style.display !== 'none') {
            insertLog(`当前章节【${chapterName}】处理完成，即将跳转下一页...`, 'log');
            await new Promise(r => setTimeout(r, 1500));
            
            if (nextChapterBtn) {
                nextChapterBtn.click();
                insertLog('已点击下一页按钮，等待页面加载...', 'log');
                return true;
            } else if (nextBtn) {
                nextBtn.click();
                insertLog('已点击下一页按钮，等待页面加载...', 'log');
                return true;
            }
        }
        
        insertLog('已是最后一个章节，自动获取结束', 'warning');
        return false;
    }

    // 拖动功能
    function makeDraggable() {
        const panel = document.querySelector('.main-wrap');
        const header = document.querySelector('.main-box .box-header');
        
        if (!panel || !header) return;

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            
            // 边界限制
            newX = Math.max(0, Math.min(newX, window.innerWidth - panel.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - panel.offsetHeight));
            
            panel.style.left = newX + 'px';
            panel.style.top = newY + 'px';
            panel.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'move';
        });
    }

    // 判断是否在课程内容页（有题目的页面，而非课程列表页）
    function isCourseContentPage() {
        const url = window.location.href;
        const params = new URLSearchParams(window.location.search);
        // 有 courseId/clazzid/chapterId 参数 → 课程内容页 → 显示面板
        if (params.get('courseId') || params.get('clazzid') || params.get('classId') || params.get('chapterId') || params.get('knowledgeid')) {
            return true;
        }
        // mooc2-ans 域名 → 课程内容页
        if (url.includes('mooc2-ans.chaoxing.com')) return true;
        // 其他情况（如 i.chaoxing.com/base）→ 课程列表页，不显示
        return false;
    }

    // 等待页面加载完成
    const timer = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(timer);
            const panel = createDebugPanel();
            document.body.appendChild(panel);

            if (isCourseContentPage()) {
                // 课程内容页 → 显示面板
                panel.style.display = 'block';
                insertLog('调试面板已加载（课程内容页，自动显示）', 'log');
            } else {
                // 课程列表页 → 隐藏面板，后台静默运行
                panel.style.display = 'none';
                insertLog('调试面板已加载（课程列表页，默认隐藏，按 Ctrl+Shift+X 切换显示）', 'log');
            }
            bindEvents();
            insertLog(`当前页面: ${window.location.href}`, 'log');

            // 快捷键 Ctrl+Shift+X 切换面板显示
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'X') {
                    e.preventDefault();
                    const p = document.querySelector('.main-wrap');
                    if (p) {
                        const hidden = p.style.display === 'none';
                        p.style.display = hidden ? 'block' : 'none';
                        insertLog(hidden ? '面板已显示' : '面板已隐藏', 'log');
                    }
                }
            });
        }
    }, 100);
})();
