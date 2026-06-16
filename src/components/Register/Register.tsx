import type { FC } from "react";
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import * as yup from 'yup';
import "./Register.scss";
import { useDispatch } from 'react-redux';
import { setMessage } from '../../store/messageSlice';

interface RegisterProps { }

const majors: Record<number, string> = {
  1: 'סיעוד',
  2: 'מדעי המחשב',
  3: 'פסיכולוגיה',
  4: 'פיזיקה',
  5: 'מתמטיקה',
};

const Register: FC<RegisterProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allJson = 'http://localhost:3001';

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
      age: '',
      city: '',
      street: '',
      number: '',
      major_id: '',
      study_year: '',
      family_status: '',
    },
    validationSchema: yup.object().shape({
      first_name: yup.string()
        .min(2, 'שם פרטי חייב להכיל לפחות 2 תווים')
        .max(20, 'שם פרטי לא יכול לעלות על 20 תווים')
        .required('שדה חובה'),
      last_name: yup.string()
        .min(2, 'שם משפחה חייב להכיל לפחות 2 תווים')
        .max(20, 'שם משפחה לא יכול לעלות על 20 תווים')
        .required('שדה חובה'),
      email: yup.string()
        .email('מייל לא תקין')
        .max(50, 'מייל לא יכול לעלות על 50 תווים')
        .required('שדה חובה'),
      password: yup.string()
        .min(8, 'סיסמא חייבת להכיל לפחות 8 תווים')
        .max(20, 'סיסמא לא יכולה לעלות על 20 תווים')
        .matches(/[a-zA-Z]/, 'חייבת להכיל לפחות אות אחת באנגלית')
        .matches(/[0-9]/, 'חייבת להכיל לפחות ספרה אחת')
        .matches(/[!@#$%^&*]/, 'חייבת להכיל לפחות תו מיוחד אחד')
        .required('שדה חובה'),
      phone: yup.string()
        .matches(/^0[0-9]{9}$/, 'טלפון חייב להכיל 10 ספרות ולהתחיל ב-0')
        .required('שדה חובה'),
      age: yup.number()
        .min(18, 'גיל מינימלי הוא 18')
        .max(120, 'גיל לא תקין')
        .required('שדה חובה'),
      city: yup.string()
        .min(2, 'עיר חייבת להכיל לפחות 2 תווים')
        .max(30, 'עיר לא יכולה לעלות על 30 תווים')
        .required('שדה חובה'),
      street: yup.string()
        .min(2, 'רחוב חייב להכיל לפחות 2 תווים')
        .max(30, 'רחוב לא יכול לעלות על 30 תווים')
        .required('שדה חובה'),
      number: yup.number()
        .min(1, 'מספר בית חייב להיות לפחות 1')
        .max(9999, 'מספר בית לא תקין')
        .required('שדה חובה'),
      major_id: yup.number()
        .required('שדה חובה'),
      study_year: yup.string()
        .required('שדה חובה'),
      family_status: yup.string()
        .required('שדה חובה'),
    }),
    onSubmit: async (values) => {
      const res = await fetch(`${allJson}/students`);
      const students = await res.json();

      const emailExists = students.some((s: any) => s.email === values.email);
      if (emailExists) {
        formik.setFieldError('email', 'מייל זה כבר קיים במערכת');
        return;
      }

      const phoneExists = students.some((s: any) => s.phone === values.phone);
      if (phoneExists) {
        formik.setFieldError('phone', 'טלפון זה כבר קיים במערכת');
        return;
      }

      const newId = students.length + 1;

      const newStudent = {
        id: newId,
        user_type_id: 1,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        address: {
          city: values.city,
          street: values.street,
          number: Number(values.number),
        },
        phone: values.phone,
        age: Number(values.age),
        major_id: Number(values.major_id),
        major_name: majors[Number(values.major_id)],
        study_year: values.study_year,
        family_status: values.family_status,
      };

      await fetch(`${allJson}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });

      dispatch(setMessage({ text: 'נרשמת בהצלחה!', type: 'success' }));
      navigate('/logIn');
    }
  });

  return (
    <div className="Register">
      <form onSubmit={formik.handleSubmit}>

        <input name="first_name" placeholder="שם פרטי" onChange={formik.handleChange} value={formik.values.first_name} maxLength={20} />
        {formik.errors.first_name && <div>{formik.errors.first_name}</div>}

        <input name="last_name" placeholder="שם משפחה" onChange={formik.handleChange} value={formik.values.last_name} maxLength={20} />
        {formik.errors.last_name && <div>{formik.errors.last_name}</div>}

        <input name="email" type="email" placeholder="אימייל" onChange={formik.handleChange} value={formik.values.email} maxLength={50} />
        {formik.errors.email && <div>{formik.errors.email}</div>}

        <input name="password" type="password" placeholder="סיסמא" onChange={formik.handleChange} value={formik.values.password} maxLength={20} />
        {formik.errors.password && <div>{formik.errors.password}</div>}

        <input name="phone" placeholder="טלפון" onChange={formik.handleChange} value={formik.values.phone} maxLength={10} />
        {formik.errors.phone && <div>{formik.errors.phone}</div>}

        <input name="age" type="number" placeholder="גיל" onChange={formik.handleChange} value={formik.values.age} maxLength={3} />
        {formik.errors.age && <div>{formik.errors.age}</div>}

        <input name="city" placeholder="עיר" onChange={formik.handleChange} value={formik.values.city} maxLength={30} />
        {formik.errors.city && <div>{formik.errors.city}</div>}

        <input name="street" placeholder="רחוב" onChange={formik.handleChange} value={formik.values.street} maxLength={30} />
        {formik.errors.street && <div>{formik.errors.street}</div>}

        <input name="number" type="number" placeholder="מספר בית" onChange={formik.handleChange} value={formik.values.number} maxLength={4} />
        {formik.errors.number && <div>{formik.errors.number}</div>}

        <select name="major_id" onChange={formik.handleChange} value={formik.values.major_id}>
          <option value="">בחר מגמה</option>
          <option value="1">סיעוד</option>
          <option value="2">מדעי המחשב</option>
          <option value="3">פסיכולוגיה</option>
          <option value="4">פיזיקה</option>
          <option value="5">מתמטיקה</option>
        </select>
        {formik.errors.major_id && <div>{formik.errors.major_id}</div>}

        <select name="study_year" onChange={formik.handleChange} value={formik.values.study_year}>
          <option value="">בחר שנת לימוד</option>
          <option value="ראשונה">ראשונה</option>
          <option value="שנייה">שנייה</option>
          <option value="שלישית">שלישית</option>
          <option value="רביעית">רביעית</option>
        </select>
        {formik.errors.study_year && <div>{formik.errors.study_year}</div>}

        <select name="family_status" onChange={formik.handleChange} value={formik.values.family_status}>
          <option value="">בחר מצב משפחתי</option>
          <option value="רווק/ה">רווק/ה</option>
          <option value="נשוי/אה">נשוי/אה</option>
          <option value="גרוש/ה">גרוש/ה</option>
          <option value="אלמן/ה">אלמן/ה</option>
        </select>
        {formik.errors.family_status && <div>{formik.errors.family_status}</div>}

        <button type="submit" disabled={!formik.isValid || !formik.dirty}>הרשם</button>
      </form>
    </div>
  );
};

export default Register;