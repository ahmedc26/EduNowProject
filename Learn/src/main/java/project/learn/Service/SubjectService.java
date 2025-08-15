package project.learn.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.learn.Entity.Level;
import project.learn.Entity.Subject;
import project.learn.Repository.LevelRepo;
import project.learn.Repository.SubjectRepo;

import java.util.List;

@Service
public class SubjectService {
    @Autowired
    private SubjectRepo subjectRepo;
    @Autowired
    private LevelRepo levelRepo;

    public Subject saveSubject(Subject subject) {
        return subjectRepo.save(subject);
    }

    public void deleteSubject(Long idSubject) {
        subjectRepo.deleteById(idSubject);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepo.findAll();
    }

    public Subject assignSubjectToLevel(Long idLevel, Long idSubject) {
        Subject subject = subjectRepo.findById(idSubject)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Level level = levelRepo.findById(idLevel)
                .orElseThrow(() -> new RuntimeException("Level not found"));
        subject.setLevel(level);
        return subjectRepo.save(subject);
    }

    public Subject AddSubject(Subject subject,long idLevel) {

        Level level = levelRepo.findById(idLevel)
                .orElseThrow(() -> new RuntimeException("Level not found with id: " + idLevel));
    subject.setLevel(level);
        Subject savedSubject = subjectRepo.save(subject);
    return subjectRepo.save(savedSubject);
    }

}
