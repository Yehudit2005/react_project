import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { StudentTask } from '../../Models/studentTasks.model';
import Course from './Course/Course';

const Courses = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [assignments, setAssignments] = useState<StudentTask[]>([]);
  const allJson = 'http://localhost:3001';
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const trackingRes = await fetch(`${allJson}/student_assignments?student_id=${currentUser.id}`);
      const trackingData: any[] = await trackingRes.json();

      const assignmentsUrl = search
        ? `${allJson}/assignments?major_id=${currentUser.major_id}&title_like=${search}`
        : `${allJson}/assignments?major_id=${currentUser.major_id}`;

      const assignmentsRes = await fetch(assignmentsUrl);
      const majorAssignments: any[] = await assignmentsRes.json();

      const combined: StudentTask[] = trackingData.map((track) => {
        const details = majorAssignments.find((a) => a.task_number === track.task_number);
        return { ...track, ...details, id: track.id };
      }).filter((a) => a.title);

      setAssignments(combined);
    };

    if (currentUser) fetchTasks();
  }, [currentUser, search]);

  return (
    <div>
      <input
        placeholder="חיפוש משימה..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {assignments.map((a) => (
        <Course key={a.id} studentTask={a} />
      ))}
    </div>
  );
};

export default Courses;