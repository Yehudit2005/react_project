import { useEffect, useState, useRef, type FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import type { StudentTask } from '../../Models/studentTasks.model';
import Course from './Course/Course';
import { setMessage } from '../../store/messageSlice';
import './Courses.scss';

const Courses: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const majorId = currentUser && 'major_id' in currentUser ? currentUser.major_id : null;
  const dispatch = useDispatch();
  const [assignments, setAssignments] = useState<StudentTask[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('new');
  const [visibleCount, setVisibleCount] = useState(5);
  const bottomRef = useRef<HTMLDivElement>(null);
  const allJson = 'http://localhost:3001';

  const fetchTasks = async () => {
    if (!currentUser) return;

    const trackingRes = await fetch(`${allJson}/student_assignments?student_id=${currentUser.id}`);
    const trackingData: any[] = await trackingRes.json();

    if (trackingData.length === 0) {
      dispatch(setMessage({ text: 'אין משימות מעקב עבורך, פנה למרצה', type: 'info' }));
      return;
    }

    const assignmentsUrl = search
      ? `${allJson}/assignments?major_id=${majorId}&title_like=${search}`
      : `${allJson}/assignments?major_id=${majorId}`;

    const assignmentsRes = await fetch(assignmentsUrl);
    const majorAssignments: any[] = await assignmentsRes.json();

    const prRes = await fetch(`${allJson}/pending_reviews?student_id=${currentUser.id}`);
    const prData = await prRes.json();
    setPendingReviews(prData);

    const combined: StudentTask[] = trackingData.map((track) => {
      const details = majorAssignments.find((a) => a.task_number === track.task_number);
      const prEntry = prData.find((pr: any) => Number(pr.task_number) === Number(track.task_number));
      const isPending = prEntry && prEntry.score === null;
      const isDone = track.score !== null || (prEntry && prEntry.score !== null);
      const finalScore = track.score ?? prEntry?.score ?? null;

      return {
        ...details,
        ...track,
        id: track.id,
        score: isDone ? finalScore : null,
        computedStatus: isDone ? 'done' : isPending ? 'pending' : 'new'
      };
    }).filter((a) => a.title);

    setAssignments(combined);
    setVisibleCount(20);
  };

  useEffect(() => {
    fetchTasks();
  }, [currentUser, search]);

useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    console.log('isIntersecting:', entries[0].isIntersecting);
    if (entries[0].isIntersecting) {
      setVisibleCount(prev => prev + 5);
    }
  }, { threshold: 0, rootMargin: '100px' });
  if (bottomRef.current) observer.observe(bottomRef.current);
  return () => observer.disconnect();
}, []);
  const getStatus = (a: any): 'new' | 'pending' | 'done' => {
    return a.computedStatus ?? 'new';
  };

  const filtered = assignments
    .filter((a) => a.title.includes(search))
    .filter((a) => getStatus(a) === filter)
    .slice(0, visibleCount);

  useEffect(() => {
    if (filtered.length === 0 && assignments.length > 0) {
      dispatch(setMessage({ text: 'אין משימות בסטטוס זה', type: 'info' }));
    }
  }, [filtered.length]);

  if (!currentUser) return null;

  // return (
  //   <div>
  //     <input
  //       placeholder="חיפוש משימה..."
  //       value={search}
  //       onChange={(e) => setSearch(e.target.value)}
  //     />
  //     <select value={filter} onChange={(e) => setFilter(e.target.value)}>
  //       <option value="new">לא בוצע</option>
  //       <option value="pending">ממתין לציון</option>
  //       <option value="done">בוצע</option>
  //     </select>
  //     {filtered.map((a) => (
  //       <Course key={a.id} studentTask={a} status={getStatus(a)}  />
  //     ))}
  //     <div ref={bottomRef}></div>
  //   </div>
  // );
  return (
  <div className="courses-page">
    <div className="courses-header">
      <h1>המשימות שלי</h1>
      <p>בחר/י משימה כדי לראות פרטים ולהגיש ביצוע</p>
    </div>

    <div className="courses-tools">
      <input
        placeholder="חיפוש משימה..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="new">לא בוצע</option>
        <option value="pending">ממתין לציון</option>
        <option value="done">בוצע</option>
      </select>
    </div>

    <div className="courses-grid">
      {filtered.map((a) => (
        <Course key={a.id} studentTask={a} status={getStatus(a)} />
      ))}
    </div>

    <div ref={bottomRef}></div>
  </div>
);
};

export default Courses;