package project.learn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.learn.role.Role;

import java.util.Optional;

public interface RoleRepo extends JpaRepository<Role,Long> {

    Optional<Role> findByName(String name);

}
