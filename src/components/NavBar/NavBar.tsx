import type { FC } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { setUser } from '../../store/userSlice';
import './NavBar.scss';

const NavBar: FC = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const handleLogout = () => {
    dispatch(setUser(null));
    nav('/');
  };

  const handleCoursesClick = () => {
    if (currentUser) {
      // ניווט לנתיבים הראשיים שהגדרנו ב-App.tsx
      nav(currentUser.user_type_id === 2 ? '/instructorTasks' : '/courses');
    } else {
      nav('/logIn');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
      <div className="navbar-brand fw-bold" onClick={() => nav('/')} style={{cursor: 'pointer'}}>
        🎓 האקדמיה
      </div>
      
      <div className="navbar-nav ms-auto gap-3">
        <div className="nav-link" onClick={() => nav('/')} style={{cursor: 'pointer'}}>בית</div>
        <div className="nav-link" onClick={() => nav('/about')} style={{cursor: 'pointer'}}>About</div>
        
        <div className="nav-link" onClick={handleCoursesClick} style={{cursor: 'pointer'}}>
    המשימות שלי
        </div>

        {currentUser ? (
          <>
            <div className="nav-link text-primary fw-bold" onClick={() => nav('/home/profile')} style={{cursor: 'pointer'}}>
              👤 {currentUser.first_name}
            </div>
            <div className="nav-link text-danger" onClick={handleLogout} style={{cursor: 'pointer'}}>
              יציאה
            </div>
          </>
        ) : (
          <div className="nav-link" onClick={() => nav('/logIn')} style={{cursor: 'pointer'}}>
            כניסה
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;