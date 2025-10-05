package project.learn.Service;

import org.springframework.stereotype.Service;
import project.learn.dto.UserInteractionRequest;
import project.learn.dto.UserPreferencesResponse;
import project.learn.dto.LearningAnalyticsResponse;
import project.learn.dto.PersonalizedRecommendationResponse;

import java.util.List;

public interface UserLearningService {
    

    void trackUserInteraction(UserInteractionRequest interaction);
    

    UserPreferencesResponse getUserPreferences(String userId);

    UserPreferencesResponse updateUserPreferences(String userId, UserPreferencesResponse preferences);
    

    LearningAnalyticsResponse getLearningAnalytics(String userId);
    

    List<PersonalizedRecommendationResponse> getPersonalizedRecommendations(String userId);
    

    PersonalizedRecommendationResponse predictOptimalCriteria(String userId);
    

    Object getLearningInsights(String userId);
    

    List<Integer> getDifficultyProgression(String userId);
}
