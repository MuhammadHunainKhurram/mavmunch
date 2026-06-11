export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const endsAfter = searchParams.get('endsAfter');
    const endsBefore = searchParams.get('endsBefore');
    const take = searchParams.get('take') || '200';

    const params = new URLSearchParams({
      endsAfter: endsAfter || new Date().toISOString(),
      orderByField: 'startsOn',
      orderByDirection: 'ascending',
      status: 'Approved',
      take: take,
      'benefitNames[0]': 'FreeFood',
    });
    if (endsBefore) {
      params.set('endsBefore', endsBefore);
    }

    const response = await fetch(
      `https://mavengage.uta.edu/api/discovery/event/search?${params.toString()}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    return Response.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}