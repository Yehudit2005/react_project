import type { FC } from 'react';
import './Profile.scss';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface ProfileProps {}

const allJson = 'http://localhost:3001';

const Profile: FC<ProfileProps> = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  if (!currentUser) return null;

  const isStudent = currentUser?.user_type_id === 1;
  const isAdmin = !currentUser.user_type_id;

  const formik = useFormik({
    initialValues: {
      password: currentUser?.password || '',
      phone: currentUser?.phone || '',
      city: currentUser?.address?.city || '',
      street: currentUser?.address?.street || '',
      number: currentUser?.address?.number || '',
family_status: isStudent || !isAdmin ? currentUser?.family_status || '' : '',
    },
    validationSchema: yup.object().shape({
      password: yup.string()
        .min(8, 'סיסמא חייבת להכיל לפחות 8 תווים')
        .matches(/[a-zA-Z]/, 'חייבת להכיל לפחות אות אחת באנגלית')
        .matches(/[0-9]/, 'חייבת להכיל לפחות ספרה אחת')
        .matches(/[!@#$%^&*]/, 'חייבת להכיל לפחות תו מיוחד אחד')
        .required('שדה חובה'),
      phone: isStudent ? yup.string().required('שדה חובה') : yup.string(),
      city: yup.string().required('שדה חובה'),
      street: yup.string().required('שדה חובה'),
      number: yup.number().required('שדה חובה'),
      family_status: isStudent ? yup.string().required('שדה חובה') : yup.string(),
    }),
    onSubmit: async (values) => {
      const collection = isAdmin ? 'admins' : isStudent ? 'students' : 'instructors';

      const updatedData: any = {
        password: values.password,
        address: {
          city: values.city,
          street: values.street,
          number: Number(values.number),
        },
      };

      if (isStudent) {
        updatedData.phone = values.phone;
        updatedData.family_status = values.family_status;
      }

      await fetch(`${allJson}/${collection}/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      alert('הפרטים עודכנו בהצלחה!');
    }
  });

  return (
    <div className="Profile">
      <h2>פרופיל - {currentUser?.first_name} {currentUser?.last_name}</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          name="password"
          type="password"
          placeholder="סיסמא חדשה"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.errors.password && <div>{formik.errors.password}</div>}

        {isStudent && (
          <>
            <input
              name="phone"
              placeholder="טלפון"
              onChange={formik.handleChange}
              value={formik.values.phone}
            />
            {formik.errors.phone && <div>{formik.errors.phone}</div>}
          </>
        )}

        <input
          name="city"
          placeholder="עיר"
          onChange={formik.handleChange}
          value={formik.values.city}
        />
        {formik.errors.city && <div>{formik.errors.city}</div>}

        <input
          name="street"
          placeholder="רחוב"
          onChange={formik.handleChange}
          value={formik.values.street}
        />
        {formik.errors.street && <div>{formik.errors.street}</div>}

        <input
          name="number"
          type="number"
          placeholder="מספר בית"
          onChange={formik.handleChange}
          value={formik.values.number}
        />
        {formik.errors.number && <div>{formik.errors.number}</div>}

        {isStudent && (
          <>
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
            {formik.errors.family_status && <div>{formik.errors.family_status}</div>}
          </>
        )}

        <button type="submit" disabled={!formik.isValid || !formik.dirty}>
          עדכן פרטים
        </button>
      </form>
    </div>
  );
};

export default Profile;