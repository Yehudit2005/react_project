import { useState, type FC } from 'react';
import * as yup from 'yup';
import type { TeacherTask } from '../../../Models/teacherTask.model';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/messageSlice';
import { useUndoAction } from '../../../Hooks/useUndoAction';

const allJson = 'http://localhost:3001';

interface InstructorTaskProps {
  task: TeacherTask;
    onRemove: (id: number) => void;

}

const scoreSchema = yup.number()
  .min(0, 'הציון חייב להיות לפחות 0')
  .max(100, 'הציון לא יכול לעלות על 100')
  .required('שדה חובה');

const InstructorTask: FC<InstructorTaskProps> = ({ task, onRemove }) => {
    const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [scoreError, setScoreError] = useState('');
  const [taskDetails, setTaskDetails] = useState<any>(null);

  const {
    triggerWithUndo,
    showUndo,
    undoMessage,
    handleUndo,
    dismissUndo
  } = useUndoAction();

  const handleOpen = async () => {
    if (!isOpen) {
      const res = await fetch(`${allJson}/pending_reviews/${task.id}`);
      const data = await res.json();
      setTaskDetails(data);
    }
    setIsOpen(!isOpen);
  };

  const giveMark = async () => {
    if (score === null) return;

    const prevScore = taskDetails?.score;

    // ✔ UI אופטימי
    setTaskDetails((prev: any) => ({
      ...prev,
      score
    }));

    dispatch(setMessage({
      text: 'הציון עודכן זמנית',
      type: 'info'
    }));
onRemove(task.id!);
    triggerWithUndo(
      'ניתן לבטל את מתן הציון',

      // ✔ Undo
      () => {
        setTaskDetails((prev: any) => ({
          ...prev,
          score: prevScore
        }));

        dispatch(setMessage({
          text: 'הפעולה בוטלה',
          type: 'info'
        }));
      },

      // ✔ Commit לשרת אחרי 5 שניות
      async () => {
        const res = await fetch(
          `${allJson}/student_assignments?student_id=${task.student_id}&task_number=${task.task_number}`
        );

        const data = await res.json();
        const studentAssignment = data[0];

        await fetch(`${allJson}/student_assignments/${studentAssignment.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score, completed: true })
        });

        await fetch(`${allJson}/pending_reviews/${task.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score })
        });
      }
    );
  };

  return (
    <div>
      <h3 onClick={handleOpen} style={{ cursor: 'pointer' }}>
        {task.task_title} - {task.student_name}
      </h3>

      {isOpen && taskDetails && (
        <>
          <p>משוב תלמיד: {taskDetails.feedback}</p>
          <p>ציון: {taskDetails.score ?? 'אין עדיין'}</p>

          <input
            type="number"
            placeholder="הכנס ציון"
            value={score ?? ''}
            onChange={async (e) => {
              const value = Number(e.target.value);
              try {
                await scoreSchema.validate(value);
                setScore(value);
                setScoreError('');
              } catch (err: any) {
                setScoreError(err.message);
              }
            }}
          />

          {scoreError && <div style={{ color: 'red' }}>{scoreError}</div>}

          <button onClick={giveMark} disabled={!!scoreError || score === null}>
            שלח ציון
          </button>

          {/* ✔ UI של Undo */}
          {showUndo && (
            <div className="undo-toast">
              <span>{undoMessage}</span>

              <button onClick={handleUndo}>
                בטל פעולה
              </button>

              <button onClick={dismissUndo}>
                סגור
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InstructorTask;