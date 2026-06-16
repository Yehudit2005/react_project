// import { useEffect, type FC } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../../store/store';
// import { clearMessage } from '../../store/messageSlice';
// import '../Toast/Toast.scss';

// const icons = {
//   success: '✅',
//   error: '❌',
//   warning: '⚠️',
//   info: 'ℹ️'
// };

// const Toast: FC = () => {
//   const dispatch = useDispatch();
//   const { text, type } = useSelector((state: RootState) => state.message);

//   useEffect(() => {
//     if (!text || !type) return;

//     const timer = setTimeout(() => {
//       dispatch(clearMessage());
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [text, type]);

//   if (!text || !type) return null;

//   return (
// <div className={`my-toast my-toast--${type}`}>
//     <span className="my-toast__icon">{icons[type]}</span>
//     <span className="my-toast__text">{text}</span>
//   </div>
//   );
// };

// export default Toast;
import { useEffect, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { clearMessage } from '../../store/messageSlice';
import '../Toast/Toast.scss';

const icons: Record<string, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

const Toast: FC = () => {
  const dispatch = useDispatch();
  const { text, type } = useSelector((state: RootState) => state.message);

  useEffect(() => {
    if (!text) return;

    const timer = setTimeout(() => {
      dispatch(clearMessage());
    }, 3000);

    return () => clearTimeout(timer);
  }, [text, dispatch]);

  if (!text) return null;

  const toastType = type || 'info';

  return (
    <div className={`my-toast my-toast--${toastType}`}>
      <span className="my-toast__icon">{icons[toastType] || 'ℹ️'}</span>
      <span className="my-toast__text">{String(text)}</span>
    </div>
  );
};

export default Toast;