import { useEffect, useState, type FC } from 'react';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../store/messageSlice';
import type { TeacherTask } from '../../Models/teacherTask.model';
import type { Instructor } from '../../Models/user.model';
import './AdminTasks.scss';

interface AdminTasksProps {}

const AdminTasks: FC<AdminTasksProps> = () => {
  const allJson = 'http://localhost:3001';
  const dispatch = useDispatch();
  const [assignments, setAssignments] = useState<TeacherTask[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [assignRes, instructorRes] = await Promise.all([
        fetch(`${allJson}/assignments`),
        fetch(`${allJson}/instructors`),
      ]);
      setAssignments(await assignRes.json());
      setInstructors(await instructorRes.json());
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    await fetch(`${allJson}/assignments/${id}`, { method: 'DELETE' });
    setAssignments(prev => prev.filter(a => a.id !== id));
    dispatch(setMessage({ text: 'המשימה נמחקה בהצלחה', type: 'success' }));
  };

  const getInstructorName = (id: number) => {
    const inst = instructors.find(i => Number(i.id) === id);
    return inst ? `${inst.first_name} ${inst.last_name}` : 'לא ידוע';
  };

  const grouped = assignments.reduce((acc, task) => {
    if (!acc[task.major_name]) acc[task.major_name] = [];
    acc[task.major_name].push(task);
    return acc;
  }, {} as Record<string, TeacherTask[]>);

  return (
    <div className="AdminTasks">
      <h2>כל המשימות</h2>
      {Object.entries(grouped).map(([major, tasks]) => (
        <div key={major} className="">
          <h4 >{major}</h4>
          <ul >
            {tasks.map(task => (
              <li key={task.id} >
                <div>
       <span>{(task as any).title}</span>
                  <span > | מרצה: {getInstructorName(task.instructor_id)}</span>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(task.id!)}
                >
                  מחק
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminTasks;