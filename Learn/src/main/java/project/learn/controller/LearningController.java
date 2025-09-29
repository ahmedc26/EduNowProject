package project.learn.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.learn.Service.UserLearningService;
import project.learn.dto.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/learning")
@RequiredArgsConstructor
public class LearningController {

    private final UserLearningService userLearningService;

    @PostMapping("/interactions")
    public void trackInteraction(@RequestBody UserInteractionRequest interaction) {
        userLearningService.trackUserInteraction(interaction);
    }

    @GetMapping("/preferences/{userId}")
    public UserPreferencesResponse getUserPreferences(@PathVariable String userId) {
        return userLearningService.getUserPreferences(userId);
    }

    @PutMapping("/preferences/{userId}")
    public UserPreferencesResponse updateUserPreferences(
            @PathVariable String userId, 
            @RequestBody UserPreferencesResponse preferences) {
        return userLearningService.updateUserPreferences(userId, preferences);
    }

    @GetMapping("/analytics/{userId}")
    public LearningAnalyticsResponse getLearningAnalytics(@PathVariable String userId) {
        return userLearningService.getLearningAnalytics(userId);
    }

    @GetMapping("/recommendations/{userId}")
    public List<PersonalizedRecommendationResponse> getPersonalizedRecommendations(@PathVariable String userId) {
        return userLearningService.getPersonalizedRecommendations(userId);
    }

    @GetMapping("/predict-criteria/{userId}")
    public PersonalizedRecommendationResponse predictOptimalCriteria(@PathVariable String userId) {
        return userLearningService.predictOptimalCriteria(userId);
    }

    @GetMapping("/insights/{userId}")
    public Object getLearningInsights(@PathVariable String userId) {
        return userLearningService.getLearningInsights(userId);
    }

    @GetMapping("/difficulty-progression/{userId}")
    public List<Integer> getDifficultyProgression(@PathVariable String userId) {
        return userLearningService.getDifficultyProgression(userId);
    }
}
