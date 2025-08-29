package project.learn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.learn.Entity.Subject;
import project.learn.Entity.Level;
import project.learn.Entity.Topic;

import java.util.List;

public interface TopicRepo extends JpaRepository<Topic,Long> {
    Long countBySubjectIdSubject(Long idSubject);
    List<Topic> findBySubjectLevelIdLevel(Long idLevel);
}
