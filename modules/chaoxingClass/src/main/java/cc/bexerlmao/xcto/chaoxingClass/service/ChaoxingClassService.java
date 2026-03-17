package cc.bexerlmao.xcto.chaoxingClass.service;

public interface ChaoxingClassService {

    Long getQuestionTotalById(Long id);

    Long getQuestionTotalByClassId(Long classId);

    void updateClassTotalByClassId(Long classId, Long deltaTotal);

    void insertClass(Long classId);

}
