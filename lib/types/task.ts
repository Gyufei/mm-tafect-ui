export type TaskType =
  | "Queued"
  | "Pending"
  | "Finished"
  | "Failed"
  | "Canceled";

export interface ITask {
  date: string;
  title: string;
  type: TaskType;
  address: string;
  gas: string;
  recipient: string;
  value: string;
  nonce: number;
  direction: string;
}
