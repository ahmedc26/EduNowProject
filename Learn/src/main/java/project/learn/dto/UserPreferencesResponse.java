package project.learn.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserPreferencesResponse {
    private String userId;
    private List<String> preferredSubjects;
    private List<String> preferredTopics;
    private List<String> preferredSkills;
    private Integer difficultyLevel; // 1-5
    private Integer averageSessionTime; // minutes
    private Integer totalQuestionsGenerated;
    private LocalDateTime lastUpdated;
}
