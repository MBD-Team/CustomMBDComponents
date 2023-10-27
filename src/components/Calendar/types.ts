import { WeekdayNumbers } from 'luxon';

export type Event = {
  start: string;
  end: string;
  name: string;
  id: number;
  color?: string;
  /**default is solid*/
  background?: 'stripes' | 'dots' | 'solid';
  group_id: number | null;
  isResizable?: boolean;
};

export type WeekEvent = {
  start_time: string;
  end_time: string;
  /** day of the week.
   * 1 is Monday and 7 is Sunday
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   */
  weekday: WeekdayNumbers;
  name: string;
  id: number;
  color?: string;
  background?: 'stripes' | 'dots' | 'solid';
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

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
