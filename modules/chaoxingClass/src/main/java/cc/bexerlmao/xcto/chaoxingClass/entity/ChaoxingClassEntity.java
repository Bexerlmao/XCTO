package cc.bexerlmao.xcto.chaoxingClass.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("`chaoxingClass`")
public class ChaoxingClassEntity {

    int id;
    long classId;
    long questionTotal;

}
