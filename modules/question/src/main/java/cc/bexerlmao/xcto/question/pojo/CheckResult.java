package cc.bexerlmao.xcto.question.pojo;

import lombok.Data;

import java.util.List;

@Data
public class CheckResult {

    private boolean correct;
    private List<String> correctAnswers;

    public CheckResult(boolean correct, List<String> correctAnswers) {
        this.correct = correct;
        this.correctAnswers = correctAnswers;
    }
}
