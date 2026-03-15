package cc.bexerlmao.question.controller;

import cc.bexerlmao.question.entity.Question;
import cc.bexerlmao.question.service.GetQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/question")
public class QuestionController {
    
    @Autowired
    private GetQuestionService questionService;
    
    // 保存单个题目
    @PostMapping("/save")
    public String saveQuestion(@RequestBody Question question) {
        try {
            questionService.saveQuestion(question);
            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "error: " + e.getMessage();
        }
    }
    
    // 批量保存题目
    @PostMapping("/saveBatch")
    public String saveQuestions(@RequestBody List<Question> questions) {
        try {
            questionService.saveQuestions(questions);
            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "error: " + e.getMessage();
        }
    }
    
    // 根据ID获取题目
    @GetMapping("/get/{id}")
    public Question getQuestionById(@PathVariable Long id) {
        return questionService.getQuestionById(id);
    }
    
    // 获取所有题目
    @GetMapping("/getAll")
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }
    
    // 根据班级ID获取题目
    @GetMapping("/getByClassId/{classId}")
    public List<Question> getQuestionsByClassId(@PathVariable Long classId) {
        return questionService.getQuestionsByClassId(classId);
    }
    
    // 更新题目
    @PutMapping("/update")
    public String updateQuestion(@RequestBody Question question) {
        try {
            questionService.updateQuestion(question);
            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "error: " + e.getMessage();
        }
    }
    
    // 删除题目
    @DeleteMapping("/delete/{id}")
    public String deleteQuestion(@PathVariable Long id) {
        try {
            questionService.deleteQuestion(id);
            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "error: " + e.getMessage();
        }
    }
}
