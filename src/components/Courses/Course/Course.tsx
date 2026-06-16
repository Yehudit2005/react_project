import { useState, type FC } from 'react';
import type { StudentTask } from '../../../Models/studentTasks.model';
import { useFormik } from 'formik';
import * as yup from 'yup';
import type { TeacherTask } from '../../../Models/teacherTask.model';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store/store';
import { setMessage } from '../../../store/messageSlice';
import { useUndoAction } from '../../../Hooks/useUndoAction';
import './Course.scss';

const allJson = 'http://localhost:3001';

interface CourseProps {
  studentTask: StudentTask;
  status: 'new' | 'pending' | 'done';
  refreshTasks: () => Promise<void>;
}

const Course: FC<CourseProps> = ({ studentTask, status, refreshTasks }) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();

  const {
    triggerWithUndo,
    showUndo,
    undoMessage,
    handleUndo,
    dismissUndo
  } = useUndoAction();

  const [isOpen, setIsOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState<any>(null);
  const [trackingDetails, setTrackingDetails] = useState<any>(null);
  const [localStatus, setLocalStatus] = useState(status);

  const formik = useFormik({
    initialValues: { feedback: '' },
    validationSchema: yup.object().shape({
      feedback: yup.string()
        .max(300, 'המשוב לא יכול לעלות על 300 תווים')
        .min(10, 'המשוב לא יכול להכיל פחות מ10 תווים')
        .required('שדה חובה'),
    }),
    onSubmit: async () => {
      await handleSubmit();
    }
  });

  const handleOpen = async () => {
    if (!isOpen) {
      const assignmentRes = await fetch(
        `${allJson}/assignments?major_id=${studentTask.major_id}&task_number=${studentTask.task_number}`
      );
      const assignmentData = await assignmentRes.json();
      setTaskDetails(assignmentData[0]);

      const trackingRes = await fetch(
        `${allJson}/student_assignments?student_id=${currentUser?.id}&task_number=${studentTask.task_number}`
      );
      const trackingData = await trackingRes.json();
      setTrackingDetails(trackingData[0]);
    }

    setIsOpen(!isOpen);
  };

  const handleSubmit = async () => {
    const feedbackValue = formik.values.feedback;

    setIsOpen(false);

    triggerWithUndo(
      'ניתן לבטל שליחה',

      () => {
        dispatch(setMessage({
          text: 'הפעולה בוטלה',
          type: 'info'
        }));
      },

      async () => {
        const newTask: TeacherTask = {
          instructor_id: studentTask.instructor_id,
          task_number: Number(studentTask.task_number),
          major_name: studentTask.major_name,
          student_id: Number(currentUser?.id),
          task_title: studentTask.title,
          student_name: currentUser?.first_name,
          feedback: feedbackValue,
          score: null
        };

        await fetch(`${allJson}/pending_reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask)
        });

        setLocalStatus('pending');
        formik.resetForm();
        await refreshTasks();

        dispatch(setMessage({
          text: 'המשימה נשלחה בהצלחה',
          type: 'success'
        }));
      }
    );
  };

  return (
    <>
      <div className={`course-card ${localStatus}`} onClick={handleOpen}>
        <div className="course-status">
          {localStatus === 'new' && 'חדש'}
          {localStatus === 'pending' && 'ממתין'}
          {localStatus === 'done' && 'בוצע'}
        </div>

        <h3>{studentTask.title}</h3>

        <p>לחץ/י לצפייה בפרטי המשימה</p>
      </div>

      {isOpen && taskDetails && trackingDetails && (
        <div className="task-modal-overlay" onClick={handleOpen}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={handleOpen}>
              ×
            </button>

            <h2>{studentTask.title}</h2>

            <p className="task-description">{taskDetails.description}</p>

            <div className="task-info">
              <span>בוצע: {trackingDetails.completed ? 'כן' : 'לא'}</span>
              <span>ציון: {trackingDetails.score ?? 'אין עדיין'}</span>
            </div>

            {localStatus === 'new' && (
              <form onSubmit={formik.handleSubmit} className="task-form">
                <input
                  name="feedback"
                  placeholder="משוב ופירוט עד 300 תווים"
                  onChange={formik.handleChange}
                  value={formik.values.feedback}
                />

                {formik.errors.feedback && (
                  <div className="form-error">{formik.errors.feedback}</div>
                )}

                <button type="submit" disabled={!formik.isValid || !formik.dirty}>
                  הגשה
                </button>
              </form>
            )}

            {localStatus === 'pending' && (
              <p className="status-message">המשימה ממתינה לבדיקה</p>
            )}

            {localStatus === 'done' && (
              <p className="status-message">המשימה הושלמה</p>
            )}
          </div>
        </div>
      )}

      {showUndo && (
        <div className="undo-toast">
          <span>{undoMessage}</span>

          <button onClick={handleUndo}>בטל פעולה</button>

          <button onClick={dismissUndo}>סגור</button>
        </div>
      )}
    </>
  );
};

export default Course;