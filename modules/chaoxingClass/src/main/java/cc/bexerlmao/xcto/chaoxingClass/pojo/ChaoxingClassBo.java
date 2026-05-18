package cc.bexerlmao.xcto.chaoxingClass.pojo;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("chaoxingclass")
public class ChaoxingClassBo {

    @TableId
    Long id;
    Long classId;
    Long questionTotal;

}
