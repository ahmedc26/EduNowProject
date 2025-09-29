package project.learn.dto;

import lombok.Data;

@Data
public class GenerateQuestionRequest {
    private String level;
    private String levelType; // primary|secondary
    private String subject;
    private String topic;
    private String skill;       // maps to CSV 'competence'
    private String subSkill;    // maps to CSV 'sous_competence'
    private String subSubSkill; // maps to CSV 'sous_sous_competence'
    private Boolean importantOnly; // optional filter
}


