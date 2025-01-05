export interface ActivityResponse {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export type Activity = ActivityResponse & { date: Date };

export interface ActivitiesMap {
  [key: number]: { [key: number]: Activity[] };
}
