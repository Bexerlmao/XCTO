package cc.bexerlmao.xcto.question.service.impl;

import cc.bexerlmao.xcto.chaoxingClass.service.ChaoxingClassService;
import cc.bexerlmao.xcto.question.entity.Question;
import cc.bexerlmao.xcto.question.entity.QuestionBatchRequest;
import cc.bexerlmao.xcto.question.mapper.QuestionMapper;
import cc.bexerlmao.xcto.question.service.GetQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Random;


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
        Long questionTotal = chaoxingClassService.getQuestionTotalByClassId(classId);
        Random random = new Random();
        random.setSeed(LocalTime.now().toNanoOfDay());
        return questionMapper.selectQuestionById(random.nextLong(questionTotal));
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
        // 为每个题目设置classId，确保一致性
        for (Question question : questions) {
            question.setClassId(classId);
        }
        
        questionMapper.batchInsertQuestion(questions);
        // 更新班级题目总数
        Long currentTotal = chaoxingClassService.getQuestionTotalByClassId((long) classId);
        if (currentTotal == null) {
            // 班级不存在，插入新记录
            chaoxingClassService.insertClass(classId);
        } else {
            // 班级存在，更新题目总数
            chaoxingClassService.updateClassTotalByClassId((long) classId, currentTotal + questions.size());
        }
    }

}
