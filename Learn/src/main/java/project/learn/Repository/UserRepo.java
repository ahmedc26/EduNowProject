package project.learn.Repository;

import jdk.dynalink.linker.LinkerServices;
import org.springframework.data.jpa.repository.JpaRepository;
import project.learn.user.User;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User,Long> {

Optional<User> findUserByEmail(String email);
List<User> findByRoles_name(String rolesname);
Optional<User>findUserByIdUser(Long id);

}
