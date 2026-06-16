import type { FC } from 'react';
import './AdminTask.scss';
import type { TeacherTask } from '../../../Models/teacherTask.model';

interface AdminTaskProps {
  task: TeacherTask;
  instructorName: string;
  onDelete: (id: number) => void;
}

const AdminTask: FC<AdminTaskProps> = ({ task, instructorName, onDelete }) => (
  <div className="admin-task-card">
    <div className="admin-task-status">ניהול</div>

    <h3>{(task as any).title || task.task_title}</h3>

    <p>מרצה: {instructorName}</p>

    <button
      className="delete-task-btn"
      onClick={() => onDelete(task.id!)}
    >
      מחק משימה
    </button>
  </div>
);

export default AdminTask;