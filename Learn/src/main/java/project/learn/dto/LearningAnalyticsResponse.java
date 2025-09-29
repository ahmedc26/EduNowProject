package project.learn.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class LearningAnalyticsResponse {
    private String userId;
    private Integer totalSessions;
    private Integer totalQuestions;
    private Double averageTimePerQuestion; // minutes
    private Map<String, String> mostUsedCriteria;
    private List<String> improvementAreas;
    private List<String> strengths;
    private LearningPattern learningPattern;
    
    @Data
    public static class LearningPattern {
        private String preferredTimeOfDay;
        private Integer sessionFrequency; // sessions per week
        private Integer averageSessionLength; // minutes
        private List<Integer> difficultyProgression; // difficulty over time
        private List<String> subjectRotation; // subjects studied over time
    }
}
