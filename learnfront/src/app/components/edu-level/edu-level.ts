import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LevelService } from '../../services/level.service';
import { Level, LevelType } from '../../models/level.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from '../../models/subject.model';

@Component({
  selector: 'app-edu-level',
  standalone: false,
  templateUrl: './edu-level.html',
  styleUrl: './edu-level.css'
})
export class EduLevel {
selectedLevelId: Level | null = null;

levels: any[] = [];
Subjects: any [] = [];
newLevel: Level = {

    name_Level: '',
    level_Type: LevelType.PRIMARY 
  };
  newSubject: Subject = {
  name_Subject:'',
  level: undefined
};



  showSuccess = false;
  showError = false;
  message = '';
constructor( private router:Router, private levelService :LevelService, private snackBar:MatSnackBar){}

 ngOnInit(){
  this.loadAllLevels();
  this.loadAllSubjects();
 }


 loadAllLevels() {
    this.levelService.getLevels().subscribe(
      (data) => { this.levels = data;},
      (error) =>{ console.error('Error fetching levels',error);}
    )}

  loadAllSubjects() {
    this.levelService.getSubjects().subscribe(
      (data) => { this.Subjects = data;},
      (error) =>{ console.error('Error fetching subjects',error);}
    )}

addSubject(){
  if (!this.selectedLevelId) {
    this.snackBar.open('Please select a level first', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
    return;
  }
  const levelId = Number(this.selectedLevelId);
  this.levelService.addSubject(this.newSubject,levelId).subscribe({
    next: (response) =>{
      this.loadAllSubjects();
       this.snackBar.open(`Subject added successfully`, 'Close', {
        duration: 3000
      });
      this.newSubject = { name_Subject: '', level: undefined };
    },
  error: (err) => {
      console.error(`Error adding Subject:`, err);
      this.snackBar.open(`Error adding Subject`, 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  });
}

addEntity(entityType: 'level' | 'subject', entityData: Level | Subject, entityName: string) {
    if (entityType === 'subject') {
    this.newSubject.level = this.levels.find(level => level.idLevel === this.selectedLevelId);
  }
  this.levelService.addEntity(entityType, entityData).subscribe({
    next: (response) => {

      if (entityType === 'level') {
        this.loadAllLevels();
      } else {
        this.loadAllSubjects();
      }
      
      this.snackBar.open(`${entityName} added successfully`, 'Close', {
        duration: 3000
      });
    },
    error: (err) => {
      console.error(`Error adding ${entityName}:`, err);
      this.snackBar.open(`Error adding ${entityName}`, 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  });
}

  Delete(entityType: 'level' | 'Subject', id: number, entityName: string){
    if(confirm(`Are you sure you want to delete this ${entityName}?`)){
      this.levelService.deleteEntity(entityType,id).subscribe({
        next:() => {
          if (entityType === 'level') {
          this.loadAllLevels();
        } else {
          this.loadAllSubjects();
        }
          this.snackBar.open('Level deleted succesfully', 'close',{
            duration: 3000
          });
        },
        error:(err) =>{
          console.error('Error deleting level:',err);
          this.snackBar.open('Error deleting level', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
          });
        }
      })
    }
  }

     


}
