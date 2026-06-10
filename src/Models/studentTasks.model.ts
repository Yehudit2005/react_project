export interface StudentTask {
  id: number;
  student_id: number;
  task_number: number;
  major_id: number;
  major_name: string;
  completed: boolean;
  score: number | null;
  instructor_id: number;
  title: string;
  description: string;
}
