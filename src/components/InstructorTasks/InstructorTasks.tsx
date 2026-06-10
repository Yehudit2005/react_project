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
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    const fetchTasks = async () => {
  // const url = search
  //   ? `${allJson}/pending_reviews?instructor_id=${currentUser.id}&task_title_like=${search}`
  //   : `${allJson}/pending_reviews?instructor_id=${currentUser.id}`;
  const url = search
  ? `${allJson}/pending_reviews?instructor_id=${currentUser.id}&q=${search}`
  : `${allJson}/pending_reviews?instructor_id=${currentUser.id}`;
    
  const res = await fetch(url);
  const data = await res.json();
  setTasks(data);
};

    fetchTasks();
  }, [currentUser, search]);

  return (
    <div>
      <input
        placeholder="חיפוש משימה..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {tasks.map((t) => (
        <InstructorTask key={t.id} task={t} />
      ))}
    </div>
  );
};

export default InstructorTasks;
