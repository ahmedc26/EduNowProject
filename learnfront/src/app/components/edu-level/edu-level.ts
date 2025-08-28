import { Component, Type, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LevelService } from '../../services/level.service';
import { Level, LevelType } from '../../models/level.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from '../../models/subject.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms'; 
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

 paginatedLevels: any[] = [];
  paginatedSubjects: any[] = [];


  levelsPageSize = 4;
  subjectsPageSize = 4;
  pageSizeOptions = [4, 8, 25, 100];
  levelsLength = 0;
  subjectsLength = 0;
  levelsPageIndex = 0;
  subjectsPageIndex = 0;
  /*@ViewChild(MatPaginator) paginator!: MatPaginator;*/
  @ViewChild('levelsPaginator') levelsPaginator!: MatPaginator;
  @ViewChild('subjectsPaginator') subjectsPaginator!: MatPaginator;
  showSuccess = false;
  showError = false;
  message = '';
  filteredLevels: any[] = []; 
  filteredSubjects: any[] = []; 
  levelsSearchControl = new FormControl('');
  subjectsSearchControl = new FormControl('');

constructor( private router:Router, private levelService :LevelService, private snackBar:MatSnackBar){}

 ngOnInit(){
  this.loadAllLevels();
  this.loadAllSubjects();
 this.levelsSearchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.applyFilter(searchTerm || '', 'Levels');
      });
    

    this.subjectsSearchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.applyFilter(searchTerm || '', 'Subjects');
      });
  }

  applyFilter(filterValue: string, type: 'Levels' | 'Subjects') {
    const searchTerm = filterValue.trim().toLowerCase();
    
    if (type === 'Levels') {
      if (!searchTerm) {
        this.filteredLevels = [...this.levels];
      } else {
        this.filteredLevels = this.levels.filter(level => 
          level.name_Level.toLowerCase().includes(searchTerm));
      }
      this.levelsLength = this.filteredLevels.length;
      this.updatePaginatedData('Levels');
      

      if (this.levelsPaginator) {
        this.levelsPaginator.firstPage();
      }
    } else {
      if (!searchTerm) {
        this.filteredSubjects = [...this.Subjects];
      } else {
        this.filteredSubjects = this.Subjects.filter(subject => 
          subject.name_Subject.toLowerCase().includes(searchTerm));
      }
      this.subjectsLength = this.filteredSubjects.length;
      this.updatePaginatedData('Subjects');
      
      // Reset to first page
      if (this.subjectsPaginator) {
        this.subjectsPaginator.firstPage();
      }
    }
  }

loadAllLevels() {
    this.levelService.getLevels().subscribe(
      (data) => { 
         this.levels = data;
         this.filteredLevels = [...this.levels];
        this.levelsLength = this.levels.length;
        this.updatePaginatedData('Levels');
      },
      (error) => {
        console.error('Error fetching levels', error);
        this.snackBar.open('Error loading levels', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }
  



loadAllSubjects() {
    this.levelService.getSubjects().subscribe(
      (data) => { 
        this.Subjects = data;
        this.filteredSubjects = [...this.Subjects];
        this.subjectsLength = this.Subjects.length;
        this.updatePaginatedData('Subjects');
      },
      (error) => {
        console.error('Error fetching subjects', error);
        this.snackBar.open('Error loading subjects', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }



 onLevelsPageChange(event: PageEvent) {
    this.levelsPageSize = event.pageSize;
    this.levelsPageIndex = event.pageIndex;
    this.updatePaginatedData('Levels');
  }

  onSubjectsPageChange(event: PageEvent) {
    this.subjectsPageSize = event.pageSize;
    this.subjectsPageIndex = event.pageIndex;
    this.updatePaginatedData('Subjects');
  }

  private updatePaginatedData(type: 'Levels' |  'Subjects') {
     if (type === 'Levels') {
      const startIndex = this.levelsPageIndex * this.levelsPageSize;
      const endIndex = startIndex + this.levelsPageSize;
      this.paginatedLevels = this.filteredLevels.slice(startIndex, endIndex);
    } else {
      const startIndex = this.subjectsPageIndex * this.subjectsPageSize;
      const endIndex = startIndex + this.subjectsPageSize;
      this.paginatedSubjects = this.filteredSubjects.slice(startIndex, endIndex);
    }
  }


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
