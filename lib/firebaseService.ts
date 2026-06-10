import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';
import { SubmittedEvent } from './firebaseTypes';

export async function submitEvent(event: SubmittedEvent): Promise<string> {
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
      submitterName: event.submitterName || null,
      submitterEmail: event.submitterEmail || null,
      submittedAt: Timestamp.now(),
      approved: false,
      flaggedCount: 0,
    }
  );

  return docRef.id;
}

// Public reads go through /api/submitted-events so moderator-only fields
// (submitter contact) never reach the browser. Shared in-flight promise:
// the home page calls both public getters concurrently, one request serves both.
let approvedFetch: Promise<SubmittedEvent[]> | null = null;

function fetchApprovedEvents(): Promise<SubmittedEvent[]> {
  if (!approvedFetch) {
    approvedFetch = fetch('/api/submitted-events')
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        return res.json() as Promise<SubmittedEvent[]>;
      })
      .finally(() => {
        approvedFetch = null;
      });
  }
  return approvedFetch;
}

export async function getApprovedSubmittedEvents(
  daysAhead: number = 60
): Promise<SubmittedEvent[]> {
  try {
    // Date filtering happens client-side on purpose: event date/time strings
    // are local campus time, and the server (UTC) would parse them shifted
    let allEvents = await fetchApprovedEvents();

    const now = new Date();
    const futureDate = new Date(
      now.getTime() + daysAhead * 24 * 60 * 60 * 1000
    );

    allEvents = allEvents
      .filter((event) => {
        // Parse as local time; new Date('YYYY-MM-DD') alone is UTC midnight,
        // which drops same-day events. Keep events visible until they end.
        const eventStart = new Date(`${event.date}T${event.startTime}`);
        const eventEnd = new Date(`${event.date}T${event.endTime || '23:59'}`);
        return eventEnd >= now && eventStart <= futureDate;
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

    let allEvents = await fetchApprovedEvents();

    allEvents = allEvents
      .filter((event) => {
        const eventEnd = new Date(`${event.date}T${event.endTime || '23:59'}`);
        return eventEnd >= pastDate && eventEnd < now;
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

// Admin functions — errors propagate so the admin UI can surface them

export async function getPendingSubmittedEvents(): Promise<SubmittedEvent[]> {
  const q = query(
    collection(db, COLLECTIONS.SUBMITTED_EVENTS),
    where('approved', '==', false)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() } as SubmittedEvent))
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.startTime}`).getTime() -
        new Date(`${b.date}T${b.startTime}`).getTime()
    );
}

export async function getAllApprovedSubmittedEvents(): Promise<SubmittedEvent[]> {
  const q = query(
    collection(db, COLLECTIONS.SUBMITTED_EVENTS),
    where('approved', '==', true)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() } as SubmittedEvent))
    .sort(
      (a, b) =>
        new Date(`${b.date}T${b.startTime}`).getTime() -
        new Date(`${a.date}T${a.startTime}`).getTime()
    );
}

export async function approveSubmittedEvent(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.SUBMITTED_EVENTS, id), { approved: true });
}

export async function deleteSubmittedEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.SUBMITTED_EVENTS, id));
}

export async function updateSubmittedEvent(
  id: string,
  data: Partial<SubmittedEvent>
): Promise<void> {
  const { id: _ignored, ...fields } = data;
  await updateDoc(doc(db, COLLECTIONS.SUBMITTED_EVENTS, id), fields);
}
