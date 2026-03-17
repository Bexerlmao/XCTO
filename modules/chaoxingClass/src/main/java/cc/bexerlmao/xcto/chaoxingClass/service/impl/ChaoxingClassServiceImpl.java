package cc.bexerlmao.xcto.chaoxingClass.service.impl;

import cc.bexerlmao.xcto.chaoxingClass.mapper.ChaoxingClassMapper;
import cc.bexerlmao.xcto.chaoxingClass.service.ChaoxingClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ChaoxingClassServiceImpl implements ChaoxingClassService {

    @Autowired
    private ChaoxingClassMapper chaoxingClassMapper;

    @Override
    public Long getQuestionTotalById(Long id) {
        return chaoxingClassMapper.getClassQuestionTotalById(id);
    }

    @Override
    public Long getQuestionTotalByClassId(Long classId) {
        return chaoxingClassMapper.getClassQuestionTotalByClassId(classId);
    }

    @Override
    public void updateClassTotalByClassId(Long classId, Long deltaTotal) {
        Long questionTotal = getQuestionTotalByClassId(classId);
        if (questionTotal == null) {
            insertClass(classId);
            questionTotal = 0L;
        }
        Map<String, Long> params = new HashMap<>();
        params.put("classId", classId);
        params.put("total", questionTotal + deltaTotal);
        chaoxingClassMapper.updateClassTotalByClassId(params);
    }

    @Override
    public void insertClass(Long classId) {
        chaoxingClassMapper.insertClass(classId);
    }
}
