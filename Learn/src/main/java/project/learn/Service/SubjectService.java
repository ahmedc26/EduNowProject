package project.learn.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.learn.Entity.Subject;
import project.learn.Repository.SubjectRepo;

import java.util.List;

@Service
public class SubjectService {
    @Autowired
    private SubjectRepo subjectRepo;

    public Subject saveSubject(Subject subject){
        return subjectRepo.save(subject);
    }

    public void deleteSubject(Long idSubject){
        subjectRepo.deleteById(idSubject);
    }

    public List<Subject> getAllSubjects(){
        return subjectRepo.findAll();
    }

}
