package cc.bexerlmao.xcto.question;

import com.baomidou.mybatisplus.annotation.EnumValue;

public enum QuestionType {
    SINGLE_CHOICE(0),
    MULTIPLE_CHOICE(1),
    TRUE_FALSE(3),
    SHORT_ANSWER(2);

    @EnumValue
    private final Integer questionTypeNumber;

    QuestionType(Integer questionTypeNumber){
        this.questionTypeNumber = questionTypeNumber;
    }
}
