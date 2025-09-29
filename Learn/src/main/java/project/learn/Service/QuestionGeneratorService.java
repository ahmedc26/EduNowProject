package project.learn.Service;

import project.learn.dto.GenerateQuestionRequest;
import project.learn.dto.QuestionResponse;

public interface QuestionGeneratorService {
    QuestionResponse generateQuestion(GenerateQuestionRequest request);
}
