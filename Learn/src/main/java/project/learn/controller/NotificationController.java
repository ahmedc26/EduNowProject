package project.learn.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import project.learn.Entity.Notification;
import project.learn.Entity.Topic;
import project.learn.Entity.Subject;
import project.learn.Service.NotificationService;
import project.learn.user.User;

import java.util.List;
import java.util.stream.Collectors;

class NotificationDto {
    public Long id;
    public String title;
    public String message;
    public boolean isRead;
    public String type;
    public String createdDate;
    public Long topicId;
    public String topicName;
    public String subjectName;

    public static NotificationDto from(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.id = notification.getId();
        dto.title = notification.getTitle();
        dto.message = notification.getMessage();
        dto.isRead = notification.isRead();
        dto.type = notification.getType();
        dto.createdDate = notification.getCreatedDate() != null ? notification.getCreatedDate().toString() : null;
        if (notification.getTopic() != null) {
            dto.topicId = notification.getTopic().getIdTopic();
            dto.topicName = notification.getTopic().getName_Topic();
            if (notification.getTopic().getSubject() != null) {
                dto.subjectName = notification.getTopic().getSubject().getName_Subject();
            }
        }
        return dto;
    }
}

@RestController
@RequestMapping("/users/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user")
    public ResponseEntity<List<NotificationDto>> getUserNotifications() {
        User user = getCurrentUser();
        List<Notification> notifications = notificationService.getUserNotifications(user);
        List<NotificationDto> dtos = notifications.stream()
                .map(NotificationDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications() {
        User user = getCurrentUser();
        List<Notification> notifications = notificationService.getUnreadNotifications(user);
        List<NotificationDto> dtos = notifications.stream()
                .map(NotificationDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadNotificationCount() {
        User user = getCurrentUser();
        Long count = notificationService.getUnreadNotificationCount(user);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Notification notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead() {
        User user = getCurrentUser();
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllNotifications() {
        User user = getCurrentUser();
        notificationService.deleteAllUserNotifications(user);
        return ResponseEntity.ok().build();
    }

    // Test endpoint to manually trigger notifications (for debugging)
    @PostMapping("/test-notify")
    public ResponseEntity<String> testNotification() {
        try {
            // Create a dummy topic for testing
            Topic testTopic = new Topic();
            testTopic.setName_Topic("Test Topic");
            
            // Create a dummy subject
            Subject testSubject = new Subject();
            testSubject.setName_Subject("Test Subject");
            testTopic.setSubject(testSubject);
            
            notificationService.notifyStudentsAboutNewTopic(testTopic);
            return ResponseEntity.ok("Test notifications sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending test notifications: " + e.getMessage());
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        throw new RuntimeException("User not authenticated");
    }
}
