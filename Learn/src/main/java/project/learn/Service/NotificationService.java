package project.learn.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.learn.Entity.Notification;
import project.learn.Entity.Topic;
import project.learn.Repository.NotificationRepo;
import project.learn.Repository.UserRepo;
import project.learn.role.Role;
import project.learn.user.User;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepo notificationRepo;
    private final UserRepo userRepo;

    @Transactional
    public Notification createNotification(User user, String title, String message, String type, Topic topic) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .topic(topic)
                .isRead(false)
                .build();
        
        return notificationRepo.save(notification);
    }

    @Transactional
    public void notifyStudentsAboutNewTopic(Topic topic) {
        System.out.println("=== NOTIFICATION DEBUG ===");
        System.out.println("Topic created: " + topic.getName_Topic());
        System.out.println("Subject: " + (topic.getSubject() != null ? topic.getSubject().getName_Subject() : "null"));
        
        // Get all users with STUDENT role using the repository method
        List<User> students = userRepo.findByRoles_name("STUDENT");
        System.out.println("Found " + students.size() + " students using repository method");
        
        // Debug: Print student details
        for (User student : students) {
            System.out.println("Student: " + student.getEmail() + " - Roles: " + 
                    student.getRoles().stream().map(Role::getName).toList());
        }

        System.out.println("Found " + students.size() + " students to notify");

        String title = "New Topic Added";
        String message = String.format("A new topic '%s' has been added to %s. Check it out!", 
                topic.getName_Topic(), 
                topic.getSubject() != null ? topic.getSubject().getName_Subject() : "the system");

        // Create notification for each student
        for (User student : students) {
            System.out.println("Creating notification for student: " + student.getEmail());
            Notification notification = createNotification(student, title, message, "TOPIC_ADDED", topic);
            System.out.println("Notification created with ID: " + notification.getId());
        }
        System.out.println("=== END NOTIFICATION DEBUG ===");
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepo.findByUserOrderByCreatedDateDesc(user);
    }

    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepo.findByUserAndIsReadFalseOrderByCreatedDateDesc(user);
    }

    public Long getUnreadNotificationCount(User user) {
        return notificationRepo.countByUserAndIsReadFalse(user);
    }

    @Transactional
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepo.save(notification);
    }

    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unreadNotifications = getUnreadNotifications(user);
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
        }
        notificationRepo.saveAll(unreadNotifications);
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        notificationRepo.deleteById(notificationId);
    }

    @Transactional
    public void deleteAllUserNotifications(User user) {
        notificationRepo.deleteByUser(user);
    }
}
