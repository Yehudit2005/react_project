import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { StudentTask } from '../../Models/studentTasks.model';
import Course from './Course/Course';

const Courses = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [assignments, setAssignments] = useState<StudentTask[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('new');
  const allJson = 'http://localhost:3001';

  useEffect(() => {
    const fetchTasks = async () => {
      const trackingRes = await fetch(`${allJson}/student_assignments?student_id=${currentUser.id}`);
      const trackingData: any[] = await trackingRes.json();

 const assignmentsUrl = search
        ? `${allJson}/assignments?major_id=${currentUser.major_id}&title_like=${search}`
        : `${allJson}/assignments?major_id=${currentUser.major_id}`;

      const assignmentsRes = await fetch(assignmentsUrl);      const majorAssignments: any[] = await assignmentsRes.json();

      const combined: StudentTask[] = trackingData.map((track) => {
        const details = majorAssignments.find((a) => a.task_number === track.task_number);
        return { ...track, ...details, id: track.id };
      }).filter((a) => a.title);

      setAssignments(combined);

      const prRes = await fetch(`${allJson}/pending_reviews?student_id=${currentUser.id}`);
      const prData = await prRes.json();
      setPendingReviews(prData);
    };

    if (currentUser) fetchTasks();
  }, [currentUser]);

  const getStatus = (a: StudentTask): 'new' | 'pending' | 'done' => {
    if (a.score !== null) return 'done';
    if (pendingReviews.some(pr => pr.task_number === a.task_number)) return 'pending';
    return 'new';
  };

  const filtered = assignments
    .filter((a) => a.title.includes(search))
    .filter((a) => getStatus(a) === filter);

  return (
    <div>
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
      {filtered.map((a) => (
        <Course key={a.id} studentTask={a} status={getStatus(a)} />
      ))}
    </div>
  );
};

export default Courses;