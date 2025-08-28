import { Component , OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopicService } from '../../services/topic.service';
import { Topic } from '../../models/topic.model';
import { LevelService } from '../../services/level.service';
import { Level } from '../../models/level.model';
import { Subject } from '../../models/subject.model';

@Component({
  selector: 'app-admin-topics',
  standalone: false,
  templateUrl: './admin-topics.html',
  styleUrl: './admin-topics.css'
})
export class AdminTopics implements OnInit {
  topicForm: FormGroup;
  selectedFile: File | null = null;
  subjects: Subject[] = [];
  levels: Level[] = [];
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
 constructor(
    private fb: FormBuilder,
    private topicService: TopicService,
    private LevelService: LevelService // Inject subject service
  ) {
    this.topicForm = this.fb.group({
      name_Topic: ['', [Validators.required, Validators.minLength(3)]],
      subjectId: ['', Validators.required]
    });
  }

 ngOnInit(){
  this.loadSubjects();
  this.loadLevels();
  console.log('Subjects:', this.subjects);


 }
getSubjectsByLevel(levelId: number | undefined) {
  return this.subjects.filter(subject => subject.level?.idLevel === levelId);
}


loadSubjects(): void {
    this.LevelService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        console.log('First subject:', subjects[0]);
        console.log('First subject:', subjects[0].level.idLevel);
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
        this.showMessage('Error loading subjects', 'error');
      }
    });
  }


  loadLevels(): void {
    this.LevelService.getLevels().subscribe({
      next: (levels) => {
        this.levels = levels;
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
        this.showMessage('Error loading subjects', 'error');
      }
    });
  }
 onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

 onSubmit(): void {
    if (this.topicForm.valid) {
      this.isLoading = true;
      
      const formData = this.topicForm.value;
      const topic: Topic = {
        name_Topic: formData.name_Topic,
        subject: {
          id_subject: formData.subjectId 
          
        }
      };

      this.topicService.addTopicWithFile(topic, this.selectedFile!).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showMessage('Topic uploaded successfully!', 'success');
          this.resetForm();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error uploading topic:', error);
          this.showMessage('Error uploading topic: ' + error.message, 'error');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }
private markFormGroupTouched(): void {
    Object.keys(this.topicForm.controls).forEach(key => {
      this.topicForm.get(key)?.markAsTouched();
    });
  }

   private resetForm(): void {
    this.topicForm.reset();
    this.selectedFile = null;
    // Reset file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

/*loadAllTopics() {
    this.topicService.getAllTopics().subscribe(
      (data) => { 
         this.topics = data;
      },
      (error) => {
        console.error('Error fetching levels', error);
       
        });
      }*/
private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
  }

