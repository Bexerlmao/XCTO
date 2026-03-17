package cc.bexerlmao.xcto.question.entity;

import cc.bexerlmao.xcto.question.QuestionType;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Map;

@Data
@TableName("`question`")
public class Question {

    private long id;
    private long classId;
    private QuestionType questionType;
    private String question;
    private Map<Integer, String> options;
    private Integer answer;

    public Question() {
    }

    public Question(long classId, String question,QuestionType questionType, Map<Integer, String> options, Integer answer) {
        this.classId = classId;
        this.question = question;
        this.questionType = questionType;
        this.options = options;
        this.answer = answer;
    }
}


