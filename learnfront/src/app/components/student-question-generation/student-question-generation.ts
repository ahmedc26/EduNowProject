import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionGeneratorService, GenerateQuestionRequest, QuestionResponse } from '../../services/question-generator.service';
import { ProgressService } from '../../services/progress.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-question-generation',
  standalone: false,
  templateUrl: './student-question-generation.html',
  styleUrl: './student-question-generation.css'
})
export class StudentQuestionGenerator {
  questionForm: FormGroup;
  generatedQuestion: QuestionResponse | null = null;
  isLoading = false;
  showAnswer = false;
  userAnswer = '';
  isAnswerCorrect: boolean | null = null;
  showResult = false;
  correctAnswersCount = 0;
  totalQuestionsCount = 0;

  // Predefined options for dropdowns
  levels = ['6eme', '5eme', '4eme', '3eme', '2eme', '1ere', 'Terminale'];
  levelTypes = ['primary', 'secondary'];
  subjects = ['French', 'English'];
  topics = ['Grammaire', 'Litterature', 'Grammar', 'Literature', 'Vocabulaire','Vocabulary','Writing'];
  skills = ['Conjugaison', 'Comprehension', 'Tenses', 'Reading', 'Mots usuels','Essay skills','Analyse de texte','Animals'];
  subSkills = ['Verbes du 1eme groupe','Verbes du 2eme groupe','Comprehension', 'Idees principales', 'Future tense', 'Simple past', 'Equations', 'Functions', 'Animaux','Argumentation','Identify animals'];
  subSubSkills = ['Futur simple', 'Past tense', 'Present perfect', 'Regular verbs', 'Quadratic functions','Noms','Idees principales','Wild animals'];

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionGeneratorService,
    private progressService: ProgressService,
    private snackBar: MatSnackBar
  ) {
    this.questionForm = this.fb.group({
      level: [''],
      levelType: [''],
      subject: [''],
      topic: [''],
      skill: [''],
      subSkill: [''],
      subSubSkill: ['']
    });
    
    this.loadProgressFromService();
  }

  generateQuestion() {
    if (this.questionForm.valid) {
      this.isLoading = true;
      this.showAnswer = false;
      this.userAnswer = '';
      this.isAnswerCorrect = null;
      this.showResult = false;
      
      const request: GenerateQuestionRequest = this.questionForm.value;
      
      // Remove empty values
      Object.keys(request).forEach(key => {
        if (!request[key as keyof GenerateQuestionRequest]) {
          delete request[key as keyof GenerateQuestionRequest];
        }
      });

      this.questionService.generateQuestion(request).subscribe({
        next: (response) => {
          this.generatedQuestion = response;
          this.isLoading = false;
          if (response.question === "No question found for provided filters.") {
            this.snackBar.open('No questions found matching your criteria. Try adjusting your filters.', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          console.error('Error generating question:', error);
          this.isLoading = false;
          this.snackBar.open('Error generating question. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  toggleAnswer() {
    this.showAnswer = !this.showAnswer;
  }

  generateNewQuestion() {
    this.generateQuestion();
  }

  clearForm() {
    this.questionForm.reset();
    this.generatedQuestion = null;
    this.showAnswer = false;
    this.userAnswer = '';
    this.isAnswerCorrect = null;
    this.showResult = false;
  }


  submitAnswer() {
    if (!this.userAnswer.trim()) {
      this.snackBar.open('Please enter your answer before submitting.', 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    if (!this.generatedQuestion) return;


    const correctAnswer = this.generatedQuestion.answer.toLowerCase().trim();
    const userAnswer = this.userAnswer.toLowerCase().trim();
    this.isAnswerCorrect = correctAnswer === userAnswer || 
                          correctAnswer.includes(userAnswer) || 
                          userAnswer.includes(correctAnswer);
    
    this.showResult = true;
    this.totalQuestionsCount++;
    
    if (this.isAnswerCorrect) {
      this.correctAnswersCount++;
      this.progressService.incrementCorrectAnswers();
      this.snackBar.open('🎉 Correct! Well done!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    } else {
      this.progressService.incrementTotalQuestions();
      this.snackBar.open('❌ Not quite right. Check the correct answer below.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
    }
  }

  private loadProgressFromService() {
    this.progressService.progress$.subscribe(progress => {
      this.correctAnswersCount = progress.correctAnswersCount;
      this.totalQuestionsCount = progress.totalQuestionsCount;
    });
  }

  getAccuracyPercentage(): number {
    if (this.totalQuestionsCount === 0) return 0;
    return Math.round((this.correctAnswersCount / this.totalQuestionsCount) * 100);
  }

  resetProgress() {
    this.progressService.resetProgress();
    this.snackBar.open('Progress reset successfully!', 'Close', {
      duration: 2000
    });
  }
}

