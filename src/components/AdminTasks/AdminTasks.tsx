import { useEffect, useState, useRef, type FC } from 'react';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../store/messageSlice';
import type { TeacherTask } from '../../Models/teacherTask.model';
import type { User } from '../../Models/user.model';
import './AdminTasks.scss';
import { useUndoAction } from '../../Hooks/useUndoAction';
import AdminTask from './AdminTask/AdminTask';

interface AdminTasksProps {}

const AdminTasks: FC<AdminTasksProps> = () => {
  const allJson = 'http://localhost:3001';
  const dispatch = useDispatch();
  const [assignments, setAssignments] = useState<TeacherTask[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);

  const { showUndo, undoMessage, triggerWithUndo, handleUndo, dismissUndo } = useUndoAction();
  const [visibleCount, setVisibleCount] = useState(20);
  const bottomRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => prev + 20);
      }
    });
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDelete = (id: number) => {
    const deletedTask = assignments.find(a => a.id === id);
    const deletedIndex = assignments.findIndex(a => a.id === id);

    if (!deletedTask) return;

    setAssignments(prev => prev.filter(a => a.id !== id));

    triggerWithUndo(
      'המשימה נמחקה',

      // onUndo
      () => {
        setAssignments(prev => {
          const updated = [...prev];
          updated.splice(deletedIndex, 0, deletedTask);
          return updated;
        });
        dispatch(setMessage({ text: 'הפעולה בוטלה — המשימה שוחזרה', type: 'info' }));
      },

      // onCommit
      async () => {
        await fetch(`${allJson}/assignments/${id}`, { method: 'DELETE' });
      }
    );
  };

  const getInstructorName = (id: number) => {
    const inst = instructors.find(i => Number(i.id) === id);
    return inst ? `${inst.first_name} ${inst.last_name}` : 'לא ידוע';
  };

  const grouped = assignments.slice(0, visibleCount).reduce((acc, task) => {
    if (!acc[task.major_name]) acc[task.major_name] = [];
    acc[task.major_name].push(task);
    return acc;
  }, {} as Record<string, TeacherTask[]>);

  // return (
  //   <div className="AdminTasks">
  //     <h2>כל המשימות</h2>

  //     {Object.entries(grouped).map(([major, tasks]) => (
  //       <div key={major}>
  //         <h4>{major}</h4>
  //         <ul>
  //           {tasks.map(task => (
  //             <li key={task.id}>
  //               <div>
  //                 <span>{(task as any).title}</span>
  //                 <span> | מרצה: {getInstructorName(task.instructor_id)}</span>
  //               </div>
  //               <button
  //                 className="btn btn-danger btn-sm"
  //                 onClick={() => handleDelete(task.id!)}
  //               >
  //                 מחק
  //               </button>
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     ))}

  //     <div ref={bottomRef}></div>

  //     {showUndo && (
  //       <div className="undo-toast">
  //         <span>{undoMessage}</span>
  //         <button onClick={handleUndo}>↩ בטל פעולה</button>
  //         <button onClick={dismissUndo}>✕</button>
  //       </div>
  //     )}
  //   </div>
  // );
  return (
  <div className="admin-tasks-page">
    <div className="admin-tasks-header">
      <h1>ניהול משימות</h1>
      <p>צפייה בכל המשימות, חלוקה לפי מגמות ומחיקת משימות קיימות</p>
    </div>

    {Object.entries(grouped).map(([major, tasks]) => (
      <section className="admin-major-section" key={major}>
        <h2>{major}</h2>

        <div className="admin-tasks-grid">
          {tasks.map((task) => (
            <AdminTask
              key={task.id}
              task={task}
              instructorName={getInstructorName(task.instructor_id)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>
    ))}

    <div ref={bottomRef}></div>

    {showUndo && (
      <div className="undo-toast">
        <span>{undoMessage}</span>
        <button onClick={handleUndo}>↩ בטל פעולה</button>
        <button onClick={dismissUndo}>✕</button>
      </div>
    )}
  </div>
);
};

export default AdminTasks;