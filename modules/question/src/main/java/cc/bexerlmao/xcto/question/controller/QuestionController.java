package cc.bexerlmao.xcto.question.controller;

import cc.bexerlmao.xcto.question.pojo.CheckResult;
import cc.bexerlmao.xcto.question.pojo.Question;
import cc.bexerlmao.xcto.question.pojo.QuestionBatchRequest;
import cc.bexerlmao.xcto.question.service.GetQuestionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/question")
public class QuestionController {

    private static final Logger log = LoggerFactory.getLogger(QuestionController.class);

    private final GetQuestionService questionService;

    public QuestionController(GetQuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveQuestion(@RequestBody Question question) {
        try {
            questionService.saveQuestion(question);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            log.error("Failed to save question", e);
            return ResponseEntity.internalServerError().body("error");
        }
    }

    @PostMapping("/saveBatch")
    public ResponseEntity<String> saveQuestions(@RequestBody List<Question> questions) {
        try {
            questionService.saveQuestions(questions);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            log.error("Failed to batch save questions", e);
            return ResponseEntity.internalServerError().body("error");
        }
    }

    @PostMapping("/saveBatchNew")
    public ResponseEntity<String> saveQuestionsNew(@RequestBody QuestionBatchRequest request) {
        try {
            questionService.saveQuestionsNew(request);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            log.error("Failed to batch save questions (new)", e);
            return ResponseEntity.internalServerError().body("error");
        }
    }

    @GetMapping("/{classId}")
    public ResponseEntity<Question> getQuestion(@PathVariable Long classId) {
        Question question = questionService.getRandomQuestion(classId);
        if (question == null) {
            return ResponseEntity.notFound().build();
        }
        Question result = questionService.deepCopyQuestion(question);
        System.out.println("Question: " + question.toString());
        result.setAnswer(null);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/getAll")
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateQuestion(@RequestBody Question question) {
        try {
            questionService.updateQuestion(question);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            log.error("Failed to update question", e);
            return ResponseEntity.internalServerError().body("error");
        }
    }

    @PostMapping("/check/{questionId}")
    public CheckResult checkQuestionAnswer(@PathVariable Long questionId, @RequestBody List<String> answers) {
        return questionService.checkQuestionAnswer(questionId, answers);
    }
}
