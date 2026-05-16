package cc.bexerlmao.xcto.question.controller;

import cc.bexerlmao.xcto.question.entity.Question;
import cc.bexerlmao.xcto.question.entity.QuestionBatchRequest;
import cc.bexerlmao.xcto.question.service.GetQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/question")
public class QuestionController {

    @Autowired
    private GetQuestionService questionService;

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

    @PostMapping("/saveBatchNew")
    public String saveQuestionsNew(@RequestBody QuestionBatchRequest request) {
        try {
            questionService.saveQuestionsNew(request);
            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "error: " + e.getMessage();
        }
    }

    @GetMapping("/{classId}")
    public Question getQuestion(@PathVariable Long classId) {
        Question question = questionService.getRandomQuestion(classId);
        Question result = questionService.deepCopyQuestion(question);
        result.setAnswer(null);
        return result;
    }

    @GetMapping("/getAll")
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

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

    @PostMapping("/check/{questionId}")
    public Boolean checkQuestionAnswer(@PathVariable Long questionId, @RequestBody List<String> answers) {
        return questionService.checkQuestionAnswer(questionId, answers);
    }
}
