package project.learn.dto;

import lombok.Data;
import java.util.Map;

@Data
public class PersonalizedRecommendationResponse {
    private Map<String, String> criteria; // Question criteria
    private Double confidence; // 0-1
    private String reason;
    private Boolean basedOnHistory;
}
