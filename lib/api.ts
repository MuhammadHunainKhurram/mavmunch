import { MavEngageEvent, ApiResponse } from './types';

/**
 * @param daysAhead Number of days to look ahead (default: 30)
 */
export async function getFreeFoodEvents(
  daysAhead: number = 30
): Promise<MavEngageEvent[]> {
  try {
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + daysAhead);

    const params = new URLSearchParams({
      endsAfter: now.toISOString(),
      take: '200',
    });

    const response = await fetch(
      `/api/events?${params.toString()}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    return data.value.filter((event) => {
      const eventStart = new Date(event.startsOn);
      return eventStart <= endDate;
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export async function getPastFreeFoodEvents(
  monthsBack: number = 6
): Promise<MavEngageEvent[]> {
  try {
    const now = new Date();
    const start = new Date(
      now.getFullYear(),
      now.getMonth() - monthsBack,
      now.getDate()
    );

    const params = new URLSearchParams({
      endsAfter: start.toISOString(),
      endsBefore: now.toISOString(),
      take: '500',
    });

    const response = await fetch(`/api/events?${params.toString()}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data.value;
  } catch (error) {
    console.error('Error fetching past events:', error);
    return [];
  }
}