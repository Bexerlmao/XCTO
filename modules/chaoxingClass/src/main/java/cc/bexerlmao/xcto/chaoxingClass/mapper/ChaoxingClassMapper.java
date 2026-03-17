package cc.bexerlmao.xcto.chaoxingClass.mapper;

import cc.bexerlmao.xcto.chaoxingClass.entity.ChaoxingClassEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;
@Mapper
public interface ChaoxingClassMapper extends BaseMapper<ChaoxingClassEntity> {


    Long getClassQuestionTotalById(Long classId);

    Long getClassQuestionTotalByClassId(Long classId);

    void insertClass (Long classId);

    void updateClassTotalByClassId(Map<String, Long> params);
}
