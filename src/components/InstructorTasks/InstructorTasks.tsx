import { useEffect, useState, type FC } from 'react';
import './InstructorTasks.scss';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { TeacherTask } from '../../Models/teacherTask.model';
import InstructorTask from '../InstructorTasks/InstructorTask/InstructorTask';

interface InstructorTasksProps { }
const allJson = 'http://localhost:3001';

const InstructorTasks: FC<InstructorTasksProps> = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [tasks, setTasks] = useState<TeacherTask[]>([]);
  const [searchTask, setSearchTask] = useState('');
  const [searchStudent, setSearchStudent] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    const fetchTasks = async () => {
      let url = `${allJson}/pending_reviews?instructor_id=${currentUser.id}`;
      if (searchTask) url += `&task_title_like=${searchTask}`;
      if (searchStudent) url += `&student_name_like=${searchStudent}`;

      const res = await fetch(url);
      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, [currentUser, searchTask, searchStudent]);

  return (
    <div>
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
      {tasks.map((t) => (
        <InstructorTask key={t.id} task={t} />
      ))}
    </div>
  );
}
export default InstructorTasks;