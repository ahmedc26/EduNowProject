package project.learn.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
public class UserInteractionRequest {
    private String userId;
    private String sessionId;
    private LocalDateTime timestamp;
    private String interactionType; // QUESTION_GENERATED, ANSWER_REVEALED, etc.
    private String userAction; // GENERATE, SHOW_ANSWER, etc.
    private Map<String, String> criteria; // Question criteria
    private PerformanceMetrics performance;
    
    @Data
    public static class PerformanceMetrics {
        private Double timeToRevealAnswer; // seconds
        private Integer difficultyRating; // 1-5 scale
        private Integer userSatisfaction; // 1-5 scale
        private Boolean wasHelpful;
    }
}
