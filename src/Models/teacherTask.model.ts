export interface TeacherTask {
  id?: number;
  instructor_id: number;
  task_number: number;
  major_name: string;
  task_title: string;
student_id: number | undefined;
student_name: string | undefined;
  feedback: string;
  score: number | null;
}
