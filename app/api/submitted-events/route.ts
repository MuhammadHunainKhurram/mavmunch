import { getAdminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const snapshot = await getAdminDb()
      .collection('submitted_events')
      .where('approved', '==', true)
      .get();

    const events = snapshot.docs.map((doc) => {
      // Strip moderator-only fields before anything leaves the server
      const { submitterName, submitterEmail, submittedAt, ...publicFields } =
        doc.data();
      return { id: doc.id, ...publicFields };
    });

    return Response.json(events);
  } catch (error) {
    console.error('Error fetching submitted events:', error);
    return Response.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
