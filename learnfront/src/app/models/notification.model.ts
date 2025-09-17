export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  user?: any;
  topic?: any;
  createdDate: string;
  lastModifiedDate?: string;
  topicId?: number;
  topicName?: string;
  subjectName?: string;
}

