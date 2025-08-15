package project.learn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import project.learn.Entity.Level;

public interface LevelRepo extends JpaRepository<Level, Long> {
}
