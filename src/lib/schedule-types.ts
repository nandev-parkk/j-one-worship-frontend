// Calendar Schedule Item (from list API)
export interface CalendarSchedule {
  id: number;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  allDay: boolean;
  description: string | null;
}

// Full Schedule Item (from detail API)
export interface ScheduleItem {
  id: number;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

// API Input Types
export interface CreateScheduleInput {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  isAllDay: boolean;
}

export interface UpdateScheduleInput {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isAllDay?: boolean;
}

// Query Parameters
export interface ListSchedulesParams {
  month?: string; // YYYY-MM format
}
