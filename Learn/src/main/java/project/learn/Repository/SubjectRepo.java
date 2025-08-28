package project.learn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.learn.Entity.Subject;

public interface SubjectRepo extends JpaRepository<Subject,Long> {


}
