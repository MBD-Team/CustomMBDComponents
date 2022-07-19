export type Event = {
  start: string;
  end: string;
  name: string;
  id: number;
  color?: string;
  group_id: number | null;
};

export type Group = {
  name: string;
  id: number | null;
  checked: boolean;
  color?: string;
};
