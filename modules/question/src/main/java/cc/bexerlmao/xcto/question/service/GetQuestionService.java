package cc.bexerlmao.xcto.question.service;

import cc.bexerlmao.xcto.question.entity.Question;
import cc.bexerlmao.xcto.question.entity.QuestionBatchRequest;

import java.util.List;

public interface GetQuestionService {

    /**
     * 保存题目
     *
     * @param question 所需要保存的题目
     */
    void saveQuestion(Question question);


    void saveQuestions(List<Question> questions);

    void saveQuestionsNew(QuestionBatchRequest request);


    Question getQuestionById(Long id);

    Question getRandomQuestion(Long classId);

    List<Question> getAllQuestions();


    List<Question> getQuestionsByClassId(Long classId);


    void updateQuestion(Question question);


    void deleteQuestion(Long id);

}
