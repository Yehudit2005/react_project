import { useState, type FC } from 'react';
import type { StudentTask } from '../../../Models/studentTasks.model';
import { useFormik } from 'formik';
import * as yup from 'yup';
import type { TeacherTask } from '../../../Models/teacherTask.model';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';

const allJson = 'http://localhost:3001';

interface CourseProps {
  studentTask: StudentTask;
  status: 'new' | 'pending' | 'done';
}

const Course: FC<CourseProps> = ({ studentTask, status }) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [isOpen, setIsOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState<any>(null);
  const [trackingDetails, setTrackingDetails] = useState<any>(null);

  const formik = useFormik({
    initialValues: { feedback: '' },
    validationSchema: yup.object().shape({
      feedback: yup.string()
        .max(300, 'המשוב לא יכול לעלות על 300 תווים')
        .min(10, 'המשוב לא יכול להכיל פחות מ10 תווים')
        .required('שדה חובה'),
    }),
    onSubmit: async () => {
      await updateTeacher();
    }
  });

  const handleOpen = async () => {
    if (!isOpen) {
      // קריאה 1 — פרטי המשימה
      const assignmentRes = await fetch(
        `${allJson}/assignments?major_id=${studentTask.major_id}&task_number=${studentTask.task_number}`
      );
      const assignmentData = await assignmentRes.json();
      setTaskDetails(assignmentData[0]);

      // קריאה 2 — סטטוס הסטודנט על המשימה
      const trackingRes = await fetch(
        `${allJson}/student_assignments?student_id=${currentUser.id}&task_number=${studentTask.task_number}`
      );
      const trackingData = await trackingRes.json();
      setTrackingDetails(trackingData[0]);
    }
    setIsOpen(!isOpen);
  };

  const updateTeacher = async () => {
    const newTask: TeacherTask = {
      instructor_id: studentTask.instructor_id,
      task_number: studentTask.task_number,
      major_name: studentTask.major_name,
      student_id: currentUser.id,
      task_title: studentTask.title,
      student_name: currentUser.first_name,
      feedback: formik.values.feedback,
      score: null
    };

    await fetch(`${allJson}/pending_reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
  };

  return (
    <div>
      <h3 onClick={handleOpen} style={{ cursor: 'pointer' }}>
        {studentTask.title}
      </h3>

      {isOpen && taskDetails && trackingDetails && (
        <>
  <p>{taskDetails.description}</p>
          <p>בוצע: {trackingDetails.completed ? 'כן' : 'לא'}</p>
          <p>ציון: {trackingDetails.score ?? 'אין עדיין'}</p>

          {status === 'new' && (
            <form onSubmit={formik.handleSubmit}>
              <input
                name="feedback"
                placeholder="משוב ופירוט איך היתה המשימה (עד 300 תווים)"
                onChange={formik.handleChange}
                value={formik.values.feedback}
              />
              {formik.errors.feedback && <div>{formik.errors.feedback}</div>}
              <button type="submit" disabled={!formik.isValid || !formik.dirty}>הגשה</button>
            </form>
          )}

          {status === 'pending' && <p>⏳ המשימה ממתינה לבדיקה</p>}
          {status === 'done' && <p>✅ הושלם</p>}
        </>
      )}
    </div>
  );
};

export default Course;