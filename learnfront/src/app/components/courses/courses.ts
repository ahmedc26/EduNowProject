import { Component } from '@angular/core';
import { LevelService } from '../../services/level.service';
import { Level } from '../../models/level.model';
import { Subject } from '../../models/subject.model';
@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses {
 levels: Level[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
   constructor(private levelService: LevelService) { }

  ngOnInit(): void {
    this.loadLevelsWithSubjects();
  }

  loadLevelsWithSubjects(): void {
  this.isLoading = true;
  this.levelService.getLevels().subscribe({
    next: (levels: Level[]) => {
      this.levels = levels.sort((a, b) => {
        if (a.level_Type === b.level_Type) {
          return a.name_Level.localeCompare(b.name_Level);
        }
        return a.level_Type === 'PRIMARY' ? -1 : 1;
      });
      this.isLoading = false;
    },
    error: (error) => {
      this.errorMessage = 'Failed to load levels. Please try again later.';
      this.isLoading = false;
      console.error('Error loading levels:', error);
    }
  });
}

  getSubjectsForLevel(levelId: number): Subject[] {
    const level = this.levels.find(l => l.idLevel === levelId);
    return level && level.subjects ? level.subjects : [];
  }
  safeGetSubjects(level: Level): Subject[] {
    return level.subjects || [];
  }
  safeGetTopicsCount(subject: Subject): number {
    return subject.topics ? subject.topics.length : 0;
  }
}
