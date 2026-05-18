package cc.bexerlmao.xcto.question.pojo;

import cc.bexerlmao.xcto.question.QuestionType;
import com.baomidou.mybatisplus.annotation.TableName;
import jakarta.annotation.Nonnull;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@TableName("`question`")
public class Question {

    private Long id;
    private Long classId;
    private QuestionType questionType;
    private String question;
    private Map<Integer, String> options;
    private List<String> answer;

    public Question() {
    }

    public Question(@Nonnull Long classId, @Nonnull String question, @Nonnull QuestionType questionType, @Nonnull Map<Integer, String> options, List<String> answer) {
        this.classId = classId;
        this.question = question;
        this.questionType = questionType;
        this.options = options;
        this.answer = answer;
    }
}


