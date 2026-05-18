package cc.bexerlmao.xcto.chaoxingClass.service.impl;

import cc.bexerlmao.xcto.chaoxingClass.pojo.ChaoxingClassBo;
import cc.bexerlmao.xcto.chaoxingClass.mapper.ChaoxingClassMapper;
import cc.bexerlmao.xcto.chaoxingClass.service.ChaoxingClassService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChaoxingClassServiceImpl implements ChaoxingClassService {

    private final ChaoxingClassMapper chaoxingClassMapper;

    public ChaoxingClassServiceImpl(ChaoxingClassMapper chaoxingClassMapper) {
        this.chaoxingClassMapper = chaoxingClassMapper;
    }

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

    @Override
    public List<ChaoxingClassBo> listAllClasses() {
        return chaoxingClassMapper.getAllClasses();
    }
}
