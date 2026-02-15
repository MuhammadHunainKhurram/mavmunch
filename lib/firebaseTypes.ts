export interface SubmittedEvent {
  id?: string;
  title: string;
  eventType: 'university' | 'department' | 'student-org';
  organizationName?: string;
  departmentName?: string;
  location: string;
  roomNumber?: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  submittedAt?: any;
  approved?: boolean;
  flaggedCount?: number;
  foodType?: string;
}

export interface Notification {
  id?: string;
  title: string;
  message: string;
  organizationName: string;
  eventDate: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  organizationName: string;
  totalEvents: number;
  submittedEvents: number;
  apiEvents: number;
}