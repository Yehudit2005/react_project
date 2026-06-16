import { useState, type FC } from 'react';
import './LogIn.scss';
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { setUser, setAdmin } from '../../store/userSlice';

interface LogInProps { }

const LogIn: FC<LogInProps> = () => {
  const navigate = useNavigate();
  const allJson = 'http://localhost:3001';
  const dispatch = useDispatch();
  const [isTeacher, setIsTeacher] = useState(true);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: yup.object().shape({
      email: yup.string().email('מייל לא תקין').required('שדה חובה'),
      password: yup.string()
        .min(8, 'סיסמא חייבת להכיל לפחות 8 תווים')
        .matches(/[a-zA-Z]/, 'סיסמא חייבת להכיל לפחות אות אחת באנגלית')
        .matches(/[0-9]/, 'סיסמא חייבת להכיל לפחות ספרה אחת')
        .matches(/[!@#$%^&*]/, 'סיסמא חייבת להכיל לפחות תו מיוחד אחד')
        .required('שדה חובה'),
    }),
    onSubmit: async (values) => {

      const adminsApi = await fetch(`${allJson}/admins`);
      const admins = await adminsApi.json();
      const foundAdmin = admins.find((a: any) => a.email === values.email);

      if (foundAdmin) {
        if (foundAdmin.password === values.password) {
          dispatch(setAdmin(true));
            dispatch(setUser(foundAdmin)); // ← הוסף
  navigate('/'); 
          // navigate('/admin');
        } else {
          formik.setFieldError('password', 'סיסמא שגויה, נסה שוב');
        }
        return;
      }

      const studentsApi = await fetch(`${allJson}/students`);
      const students = await studentsApi.json();
      const foundStudent = students.find((s: any) => s.email === values.email);

      if (foundStudent) {
        setIsTeacher(false);
        if (foundStudent.password === values.password) {
          dispatch(setAdmin(false));
          dispatch(setUser(foundStudent));
          navigate('/home/courses');
        } else {
          formik.setFieldError('password', 'סיסמא שגויה, נסה שוב');
        }
        return;
      }

      const instructorsApi = await fetch(`${allJson}/instructors`);
      const instructors = await instructorsApi.json();
      const foundInstructor = instructors.find((i: any) => i.email === values.email);

      if (foundInstructor) {
        setIsTeacher(true);
        if (foundInstructor.password === values.password) {
          dispatch(setUser(foundInstructor));
          navigate('/home/instructorTasks');
        } else {
          formik.setFieldError('password', 'סיסמא שגויה, נסה שוב');
        }
        return;
      }

      navigate('/register');
    }
  });

  return (
    <div>
      <div className="LogIn">LogIn Component</div>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="אימייל"
          />
          {formik.errors.email ? <div>{formik.errors.email}</div> : ''}
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder="סיסמא"
          />
          {formik.errors.password ? <div>{formik.errors.password}</div> : ''}
        </div>

        <button type="submit">התחבר</button>
        <button type="button" onClick={() => navigate('/register')}>תלמיד חדש?</button>
      </form>
    </div>
  );
};

export default LogIn;