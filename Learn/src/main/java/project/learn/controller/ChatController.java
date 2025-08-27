    package project.learn.controller;

    import org.springframework.ai.chat.messages.UserMessage;
    import org.springframework.ai.chat.model.ChatResponse;
    import org.springframework.ai.chat.prompt.Prompt;
    import org.springframework.ai.ollama.OllamaChatModel;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RequestParam;
    import org.springframework.web.bind.annotation.RestController;
    import reactor.core.publisher.Flux;

    import java.util.Map;

    @RestController
    @RequestMapping("/users")
    public class ChatController {

        private final OllamaChatModel chatModel;

        @Autowired
        public ChatController(OllamaChatModel chatModel) {
            this.chatModel = chatModel;
        }

        @GetMapping("/ai/generate")
        public Map<String,String> generate(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {
            return Map.of("generation", this.chatModel.call(message));
        }

        @GetMapping("/ai/generateSimple")
        public Map<String, String> generateSimple(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {
            String response = chatModel.call(message);
            String cleanResponse = response.replaceAll("(?s)<think>.*?</think>", "").trim();

            return Map.of("generation", cleanResponse);
        }
        @GetMapping("/ai/generateStream")
        public Flux<ChatResponse> generateStream(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {
            Prompt prompt = new Prompt(new UserMessage(message));
            return this.chatModel.stream(prompt);
        }

    }