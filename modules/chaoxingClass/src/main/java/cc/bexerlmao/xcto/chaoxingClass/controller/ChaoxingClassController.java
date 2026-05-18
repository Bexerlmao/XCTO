package cc.bexerlmao.xcto.chaoxingClass.controller;

import cc.bexerlmao.xcto.chaoxingClass.pojo.ChaoxingClassBo;
import cc.bexerlmao.xcto.chaoxingClass.service.ChaoxingClassService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/chaoxingClass")
public class ChaoxingClassController {

    private final ChaoxingClassService chaoxingClassService;

    public ChaoxingClassController(ChaoxingClassService chaoxingClassService) {
        this.chaoxingClassService = chaoxingClassService;
    }

    @GetMapping("/list")
    public List<ChaoxingClassBo> listClasses() {
        return chaoxingClassService.listAllClasses();
    }
}
