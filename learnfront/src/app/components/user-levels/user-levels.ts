import { Component, OnInit} from '@angular/core';
import { LevelService } from '../../services/level.service';
import { Level } from '../../models/level.model';
import { Subject } from '../../models/subject.model';
import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';
@Component({
  selector: 'app-user-levels',
  standalone: false,
  templateUrl: './user-levels.html',
  styleUrl: './user-levels.css'
  
})
export class UserLevels implements OnInit  {
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
        this.levels = levels;
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
