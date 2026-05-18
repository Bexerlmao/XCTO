package cc.bexerlmao.xcto.application;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({
        "cc.bexerlmao.xcto.question",
        "cc.bexerlmao.xcto.application",
        "cc.bexerlmao.xcto.chaoxingClass"
})
@MapperScan("cc.bexerlmao.xcto.**.mapper")
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
