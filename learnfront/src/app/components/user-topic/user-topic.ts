import { Component } from '@angular/core';
import { Topic } from '../../models/topic.model';
import { Subject } from '../../models/subject.model';
import { Level } from '../../models/level.model';
import { TopicService } from '../../services/topic.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-user-topic',
  standalone: false,
  templateUrl: './user-topic.html',
  styleUrl: './user-topic.css'
})
export class UserTopic {

 topics : Topic[]= [];
 loading = false;
 errorMessage = '';


  constructor( private topicService:TopicService, private sanitizer: DomSanitizer){

  }

  ngOnInit(){
    this.loadAllTopics();
  }

  loadAllTopics() {
    this.topicService.getAllTopics().subscribe(
      (data) => { 
         this.topics = data;
      },
      (error) => {
        console.error('Error fetching levels', error);
       
          panelClass: ['error-snackbar']
        });
      }
 downloadFile(topic: Topic) {
    if (!topic.filePath) {
      console.error('No file available for download');
      return;
    }
  
    this.topicService.downloadFile(topic.filePath).subscribe(
      (blob: Blob) => {

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = topic.fileName || `topic_${topic.idTopic}`;
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      },
      (error) => {
        console.error('Error downloading file:', error);
        this.errorMessage = 'Failed to download file. Please try again.';
      }
    );
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




