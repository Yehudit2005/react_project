import { useEffect, useState, useRef, type FC } from 'react';
import './InstructorTasks.scss';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import type { TeacherTask } from '../../Models/teacherTask.model';
import InstructorTask from '../InstructorTasks/InstructorTask/InstructorTask';
import { setMessage } from '../../store/messageSlice';

interface InstructorTasksProps {}

const allJson = 'http://localhost:3001';

const InstructorTasks: FC<InstructorTasksProps> = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState<TeacherTask[]>([]);
  const [searchTask, setSearchTask] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const [filter, setFilter] = useState('pending');
  const [visibleCount, setVisibleCount] = useState(20);
  const bottomRef = useRef<HTMLDivElement>(null);

  const removeTask = (taskId: number) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const fetchTasks = async () => {
    if (!currentUser) return;
    let url = `${allJson}/pending_reviews?instructor_id=${Number(currentUser.id)}`;
    if (searchTask) url += `&task_title_like=${searchTask}`;
    if (searchStudent) url += `&student_name_like=${searchStudent}`;

    const res = await fetch(url);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [currentUser, searchTask, searchStudent]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => prev + 20);
        }
      },
      { threshold: 0, rootMargin: '100px' }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setVisibleCount(20);
  }, [filter, searchTask, searchStudent]);

  const filtered = tasks.filter(t =>
    filter === 'done' ? t.score !== null : t.score === null
  );

  useEffect(() => {
    if (filtered.length === 0 && tasks.length > 0) {
      dispatch(setMessage({ text: 'אין משימות בסטטוס זה', type: 'info' }));
    }
  }, [filtered.length]);

  const visible = filtered.slice(0, visibleCount);

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

      {visible.map((t) => (
        <InstructorTask
          key={t.id}
          task={t}
          onRemove={removeTask}
        />
      ))}

      <div ref={bottomRef}></div>

      {visibleCount < filtered.length && (
        <button onClick={() => setVisibleCount(prev => prev + 20)}>
          טען עוד ({filtered.length - visibleCount} נותרו)
        </button>
      )}
    </div>
  );
};

export default InstructorTasks;