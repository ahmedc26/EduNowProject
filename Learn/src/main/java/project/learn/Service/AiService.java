package project.learn.Service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private final ChatClient chatClient;

    public AiService(ChatClient.Builder builder) {
        chatClient = builder.build();
    }

    public String chat(String prompt) {
        return chatClient
                .prompt(prompt)
                .call()
                .content();
    }
    public String generateQuestion(String grade, String subject, String topic, String skill) {
        String prompt = String.format(
                "You are a teacher. Generate one clear and simple exercise question.\n" +
                        "Grade: %s\n" +
                        "Subject: %s\n" +
                        "Topic: %s\n" +
                        "Skill: %s\n\n" +
                        "Output only the question without explanation.",
                grade, subject, topic, skill
        );

        return chat(prompt);
    }
}