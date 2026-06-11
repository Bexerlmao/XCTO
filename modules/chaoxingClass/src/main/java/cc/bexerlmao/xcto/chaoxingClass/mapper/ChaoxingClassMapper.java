package cc.bexerlmao.xcto.chaoxingClass.mapper;

import cc.bexerlmao.xcto.chaoxingClass.pojo.ChaoxingClassBo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ChaoxingClassMapper extends BaseMapper<ChaoxingClassBo> {

    Long getClassQuestionTotalById(Long classId);

    Long getClassQuestionTotalByClassId(Long classId);

    void insertClass(@Param("classId") Long classId, @Param("className") String className);

    void updateClassTotalByClassId(Map<String, Long> params);

    List<ChaoxingClassBo> getAllClasses();
}
