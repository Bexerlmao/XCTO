package cc.bexerlmao.xcto.chaoxingClass.service;

import cc.bexerlmao.xcto.chaoxingClass.entity.ChaoxingClassEntity;

import java.util.List;

public interface ChaoxingClassService {

    Long getQuestionTotalById(Long id);

    Long getQuestionTotalByClassId(Long classId);

    void updateClassTotalByClassId(Long classId, Long deltaTotal);

    void insertClass(Long classId);

    List<ChaoxingClassEntity> listAllClasses();

}
