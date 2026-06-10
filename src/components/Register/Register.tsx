import type { FC } from "react";
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import * as yup from 'yup';
import "./Register.scss";

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
      first_name: yup.string().required('שדה חובה'),
      last_name: yup.string().required('שדה חובה'),
      email: yup.string().email('מייל לא תקין').required('שדה חובה'),
      password: yup.string()
        .min(8, 'סיסמא חייבת להכיל לפחות 8 תווים')
        .matches(/[a-zA-Z]/, 'חייבת להכיל לפחות אות אחת באנגלית')
        .matches(/[0-9]/, 'חייבת להכיל לפחות ספרה אחת')
        .matches(/[!@#$%^&*]/, 'חייבת להכיל לפחות תו מיוחד אחד')
        .required('שדה חובה'),
      phone: yup.string().required('שדה חובה'),
      age: yup.number().required('שדה חובה'),
      city: yup.string().required('שדה חובה'),
      street: yup.string().required('שדה חובה'),
      number: yup.number().required('שדה חובה'),
      major_id: yup.number().required('שדה חובה'),
      study_year: yup.string().required('שדה חובה'),
      family_status: yup.string().required('שדה חובה'),
    }),
    onSubmit: async (values) => {
      const res = await fetch(`${allJson}/students`);
      const students = await res.json();
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

navigate('/logIn');    }
  });

  return (
    <div className="Register">
      <form onSubmit={formik.handleSubmit}>

        <input name="first_name" placeholder="שם פרטי" onChange={formik.handleChange} value={formik.values.first_name} />
        {formik.errors.first_name ? <div>{formik.errors.first_name}</div> : ''}

        <input name="last_name" placeholder="שם משפחה" onChange={formik.handleChange} value={formik.values.last_name} />
        {formik.errors.last_name ? <div>{formik.errors.last_name}</div> : ''}

        <input name="email" type="email" placeholder="אימייל" onChange={formik.handleChange} value={formik.values.email} />
        {formik.errors.email ? <div>{formik.errors.email}</div> : ''}

        <input name="password" type="password" placeholder="סיסמא" onChange={formik.handleChange} value={formik.values.password} />
        {formik.errors.password ? <div>{formik.errors.password}</div> : ''}

        <input name="phone" placeholder="טלפון" onChange={formik.handleChange} value={formik.values.phone} />
        {formik.errors.phone ? <div>{formik.errors.phone}</div> : ''}

        <input name="age" type="number" placeholder="גיל" onChange={formik.handleChange} value={formik.values.age} />
        {formik.errors.age ? <div>{formik.errors.age}</div> : ''}

        <input name="city" placeholder="עיר" onChange={formik.handleChange} value={formik.values.city} />
        {formik.errors.city ? <div>{formik.errors.city}</div> : ''}

        <input name="street" placeholder="רחוב" onChange={formik.handleChange} value={formik.values.street} />
        {formik.errors.street ? <div>{formik.errors.street}</div> : ''}

        <input name="number" type="number" placeholder="מספר בית" onChange={formik.handleChange} value={formik.values.number} />
        {formik.errors.number ? <div>{formik.errors.number}</div> : ''}

        <select name="major_id" onChange={formik.handleChange} value={formik.values.major_id}>
          <option value="">בחר מגמה</option>
          <option value="1">סיעוד</option>
          <option value="2">מדעי המחשב</option>
          <option value="3">פסיכולוגיה</option>
          <option value="4">פיזיקה</option>
          <option value="5">מתמטיקה</option>
        </select>
        {formik.errors.major_id ? <div>{formik.errors.major_id}</div> : ''}

        <select name="study_year" onChange={formik.handleChange} value={formik.values.study_year}>
          <option value="">בחר שנת לימוד</option>
          <option value="ראשונה">ראשונה</option>
          <option value="שנייה">שנייה</option>
          <option value="שלישית">שלישית</option>
          <option value="רביעית">רביעית</option>
        </select>
        {formik.errors.study_year ? <div>{formik.errors.study_year}</div> : ''}

        <select name="family_status" onChange={formik.handleChange} value={formik.values.family_status}>
          <option value="">בחר מצב משפחתי</option>
          <option value="רווק/ה">רווק/ה</option>
          <option value="נשוי/אה">נשוי/אה</option>
          <option value="גרוש/ה">גרוש/ה</option>
          <option value="אלמן/ה">אלמן/ה</option>
        </select>
        {formik.errors.family_status ? <div>{formik.errors.family_status}</div> : ''}

        <button type="submit">הרשם</button>
      </form>
    </div>
  );
};

export default Register;