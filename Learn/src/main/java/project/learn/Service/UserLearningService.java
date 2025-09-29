package project.learn.Service;

import project.learn.dto.UserInteractionRequest;
import project.learn.dto.UserPreferencesResponse;
import project.learn.dto.LearningAnalyticsResponse;
import project.learn.dto.PersonalizedRecommendationResponse;

import java.util.List;

public interface UserLearningService {
    
    /**
     * Track user interaction for machine learning
     */
    void trackUserInteraction(UserInteractionRequest interaction);
    
    /**
     * Get user preferences based on learning history
     */
    UserPreferencesResponse getUserPreferences(String userId);
    
    /**
     * Update user preferences
     */
    UserPreferencesResponse updateUserPreferences(String userId, UserPreferencesResponse preferences);
    
    /**
     * Get learning analytics for a user
     */
    LearningAnalyticsResponse getLearningAnalytics(String userId);
    
    /**
     * Get personalized recommendations based on user history
     */
    List<PersonalizedRecommendationResponse> getPersonalizedRecommendations(String userId);
    
    /**
     * Predict optimal question criteria for a user
     */
    PersonalizedRecommendationResponse predictOptimalCriteria(String userId);
    
    /**
     * Get learning insights and patterns
     */
    Object getLearningInsights(String userId);
    
    /**
     * Get difficulty progression for adaptive learning
     */
    List<Integer> getDifficultyProgression(String userId);
}
