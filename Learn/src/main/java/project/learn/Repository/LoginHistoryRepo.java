package project.learn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.learn.Entity.LoginHistory;
import project.learn.user.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface LoginHistoryRepo extends JpaRepository<LoginHistory, Long> {
    
    List<LoginHistory> findByUserOrderByLoginTimeDesc(User user);
    
    @Query("SELECT lh FROM LoginHistory lh WHERE lh.user = :user ORDER BY lh.loginTime DESC")
    List<LoginHistory> findLastLoginHistoryByUser(@Param("user") User user);
    
    @Query("SELECT lh FROM LoginHistory lh WHERE lh.user = :user AND lh.isActive = true ORDER BY lh.loginTime DESC")
    Optional<LoginHistory> findActiveLoginByUser(@Param("user") User user);
    
    @Query("SELECT lh FROM LoginHistory lh WHERE lh.user = :user AND lh.loginTime >= :startDate ORDER BY lh.loginTime DESC")
    List<LoginHistory> findLoginHistoryByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDateTime startDate);
    
    List<LoginHistory> findAllByOrderByLoginTimeDesc();
}
