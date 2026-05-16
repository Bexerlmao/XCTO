package cc.bexerlmao.xcto.chaoxingClass.controller;

import cc.bexerlmao.xcto.chaoxingClass.entity.ChaoxingClassEntity;
import cc.bexerlmao.xcto.chaoxingClass.service.ChaoxingClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/chaoxingClass")
public class ChaoxingClassController {

    @Autowired
    private ChaoxingClassService chaoxingClassService;

    @GetMapping("/list")
    public List<ChaoxingClassEntity> listClasses() {
        return chaoxingClassService.listAllClasses();
    }
}
