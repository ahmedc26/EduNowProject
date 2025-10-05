package project.learn.Service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import project.learn.Service.UserLearningService;
import project.learn.dto.*;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class UserLearningServiceImpl implements UserLearningService {


    private final Map<String, List<UserInteractionRequest>> userInteractions = new HashMap<>();
    private final Map<String, UserPreferencesResponse> userPreferences = new HashMap<>();
    private final Map<String, LearningAnalyticsResponse> userAnalytics = new HashMap<>();

    @Override
    public void trackUserInteraction(UserInteractionRequest interaction) {
        log.info("Tracking interaction for user: {}", interaction.getUserId());
        

        userInteractions.computeIfAbsent(interaction.getUserId(), k -> new ArrayList<>())
                       .add(interaction);
        

        updateUserPreferencesFromInteraction(interaction);
        
        log.debug("Interaction tracked: {} for user {}", 
                 interaction.getInteractionType(), interaction.getUserId());
    }

    @Override
    public UserPreferencesResponse getUserPreferences(String userId) {
        return userPreferences.computeIfAbsent(userId, this::createDefaultPreferences);
    }

    @Override
    public UserPreferencesResponse updateUserPreferences(String userId, UserPreferencesResponse preferences) {
        preferences.setUserId(userId);
        preferences.setLastUpdated(LocalDateTime.now());
        userPreferences.put(userId, preferences);
        return preferences;
    }

    @Override
    public LearningAnalyticsResponse getLearningAnalytics(String userId) {
        return userAnalytics.computeIfAbsent(userId, this::createDefaultAnalytics);
    }

    @Override
    public List<PersonalizedRecommendationResponse> getPersonalizedRecommendations(String userId) {
        UserPreferencesResponse prefs = getUserPreferences(userId);
        List<UserInteractionRequest> interactions = userInteractions.getOrDefault(userId, new ArrayList<>());
        
        List<PersonalizedRecommendationResponse> recommendations = new ArrayList<>();
        

        if (!prefs.getPreferredSubjects().isEmpty()) {
            PersonalizedRecommendationResponse rec = new PersonalizedRecommendationResponse();
            Map<String, String> criteria = new HashMap<>();
            criteria.put("subject", prefs.getPreferredSubjects().get(0));
            rec.setCriteria(criteria);
            rec.setConfidence(0.8);
            rec.setReason("Based on your most studied subject");
            rec.setBasedOnHistory(true);
            recommendations.add(rec);
        }
        
        if (!prefs.getPreferredTopics().isEmpty()) {
            PersonalizedRecommendationResponse rec = new PersonalizedRecommendationResponse();
            Map<String, String> criteria = new HashMap<>();
            criteria.put("topic", prefs.getPreferredTopics().get(0));
            rec.setCriteria(criteria);
            rec.setConfidence(0.7);
            rec.setReason("Based on your preferred topic");
            rec.setBasedOnHistory(true);
            recommendations.add(rec);
        }
        

        PersonalizedRecommendationResponse difficultyRec = new PersonalizedRecommendationResponse();
        Map<String, String> difficultyCriteria = new HashMap<>();
        difficultyCriteria.put("level", getRecommendedLevel(prefs.getDifficultyLevel()));
        difficultyRec.setCriteria(difficultyCriteria);
        difficultyRec.setConfidence(0.6);
        difficultyRec.setReason("Optimized for your current difficulty level");
        difficultyRec.setBasedOnHistory(true);
        recommendations.add(difficultyRec);
        
        return recommendations;
    }

    @Override
    public PersonalizedRecommendationResponse predictOptimalCriteria(String userId) {
        UserPreferencesResponse prefs = getUserPreferences(userId);
        List<UserInteractionRequest> interactions = userInteractions.getOrDefault(userId, new ArrayList<>());
        
        PersonalizedRecommendationResponse recommendation = new PersonalizedRecommendationResponse();
        Map<String, String> criteria = new HashMap<>();


        if (!interactions.isEmpty()) {

            UserInteractionRequest lastInteraction = interactions.get(interactions.size() - 1);
            if (lastInteraction.getCriteria() != null) {
                criteria.putAll(lastInteraction.getCriteria());
            }
        }
        

        if (criteria.isEmpty()) {
            if (!prefs.getPreferredSubjects().isEmpty()) {
                criteria.put("subject", prefs.getPreferredSubjects().get(0));
            }
            if (!prefs.getPreferredTopics().isEmpty()) {
                criteria.put("topic", prefs.getPreferredTopics().get(0));
            }
            if (!prefs.getPreferredSkills().isEmpty()) {
                criteria.put("skill", prefs.getPreferredSkills().get(0));
            }
        }
        
        recommendation.setCriteria(criteria);
        recommendation.setConfidence(0.75);
        recommendation.setReason("Predicted based on your learning patterns");
        recommendation.setBasedOnHistory(!interactions.isEmpty());
        
        return recommendation;
    }

    @Override
    public Object getLearningInsights(String userId) {
        UserPreferencesResponse prefs = getUserPreferences(userId);
        List<UserInteractionRequest> interactions = userInteractions.getOrDefault(userId, new ArrayList<>());
        
        Map<String, Object> insights = new HashMap<>();
        insights.put("totalInteractions", interactions.size());
        insights.put("preferredSubjects", prefs.getPreferredSubjects());
        insights.put("difficultyLevel", prefs.getDifficultyLevel());
        insights.put("totalQuestions", prefs.getTotalQuestionsGenerated());
        insights.put("averageSessionTime", prefs.getAverageSessionTime());
        
        // Calculate some basic insights
        if (!interactions.isEmpty()) {
            long questionGeneratedCount = interactions.stream()
                .mapToLong(i -> "QUESTION_GENERATED".equals(i.getInteractionType()) ? 1 : 0)
                .sum();
            insights.put("questionsGenerated", questionGeneratedCount);
            

            double avgTimeToReveal = interactions.stream()
                .filter(i -> i.getPerformance() != null && i.getPerformance().getTimeToRevealAnswer() != null)
                .mapToDouble(i -> i.getPerformance().getTimeToRevealAnswer())
                .average()
                .orElse(0.0);
            insights.put("averageTimeToReveal", avgTimeToReveal);
        }
        
        return insights;
    }

    @Override
    public List<Integer> getDifficultyProgression(String userId) {
        List<UserInteractionRequest> interactions = userInteractions.getOrDefault(userId, new ArrayList<>());
        
        return interactions.stream()
            .filter(i -> i.getPerformance() != null && i.getPerformance().getDifficultyRating() != null)
            .map(i -> i.getPerformance().getDifficultyRating())
            .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }

    // Private helper methods
    private UserPreferencesResponse createDefaultPreferences(String userId) {
        UserPreferencesResponse prefs = new UserPreferencesResponse();
        prefs.setUserId(userId);
        prefs.setPreferredSubjects(new ArrayList<>());
        prefs.setPreferredTopics(new ArrayList<>());
        prefs.setPreferredSkills(new ArrayList<>());
        prefs.setDifficultyLevel(3); // Default medium difficulty
        prefs.setAverageSessionTime(15); // Default 15 minutes
        prefs.setTotalQuestionsGenerated(0);
        prefs.setLastUpdated(LocalDateTime.now());
        return prefs;
    }

    private LearningAnalyticsResponse createDefaultAnalytics(String userId) {
        LearningAnalyticsResponse analytics = new LearningAnalyticsResponse();
        analytics.setUserId(userId);
        analytics.setTotalSessions(0);
        analytics.setTotalQuestions(0);
        analytics.setAverageTimePerQuestion(0.0);
        analytics.setMostUsedCriteria(new HashMap<>());
        analytics.setImprovementAreas(new ArrayList<>());
        analytics.setStrengths(new ArrayList<>());
        
        LearningAnalyticsResponse.LearningPattern pattern = new LearningAnalyticsResponse.LearningPattern();
        pattern.setPreferredTimeOfDay("morning");
        pattern.setSessionFrequency(3);
        pattern.setAverageSessionLength(15);
        pattern.setDifficultyProgression(new ArrayList<>());
        pattern.setSubjectRotation(new ArrayList<>());
        analytics.setLearningPattern(pattern);
        
        return analytics;
    }

    private void updateUserPreferencesFromInteraction(UserInteractionRequest interaction) {
        String userId = interaction.getUserId();
        UserPreferencesResponse prefs = getUserPreferences(userId);
        
        // Update based on interaction type
        if ("QUESTION_GENERATED".equals(interaction.getInteractionType())) {
            prefs.setTotalQuestionsGenerated(prefs.getTotalQuestionsGenerated() + 1);
            
            // Update preferred subjects, topics, skills
            if (interaction.getCriteria() != null) {
                String subject = interaction.getCriteria().get("subject");
                if (subject != null && !prefs.getPreferredSubjects().contains(subject)) {
                    prefs.getPreferredSubjects().add(subject);
                }
                
                String topic = interaction.getCriteria().get("topic");
                if (topic != null && !prefs.getPreferredTopics().contains(topic)) {
                    prefs.getPreferredTopics().add(topic);
                }
                
                String skill = interaction.getCriteria().get("skill");
                if (skill != null && !prefs.getPreferredSkills().contains(skill)) {
                    prefs.getPreferredSkills().add(skill);
                }
            }
        }
        
        // Update difficulty level based on performance
        if (interaction.getPerformance() != null && interaction.getPerformance().getDifficultyRating() != null) {
            int newRating = interaction.getPerformance().getDifficultyRating();
            int currentRating = prefs.getDifficultyLevel();
            // Gradually adjust difficulty based on user feedback
            int adjustedRating = (currentRating + newRating) / 2;
            prefs.setDifficultyLevel(Math.max(1, Math.min(5, adjustedRating)));
        }
        
        prefs.setLastUpdated(LocalDateTime.now());
        userPreferences.put(userId, prefs);
    }

    private String getRecommendedLevel(Integer difficultyLevel) {
        if (difficultyLevel == null) return "3eme";
        
        switch (difficultyLevel) {
            case 1: return "6eme";
            case 2: return "5eme";
            case 3: return "4eme";
            case 4: return "3eme";
            case 5: return "2eme";
            default: return "3eme";
        }
    }
}
