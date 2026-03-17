package cc.bexerlmao.xcto.question.entity;

import lombok.Data;

import java.util.List;

@Data
public class QuestionBatchRequest {

    private long classId;
    private List<Question> questions;

}
