package cc.bexerlmao.xcto.question.mapper;

import cc.bexerlmao.xcto.question.entity.Question;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;


@Mapper
public interface QuestionMapper extends BaseMapper<Question> {
    void insertQuestion(Question question);

    void batchInsertQuestion(List<Question> questions);

    Question selectQuestionById(Long id);

    List<Question> selectAllQuestions();

    List<Question> selectQuestionsByClassId(Long classId);

    void updateQuestion(Question question);

    void deleteQuestion(Long id);
}

