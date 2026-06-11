export interface SubmittedEvent {
  id?: string;
  title: string;
  eventType: 'university' | 'department' | 'student-org' | 'dfw';
  // 'uta' = on campus / UTA-affiliated; 'dfw' = off campus within 50 miles.
  // Legacy docs have no audience field and are treated as 'uta'.
  audience?: 'uta' | 'dfw';
  isFree?: boolean;
  cost?: string;
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
  submitterName?: string;
  submitterEmail?: string;
}

export interface Notification {
  id?: string;
  title: string;
  message: string;
  organizationName: string;
  eventDate: string;
  createdAt: string;
}
