package project.learn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.learn.Entity.Notification;
import project.learn.user.User;

import java.util.List;

public interface NotificationRepo extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserOrderByCreatedDateDesc(User user);
    
    List<Notification> findByUserAndIsReadFalseOrderByCreatedDateDesc(User user);
    
    Long countByUserAndIsReadFalse(User user);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user ORDER BY n.createdDate DESC")
    List<Notification> findUserNotifications(@Param("user") User user);
    
    void deleteByUser(User user);
}

