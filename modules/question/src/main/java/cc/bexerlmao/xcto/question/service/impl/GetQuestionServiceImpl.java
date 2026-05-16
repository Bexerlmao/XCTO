package cc.bexerlmao.xcto.question.service.impl;

import cc.bexerlmao.xcto.chaoxingClass.service.ChaoxingClassService;
import cc.bexerlmao.xcto.question.entity.Question;
import cc.bexerlmao.xcto.question.entity.QuestionBatchRequest;
import cc.bexerlmao.xcto.question.mapper.QuestionMapper;
import cc.bexerlmao.xcto.question.service.GetQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class GetQuestionServiceImpl implements GetQuestionService {

    @Autowired
    private QuestionMapper questionMapper;

    @Autowired
    private ChaoxingClassService chaoxingClassService;

    @Override
    public void saveQuestion(Question question) {
        questionMapper.insertQuestion(question);
    }

    @Override
    public void saveQuestions(List<Question> questions) {
        questionMapper.batchInsertQuestion(questions);
    }

    @Override
    public Question getQuestionById(Long id) {
        return questionMapper.selectQuestionById(id);
    }

    @Override
    public Question getRandomQuestion(Long classId) {
        return questionMapper.selectRandomQuestionByClassId(classId);
    }

    @Override
    public List<Question> getAllQuestions() {
        return questionMapper.selectAllQuestions();
    }

    @Override
    public List<Question> getQuestionsByClassId(Long classId) {
        return questionMapper.selectQuestionsByClassId(classId);
    }

    @Override
    public void updateQuestion(Question question) {
        questionMapper.updateQuestion(question);
    }

    @Override
    public void deleteQuestion(Long id) {
        questionMapper.deleteQuestion(id);
    }

    @Override
    public void saveQuestionsNew(QuestionBatchRequest request) {
        List<Question> questions = request.getQuestions();
        if (questions == null || questions.isEmpty()) {
            return;
        }

        long classId = request.getClassId();
        for (Question question : questions) {
            question.setClassId(classId);
        }

        questionMapper.batchInsertQuestion(questions);

        Long currentTotal = chaoxingClassService.getQuestionTotalByClassId(classId);
        if (currentTotal == null) {
            chaoxingClassService.insertClass(classId);
        } else {
            chaoxingClassService.updateClassTotalByClassId(classId, currentTotal + questions.size());
        }
    }

    @Override
    public Boolean checkQuestionAnswer(Long questionId, List<String> userAnswers) {
        Question question = questionMapper.selectQuestionById(questionId);
        if (question == null) {
            return false;
        }
        return question.getAnswer().equals(userAnswers);
    }

    @Override
    public Question deepCopyQuestion(Question sourceQuestion) {
        Question resultQuestion = new Question();
        resultQuestion.setId(sourceQuestion.getId());
        resultQuestion.setQuestion(sourceQuestion.getQuestion());
        resultQuestion.setQuestionType(sourceQuestion.getQuestionType());
        resultQuestion.setOptions(sourceQuestion.getOptions());
        resultQuestion.setAnswer(sourceQuestion.getAnswer());
        resultQuestion.setClassId(sourceQuestion.getClassId());
        return resultQuestion;
    }

}
