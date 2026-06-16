import { useState, type FC } from "react";
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
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="register-card">
        <div className="register-badge">הרשמה למערכת</div>

        <h1>תלמיד חדש</h1>
        <p className="register-subtitle">
          מלאי את הפרטים האישיים כדי לפתוח חשבון במכללת פסגה
        </p>

        <form onSubmit={formik.handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-field">
              <label>שם פרטי</label>
              <input
                name="first_name"
                placeholder="שם פרטי"
                onChange={formik.handleChange}
                value={formik.values.first_name}
                maxLength={20}
              />
              {formik.errors.first_name && <span className="field-error">{formik.errors.first_name}</span>}
            </div>

            <div className="form-field">
              <label>שם משפחה</label>
              <input
                name="last_name"
                placeholder="שם משפחה"
                onChange={formik.handleChange}
                value={formik.values.last_name}
                maxLength={20}
              />
              {formik.errors.last_name && <span className="field-error">{formik.errors.last_name}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>אימייל</label>
              <input
                name="email"
                type="email"
                placeholder="אימייל"
                onChange={formik.handleChange}
                value={formik.values.email}
                maxLength={50}
              />
              {formik.errors.email && <span className="field-error">{formik.errors.email}</span>}
            </div>

            <div className="form-field">
              <label>סיסמה</label>
              <div className="password-wrapper">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="סיסמה"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  maxLength={20}
                />

                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'הסתר' : 'הצג'}
                </button>
              </div>
              {formik.errors.password && <span className="field-error">{formik.errors.password}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>טלפון</label>
              <input
                name="phone"
                placeholder="טלפון"
                onChange={formik.handleChange}
                value={formik.values.phone}
                maxLength={10}
              />
              {formik.errors.phone && <span className="field-error">{formik.errors.phone}</span>}
            </div>

            <div className="form-field">
              <label>גיל</label>
              <input
                name="age"
                type="number"
                placeholder="גיל"
                onChange={formik.handleChange}
                value={formik.values.age}
                maxLength={3}
              />
              {formik.errors.age && <span className="field-error">{formik.errors.age}</span>}
            </div>
          </div>

          <div className="form-section-title">כתובת</div>

          <div className="form-row three">
            <div className="form-field">
              <label>עיר</label>
              <input
                name="city"
                placeholder="עיר"
                onChange={formik.handleChange}
                value={formik.values.city}
                maxLength={30}
              />
              {formik.errors.city && <span className="field-error">{formik.errors.city}</span>}
            </div>

            <div className="form-field">
              <label>רחוב</label>
              <input
                name="street"
                placeholder="רחוב"
                onChange={formik.handleChange}
                value={formik.values.street}
                maxLength={30}
              />
              {formik.errors.street && <span className="field-error">{formik.errors.street}</span>}
            </div>

            <div className="form-field">
              <label>מספר בית</label>
              <input
                name="number"
                type="number"
                placeholder="מספר"
                onChange={formik.handleChange}
                value={formik.values.number}
                maxLength={4}
              />
              {formik.errors.number && <span className="field-error">{formik.errors.number}</span>}
            </div>
          </div>

          <div className="form-section-title">לימודים</div>

          <div className="form-row three">
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
              {formik.errors.major_id && <span className="field-error">{formik.errors.major_id}</span>}
            </div>

            <div className="form-field">
              <label>שנת לימוד</label>
              <select
                name="study_year"
                onChange={formik.handleChange}
                value={formik.values.study_year}
              >
                <option value="">בחר שנת לימוד</option>
                <option value="ראשונה">ראשונה</option>
                <option value="שנייה">שנייה</option>
                <option value="שלישית">שלישית</option>
                <option value="רביעית">רביעית</option>
              </select>
              {formik.errors.study_year && <span className="field-error">{formik.errors.study_year}</span>}
            </div>

            <div className="form-field">
              <label>מצב משפחתי</label>
              <select
                name="family_status"
                onChange={formik.handleChange}
                value={formik.values.family_status}
              >
                <option value="">בחר מצב משפחתי</option>
                <option value="רווק/ה">רווק/ה</option>
                <option value="נשוי/אה">נשוי/אה</option>
                <option value="גרוש/ה">גרוש/ה</option>
                <option value="אלמן/ה">אלמן/ה</option>
              </select>
              {formik.errors.family_status && <span className="field-error">{formik.errors.family_status}</span>}
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={!formik.isValid || !formik.dirty}>
            הירשם
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;