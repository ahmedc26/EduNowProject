package project.learn.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.learn.Service.QuestionGeneratorService;
import project.learn.dto.GenerateQuestionRequest;
import project.learn.dto.QuestionResponse;

@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionsController {

    private final QuestionGeneratorService questionGeneratorService;

    @PostMapping("/generate")
    public QuestionResponse generate(@RequestBody GenerateQuestionRequest request) {
        return questionGeneratorService.generateQuestion(request);
    }
}


