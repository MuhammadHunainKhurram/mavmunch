export interface MavEngageEvent {
  id: string;
  name: string;
  organizationName: string;
  organizationProfilePicture: string;
  imagePath: string;
  location: string;
  startsOn: string;
  endsOn: string;
  description: string;
  benefitNames: string[];
  latitude: string;
  longitude: string;
}

export interface FilterOptions {
  organizations: string[];
}

export type SortOption = 'date-asc' | 'date-desc' | 'org-asc' | 'name-asc';

export interface ApiResponse {
  value: MavEngageEvent[];
}
