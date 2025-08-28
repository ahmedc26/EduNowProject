package project.learn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.learn.Entity.Topic;

public interface TopicRepo extends JpaRepository<Topic,Long> {

}
