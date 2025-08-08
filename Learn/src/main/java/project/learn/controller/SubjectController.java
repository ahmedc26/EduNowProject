package project.learn.controller;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.learn.Entity.Subject;
import project.learn.Repository.SubjectRepo;
import project.learn.Service.SubjectService;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @PostMapping("/addSubject")
    public Subject saveSubject(@RequestBody Subject subject){ return  subjectService.saveSubject(subject); }

    @GetMapping("/getallSubjects")
    public List<Subject> getAllSubjects(){
        return subjectService.getAllSubjects();
    }
    @DeleteMapping("/Delete-Subject/{idSubject}")
    public void deleteSubject(@PathVariable Long idSubject){
        subjectService.deleteSubject(idSubject);
    }

}
