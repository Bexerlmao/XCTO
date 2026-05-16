package cc.bexerlmao.xcto.question.service.impl;

import cc.bexerlmao.xcto.chaoxingClass.service.ChaoxingClassService;
import cc.bexerlmao.xcto.question.entity.Question;
import cc.bexerlmao.xcto.question.entity.QuestionBatchRequest;
import cc.bexerlmao.xcto.question.mapper.QuestionMapper;
import cc.bexerlmao.xcto.question.service.GetQuestionService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class GetQuestionServiceImpl implements GetQuestionService {

    private final QuestionMapper questionMapper;
    private final ChaoxingClassService chaoxingClassService;

    public GetQuestionServiceImpl(QuestionMapper questionMapper, ChaoxingClassService chaoxingClassService) {
        this.questionMapper = questionMapper;
        this.chaoxingClassService = chaoxingClassService;
    }

    @Override
    public void saveQuestion(Question question) {
        questionMapper.insertQuestion(question);
        incrementClassTotal(question.getClassId(), 1L);
    }

    @Override
    public void saveQuestions(List<Question> questions) {
        questionMapper.batchInsertQuestion(questions);

        Map<Long, Long> classCountMap = questions.stream()
                .collect(Collectors.groupingBy(Question::getClassId, Collectors.counting()));

        for (Map.Entry<Long, Long> entry : classCountMap.entrySet()) {
            incrementClassTotal(entry.getKey(), entry.getValue());
        }
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
        }
        chaoxingClassService.updateClassTotalByClassId(classId, (long) questions.size());
    }

    @Override
    public Boolean checkQuestionAnswer(Long questionId, List<String> userAnswers) {
        Question question = questionMapper.selectQuestionById(questionId);
        if (question == null || question.getAnswer() == null) {
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
        resultQuestion.setOptions(sourceQuestion.getOptions() != null
                ? new HashMap<>(sourceQuestion.getOptions()) : null);
        resultQuestion.setAnswer(sourceQuestion.getAnswer() != null
                ? new ArrayList<>(sourceQuestion.getAnswer()) : null);
        resultQuestion.setClassId(sourceQuestion.getClassId());
        return resultQuestion;
    }

    private void incrementClassTotal(Long classId, Long delta) {
        Long currentTotal = chaoxingClassService.getQuestionTotalByClassId(classId);
        if (currentTotal == null) {
            chaoxingClassService.insertClass(classId);
        }
        chaoxingClassService.updateClassTotalByClassId(classId, delta);
    }

}
