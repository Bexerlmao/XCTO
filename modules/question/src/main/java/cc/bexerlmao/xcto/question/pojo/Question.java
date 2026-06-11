package cc.bexerlmao.xcto.question.pojo;

import cc.bexerlmao.xcto.question.util.JsonStringDeserializer;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.annotation.Nonnull;
import lombok.Data;

@Data
@TableName(value = "`question`", autoResultMap = true)
public class Question {

    private Long id;
    private Long classId;
    private Integer questionType;
    private String question;

    @JsonRawValue
    @JsonDeserialize(using = JsonStringDeserializer.class)
    private String options;

    @JsonRawValue
    @JsonDeserialize(using = JsonStringDeserializer.class)
    private String answer;

    public Question() {
    }

    public Question(@Nonnull Long classId, @Nonnull String question, @Nonnull Integer questionType, @Nonnull String options, String answer) {
        this.classId = classId;
        this.question = question;
        this.questionType = questionType;
        this.options = options;
        this.answer = answer;
    }

    @Override
    public String toString() {
        return "Question{" +
                "id=" + id +
                ", classId=" + classId +
                ", questionType=" + questionType +
                ", question='" + question + '\'' +
                ", options=" + options +
                ", answer=" + answer +
                '}';
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (object == null) return false;
        if (object instanceof Question question1) {
            return question1.id.equals(this.id) &&
                    question1.classId.equals(classId) &&
                    question1.questionType.equals(questionType);
        }
        return false;
    }
}
