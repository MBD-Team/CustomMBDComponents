import { WeekdayNumbers } from "luxon";

export type Event = {
  start: string;
  end: string;
  name: string;
  id: number;
  color?: string;
  group_id: number | null;
};

export type WeekEvent = {
  start_time: string;
  end_time: string;
  /** day of the week.
    * 1 is Monday and 7 is Sunday
    * @see https://en.wikipedia.org/wiki/ISO_week_date
    */
  week_day: WeekdayNumbers;
  name: string;
  id: number;
  color?: string;
  group_id: number | null;
  column_id: number;
};


export type Group = {
  name: string;
  id: number | null;
  checked: boolean;
  color?: string;
};

export type Column = {
  name: string;
  id: number | null;
  checked: boolean;
};
