package cc.bexerlmao.xcto.question.pojo;

import lombok.Data;

import java.util.List;

@Data
public class QuestionBatchRequest {

    private long classId;
    private List<Question> questions;

}
