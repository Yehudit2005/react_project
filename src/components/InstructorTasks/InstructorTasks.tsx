import { useEffect, useState, type FC } from 'react';
import './InstructorTasks.scss';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import type { TeacherTask } from '../../Models/teacherTask.model';
import InstructorTask from '../InstructorTasks/InstructorTask/InstructorTask';
import { setMessage } from '../../store/messageSlice';

interface InstructorTasksProps { }
const allJson = 'http://localhost:3001';

const InstructorTasks: FC<InstructorTasksProps> = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState<TeacherTask[]>([]);
  const [searchTask, setSearchTask] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    if (!currentUser) return;

    const fetchTasks = async () => {
      let url = `${allJson}/pending_reviews?instructor_id=${Number(currentUser.id)}`;
      if (searchTask) url += `&task_title_like=${searchTask}`;
      if (searchStudent) url += `&student_name_like=${searchStudent}`;

      const res = await fetch(url);
      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, [currentUser, searchTask, searchStudent]);

  const filtered = tasks.filter(t =>
    filter === 'done' ? t.score !== null : t.score === null
  );

  useEffect(() => {
    if (filtered.length === 0 && tasks.length > 0) {
      dispatch(setMessage({ text: 'אין משימות בסטטוס זה', type: 'info' }));
    }
  }, [filtered.length]);

  return (
    <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="pending">ממתין לבדיקה</option>
        <option value="done">נבדק</option>
      </select>
      <input
        placeholder="חיפוש לפי כותרת משימה..."
        value={searchTask}
        onChange={(e) => setSearchTask(e.target.value)}
      />
      <input
        placeholder="חיפוש לפי שם תלמיד..."
        value={searchStudent}
        onChange={(e) => setSearchStudent(e.target.value)}
      />
      {filtered.map((t) => (
        <InstructorTask key={t.id} task={t} />
      ))}
    </div>
  );
};

export default InstructorTasks;