import { Component } from '@angular/core';
import { TopicService } from '../../services/topic.service';
import { Topic } from '../../models/topic.model';
import { Level } from '../../models/level.model';
import { Subject } from '../../models/subject.model';
import { LevelService } from '../../services/level.service';
@Component({
  selector: 'app-topics-level',
  standalone: false,
  templateUrl: './topics-level.html',
  styleUrl: './topics-level.css'
})
export class TopicsLevel {

constructor(  private levelService: LevelService, private topicService: TopicService){}
levels : Level[]= [];
levelTopics: { [key: number]: Topic[] } = {}; 
  
 loadTopicsForLevel(levelId: number): void {
    this.topicService.getTopicsByLevel(levelId).subscribe({
      next: (topics: Topic[]) => {
        this.levelTopics[levelId] = topics;
      },
      error: (error) => {
        console.error(`Error loading topics for level ${levelId}:`, error);
      }
    });
  }

 loadTopicsForAllLevels(): void {
    this.levels.forEach(level => {
      if (level.idLevel) {
        this.loadTopicsForLevel(level.idLevel);
      }
    });
  }

  getTopicsForLevel(levelId: number): Topic[] {
    return this.levelTopics[levelId] || [];
  }

  getTopicCountForLevel(levelId: number): number {
    return this.getTopicsForLevel(levelId).length;
  }

}
