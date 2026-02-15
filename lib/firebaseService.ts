import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';
import { SubmittedEvent } from './firebaseTypes';

export async function submitEvent(event: SubmittedEvent): Promise<string> {
  try {
    console.log('🔄 Submitting to Firestore:', event);
    
    const docRef = await addDoc(
      collection(db, COLLECTIONS.SUBMITTED_EVENTS),
      {
        title: event.title,
        eventType: event.eventType,
        organizationName: event.organizationName || null,
        departmentName: event.departmentName || null,
        location: event.location,
        roomNumber: event.roomNumber || null,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        description: event.description,
        foodType: event.foodType || null,
        submittedAt: Timestamp.now(),
        approved: true,
        flaggedCount: 0,
      }
    );
    
    console.log('✅ Event saved successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error submitting event to Firebase:', error);
    throw error;
  }
}

export async function getApprovedSubmittedEvents(
  daysAhead: number = 60
): Promise<SubmittedEvent[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.SUBMITTED_EVENTS),
      where('approved', '==', true)
    );

    const snapshot = await getDocs(q);
    let allEvents = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as SubmittedEvent));

    const now = new Date();
    const futureDate = new Date(
      now.getTime() + daysAhead * 24 * 60 * 60 * 1000
    );

    allEvents = allEvents
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= futureDate;
      })
      .sort((a, b) => {
        const aTime = new Date(`${a.date}T${a.startTime}`).getTime();
        const bTime = new Date(`${b.date}T${b.startTime}`).getTime();
        return aTime - bTime;
      });

    return allEvents;
  } catch (error) {
    console.error('Error fetching submitted events:', error);
    return [];
  }
}

export async function getPastSubmittedEvents(
  monthsBack: number = 12
): Promise<SubmittedEvent[]> {
  try {
    const now = new Date();
    const pastDate = new Date(
      now.getFullYear(),
      now.getMonth() - monthsBack,
      now.getDate()
    );

    const q = query(
      collection(db, COLLECTIONS.SUBMITTED_EVENTS),
      where('approved', '==', true)
    );

    const snapshot = await getDocs(q);
    let allEvents = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as SubmittedEvent));

    allEvents = allEvents
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= pastDate && eventDate < now;
      })
      .sort((a, b) => {
        return (
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      });

    return allEvents;
  } catch (error) {
    console.error('Error fetching past events:', error);
    return [];
  }
}

export function getLeaderboardStats(
  events: SubmittedEvent[]
): Map<string, number> {
  const stats = new Map<string, number>();

  events.forEach((event) => {
    let org = '';
    if (event.organizationName) {
      org = event.organizationName;
    } else if (event.departmentName) {
      org = event.departmentName;
    } else {
      org = 'University Event';
    }

    stats.set(org, (stats.get(org) || 0) + 1);
  });

  return stats;
}