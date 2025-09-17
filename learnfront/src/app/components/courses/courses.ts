import { Component } from '@angular/core';
import { LevelService } from '../../services/level.service';
import { Level } from '../../models/level.model';
import { Subject } from '../../models/subject.model';
import { TopicService } from '../../services/topic.service';

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
  topicCounts: { [key: number]: number } = {}; 
  loadingCounts: { [key: number]: boolean } = {}; 


   constructor(private levelService: LevelService, private topicService: TopicService) { }

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
      this.loadAllTopicCounts();
      this.isLoading = false;
    },
    error: (error) => {
      this.errorMessage = 'Failed to load levels. Please try again later.';
      this.isLoading = false;
      console.error('Error loading levels:', error);
    }
  });
}

  loadAllTopicCounts(): void {
    this.levels.forEach(level => {
      if (level.subjects) {
        level.subjects.forEach(subject => {
          if (subject.id_subject) {
            this.loadTopicCount(subject.id_subject);
          }
        });
      }
    });
  }

    loadTopicCount(subjectId: number): void {
    this.loadingCounts[subjectId] = true;
    this.topicService.getTopicsCount(subjectId).subscribe({
      next: (count: number) => {
        this.topicCounts[subjectId] = count;
        this.loadingCounts[subjectId] = false;
      },
      error: (error) => {
        console.error(`Error loading topic count for subject ${subjectId}:`, error);
        this.topicCounts[subjectId] = 0;
        this.loadingCounts[subjectId] = false;
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

  getTopicCount(subjectId: number | undefined): number {
    if (!subjectId) return 0;
    return this.topicCounts[subjectId] || 0;
  }
   isLoadingCount(subjectId: number | undefined): boolean {
    if (!subjectId) return false;
    return this.loadingCounts[subjectId] || false;
  }
}
