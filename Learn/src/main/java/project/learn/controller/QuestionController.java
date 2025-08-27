package project.learn.controller;

import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/users")
public class QuestionController {
    private final OllamaChatModel chatModel;
    @Autowired
    public QuestionController(OllamaChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @GetMapping("/generate")
    public Map<String, String> generateQuestion(
            @RequestParam String grade,
            @RequestParam String subject,
            @RequestParam String topic,
            @RequestParam String skill) {

        String prompt = String.format(
                "Generate ONE question for a %s grade student in %s. The topic is %s and the skill is %s. " +
                        "The question should be simple and adapted to the grade level.",
                grade, subject, topic, skill
        );

        String response = chatModel.call(prompt);

        String cleanResponse = response.replaceAll("(?s)<think>.*?</think>", "").trim();

        return Map.of(
                "grade", grade,
                "subject", subject,
                "topic", topic,
                "skill", skill,
                "generated_question", cleanResponse
        );
    }
}
