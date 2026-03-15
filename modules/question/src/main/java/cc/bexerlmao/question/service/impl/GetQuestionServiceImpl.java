package cc.bexerlmao.question.service.impl;

import cc.bexerlmao.question.entity.Question;
import cc.bexerlmao.question.mapper.QuestionMapper;
import cc.bexerlmao.question.service.GetQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class GetQuestionServiceImpl implements GetQuestionService {

    @Autowired
    private QuestionMapper questionMapper;

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

}
