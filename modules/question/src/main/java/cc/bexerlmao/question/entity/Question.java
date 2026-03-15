package cc.bexerlmao.question.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Map;

@Data
@TableName("`question`")
public class Question {

    private long id;
    private long classId;
    private String question;
    private Map<Integer, String> options;
    private Integer answer;

    public Question() {
    }

    public Question(long classId, String question, Map<Integer, String> options, Integer answer) {
        this.classId = classId;
        this.question = question;
        this.options = options;
        this.answer = answer;
    }
}


