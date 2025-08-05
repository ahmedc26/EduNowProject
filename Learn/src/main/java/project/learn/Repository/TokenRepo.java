package project.learn.Repository;

import org.aspectj.apache.bcel.util.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import project.learn.user.Token;

import java.util.Optional;

public interface TokenRepo extends JpaRepository<Token,Long> {

    Optional<Token> findByToken(String token);
}
