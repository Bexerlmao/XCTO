package cc.bexerlmao.question.service;

import cc.bexerlmao.question.entity.Question;

import java.util.List;

public interface GetQuestionService {

    /**
     * 保存题目
     * @param question 所需要保存的题目
     */
    void saveQuestion(Question question);


    void saveQuestions(List<Question> questions);


    Question getQuestionById(Long id);


    List<Question> getAllQuestions();


    List<Question> getQuestionsByClassId(Long classId);



    void updateQuestion(Question question);


    void deleteQuestion(Long id);

}
