import type { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import "./NewTask.scss";
import { useDispatch } from "react-redux";
import { setMessage } from "../../store/messageSlice";

interface NewTaskProps {}

const majorNames: Record<number, string> = {
  1: "סיעוד",
  2: "מדעי המחשב",
  3: "פסיכולוגיה",
  4: "פיזיקה",
  5: "מתמטיקה",
};

const NewTask: FC<NewTaskProps> = () => {
  const allJson = "http://localhost:3001";
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      major_id: "",
      instructor_id: "",
    },
    validationSchema: yup.object().shape({
      title: yup.string().required("שדה חובה"),
      description: yup.string().required("שדה חובה"),
      major_id: yup.number().required("שדה חובה"),
      instructor_id: yup
        .number()
        .min(1, "מזהה מרצה חייב להיות בין 1 ל-20")
        .max(20, "מזהה מרצה חייב להיות בין 1 ל-20")
        .required("שדה חובה"),
    }),
    onSubmit: async (values) => {
      const majorId = Number(values.major_id);

      const res = await fetch(`${allJson}/assignments?major_id=${majorId}`);
      const majorAssignments = await res.json();
      const newTaskNumber = majorAssignments.length + 1;
      const newId = majorId * 100 + newTaskNumber;

      const newTask = {
        id: newId,
        task_number: newTaskNumber,
        major_id: majorId,
        major_name: majorNames[majorId],
        instructor_id: Number(values.instructor_id),
        title: values.title,
        description: values.description,
      };

      await fetch(`${allJson}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      dispatch(setMessage({ text: "המשימה נוספה בהצלחה", type: "success" }));
      formik.resetForm();
    },
  });

  return (
    <div className="NewTask">
      <div className="new-task-card">
        <div className="new-task-badge">ניהול משימות</div>

        <h1>הוספת משימה חדשה</h1>
        <p className="new-task-subtitle">
          מלא/י את פרטי המשימה, בחר/י מגמה ושייך/י אותה למרצה מתאים
        </p>

        <form onSubmit={formik.handleSubmit} className="new-task-form">
          <div className="form-field">
            <label>כותרת המשימה</label>
            <input
              name="title"
              placeholder="לדוגמה: תרגול בנושא כלשהוא"
              onChange={formik.handleChange}
              value={formik.values.title}
            />
            {formik.errors.title && (
              <span className="field-error">{formik.errors.title}</span>
            )}
          </div>

          <div className="form-field">
            <label>תיאור המשימה</label>
            <textarea
              name="description"
              placeholder="כתבי כאן את פרטי המשימה..."
              onChange={formik.handleChange}
              value={formik.values.description}
            />
            {formik.errors.description && (
              <span className="field-error">{formik.errors.description}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>מגמה</label>
              <select
                name="major_id"
                onChange={formik.handleChange}
                value={formik.values.major_id}
              >
                <option value="">בחר מגמה</option>
                <option value="1">סיעוד</option>
                <option value="2">מדעי המחשב</option>
                <option value="3">פסיכולוגיה</option>
                <option value="4">פיזיקה</option>
                <option value="5">מתמטיקה</option>
              </select>
              {formik.errors.major_id && (
                <span className="field-error">{formik.errors.major_id}</span>
              )}
            </div>

            <div className="form-field">
              <label>מזהה מרצה</label>
              <input
                name="instructor_id"
                type="number"
                placeholder="מספר בין 1 ל-20"
                onChange={formik.handleChange}
                value={formik.values.instructor_id}
              />
              {formik.errors.instructor_id && (
                <span className="field-error">{formik.errors.instructor_id}</span>
              )}
            </div>
          </div>

          <button type="submit" className="submit-task-btn">
            הוסף משימה
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTask;
// import type { FC } from "react";
// import { useNavigate } from 'react-router';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import "./NewTask.scss";
// import { useDispatch } from 'react-redux';
// import { setMessage } from '../../store/messageSlice';

// interface NewTaskProps { }

// const majorNames: Record<number, string> = {
//   1: 'סיעוד',
//   2: 'מדעי המחשב',
//   3: 'פסיכולוגיה',
//   4: 'פיזיקה',
//   5: 'מתמטיקה',
// };

// const NewTask: FC<NewTaskProps> = () => {
//   const navigate = useNavigate();
//   const allJson = 'http://localhost:3001';
// const dispatch = useDispatch();
//   const formik = useFormik({
//     initialValues: {
//       title: '',
//       description: '',
//       major_id: '',
//       instructor_id: '',
//     },
//     validationSchema: yup.object().shape({
//       title: yup.string().required('שדה חובה'),
//       description: yup.string().required('שדה חובה'),
//       major_id: yup.number().required('שדה חובה'),
//       instructor_id: yup.number()
//         .min(1, 'מזהה מרצה חייב להיות בין 1 ל-20')
//         .max(20, 'מזהה מרצה חייב להיות בין 1 ל-20')
//         .required('שדה חובה'),
//     }),
//     onSubmit: async (values) => {
//       const majorId = Number(values.major_id);

//       // מביאים את המשימות של אותה מגמה כדי לחשב task_number הבא
//       const res = await fetch(`${allJson}/assignments?major_id=${majorId}`);
//       const majorAssignments = await res.json();
//       const newTaskNumber = majorAssignments.length + 1;
//       const newId = majorId * 100 + newTaskNumber;

//       const newTask = {
//         id: newId,
//         task_number: newTaskNumber,
//         major_id: majorId,
//         major_name: majorNames[majorId],
//         instructor_id: Number(values.instructor_id),
//         title: values.title,
//         description: values.description,
//       };

//       await fetch(`${allJson}/assignments`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newTask),
//       });

//       // navigate('/home');
//       dispatch(setMessage({ text: 'המשימה נוספה בהצלחה', type: 'success' }));
// formik.resetForm();
//     }
//   });

//   return (
//     <div className="NewTask">
//       <form onSubmit={formik.handleSubmit}>

//         <input
//           name="title"
//           placeholder="כותרת המשימה"
//           onChange={formik.handleChange}
//           value={formik.values.title}
//         />
//         {formik.errors.title ? <div>{formik.errors.title}</div> : ''}

//         <input
//           name="description"
//           placeholder="תיאור המשימה"
//           onChange={formik.handleChange}
//           value={formik.values.description}
//         />
//         {formik.errors.description ? <div>{formik.errors.description}</div> : ''}

//         <select name="major_id" onChange={formik.handleChange} value={formik.values.major_id}>
//           <option value="">בחר מגמה</option>
//           <option value="1">סיעוד</option>
//           <option value="2">מדעי המחשב</option>
//           <option value="3">פסיכולוגיה</option>
//           <option value="4">פיזיקה</option>
//           <option value="5">מתמטיקה</option>
//         </select>
//         {formik.errors.major_id ? <div>{formik.errors.major_id}</div> : ''}

//         <input
//           name="instructor_id"
//           type="number"
//           placeholder="מזהה מרצה (בטווח של 1-20)"
//           onChange={formik.handleChange}
//           value={formik.values.instructor_id}
//         />
//         {formik.errors.instructor_id ? <div>{formik.errors.instructor_id}</div> : ''}

//         <button type="submit">הוסף משימה</button>
//       </form>
//     </div>
//   );
// };

// export default NewTask;
