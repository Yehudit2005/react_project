import type { FC } from 'react';
import './Profile.scss';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { setMessage } from '../../store/messageSlice';
import { useUndoAction } from '../../Hooks/useUndoAction';

const allJson = 'http://localhost:3001';

const Profile: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();

  const {
    triggerWithUndo,
    showUndo,
    undoMessage,
    handleUndo,
    dismissUndo
  } = useUndoAction();

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
      family_status: isStudent ? currentUser?.family_status || '' : '',
    },

    validationSchema: yup.object().shape({
      password: yup.string()
        .min(8, 'סיסמא חייבת להכיל לפחות 8 תווים')
        .matches(/[a-zA-Z]/)
        .matches(/[0-9]/)
        .matches(/[!@#$%^&*]/)
        .required('שדה חובה'),

      phone: isStudent ? yup.string().required('שדה חובה') : yup.string(),
      city: yup.string().required('שדה חובה'),
      street: yup.string().required('שדה חובה'),
      number: yup.number().required('שדה חובה'),
      family_status: isStudent ? yup.string().required('שדה חובה') : yup.string(),
    }),

    onSubmit: async (values) => {
      const collection =
        isAdmin ? 'admins' : isStudent ? 'students' : 'instructors';

      const prevValues = { ...formik.values };

      // ✔ UI אופטימי (formik כבר מחזיק את השינויים אז אין צורך לשנות state נוסף)

      dispatch(setMessage({
        text: 'הפרטים עודכנו זמנית',
        type: 'info'
      }));

      triggerWithUndo(
        'ניתן לבטל עדכון פרופיל',

        // ✔ Undo
        () => {
          formik.setValues(prevValues);

          dispatch(setMessage({
            text: 'העדכון בוטל',
            type: 'info'
          }));
        },

        // ✔ Commit לשרת
        async () => {
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
          formik.resetForm({
            values: values
          });
          dispatch(setMessage({
            text: 'הפרטים נשמרו בהצלחה',
            type: 'success'
          }));
        }
      );
    }
  });

  return (
    <div className="Profile">
      <h2>
        פרופיל - {currentUser.first_name} {currentUser.last_name}
      </h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          name="password"
          type="password"
          placeholder="סיסמא חדשה"
          onChange={formik.handleChange}
          value={formik.values.password}
        />

        {isStudent && (
          <input
            name="phone"
            placeholder="טלפון"
            onChange={formik.handleChange}
            value={formik.values.phone}
          />
        )}

        <input
          name="city"
          placeholder="עיר"
          onChange={formik.handleChange}
          value={formik.values.city}
        />

        <input
          name="street"
          placeholder="רחוב"
          onChange={formik.handleChange}
          value={formik.values.street}
        />

        <input
          name="number"
          type="number"
          placeholder="מספר בית"
          onChange={formik.handleChange}
          value={formik.values.number}
        />

        {isStudent && (
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
        )}

        <button type="submit" disabled={!formik.isValid || !formik.dirty}>
          עדכן פרטים
        </button>
      </form>

      {/* ✔ Undo UI */}
      {showUndo && (
        <div className="undo-toast">
          <span>{undoMessage}</span>

          <button onClick={handleUndo}>בטל פעולה</button>
          <button onClick={dismissUndo}>סגור</button>
        </div>
      )}
    </div>
  );
};

export default Profile;