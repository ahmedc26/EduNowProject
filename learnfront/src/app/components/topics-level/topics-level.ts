import { Component } from '@angular/core';
import { TopicService } from '../../services/topic.service';
import { ActivatedRoute } from '@angular/router';
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

constructor( private route: ActivatedRoute, private levelService: LevelService, private topicService: TopicService){}
levelId!: number;
  level!: Level;
  topics: Topic[] = [];
  isLoading = false;
  errorMessage = '';
  
 ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.levelId = +params['idLevel'];
      this.loadLevelDetails();
      this.loadTopicsByLevel();
    });
  }

loadLevelDetails(): void {
    this.levelService.getLevels().subscribe({
      next: (levels: Level[]) => {
        this.level = levels.find(l => l.idLevel === this.levelId)!;
      },
      error: (error) => {
        console.error('Error loading level details:', error);
      }
    });
  }
  
   loadTopicsByLevel(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.topicService.getTopicsByLevel(this.levelId).subscribe({
      next: (topics: Topic[]) => {
        this.topics = topics;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading topics:', error);
        this.errorMessage = 'Failed to load topics. Please try again.';
        this.isLoading = false;
      }
    });
  }
 downloadFile(topic: Topic): void {
    if (!topic.filePath) return;

    this.topicService.downloadFile(topic.filePath).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = topic.fileName || `topic_${topic.idTopic}`;
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 100);
      },
      error: (error) => {
        console.error('Error downloading file:', error);
        this.errorMessage = 'Failed to download file. Please try again.';
      }
    });
  }

  getFileIcon(topic: Topic): string {
    if (!topic.fileType) return 'fa-file';
    
    const type = topic.fileType.toLowerCase();
    if (type.includes('pdf')) return 'fa-file-pdf';
    if (type.includes('word') || type.includes('document')) return 'fa-file-word';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'fa-file-excel';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'fa-file-powerpoint';
    if (type.includes('image')) return 'fa-file-image';
    if (type.includes('text')) return 'fa-file-text';
    if (type.includes('zip') || type.includes('compressed')) return 'fa-file-archive';
    
    return 'fa-file';
  }

  getFileTypeDisplay(topic: Topic): string {
    if (!topic.fileType) return 'Unknown';
    
    const type = topic.fileType.toLowerCase();
    if (type.includes('pdf')) return 'PDF Document';
    if (type.includes('word') || type.includes('document')) return 'Word Document';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'Excel Spreadsheet';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'PowerPoint Presentation';
    if (type.includes('image')) return 'Image File';
    if (type.includes('text')) return 'Text File';
    if (type.includes('zip') || type.includes('compressed')) return 'Compressed File';
    
    return topic.fileType;
  }
}