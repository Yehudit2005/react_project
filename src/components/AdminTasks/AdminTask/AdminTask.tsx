import type { FC } from 'react';
import './AdminTask.scss';
import type { TeacherTask } from '../../../Models/teacherTask.model';

interface AdminTaskProps {
  task: TeacherTask;
  instructorName: string;
  onDelete: (id: number) => void;
}

const AdminTask: FC<AdminTaskProps> = ({ task, instructorName, onDelete }) => (
  <li className="AdminTask">
    <div>
      <span>{task.task_title as any}</span>
      <span> | מרצה: {instructorName}</span>
    </div>
    <button
      className="btn btn-danger btn-sm"
      onClick={() => onDelete(task.id!)}
    >
      מחק
    </button>
  </li>
);

export default AdminTask;