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
  const isAdmin = useSelector((state: RootState) => state.user.isAdmin);

  const handleLogout = () => {
    dispatch(setUser(null));
    nav('/');
  };

  const handleCoursesClick = () => {
    if (currentUser) {
      if (isAdmin) {
        nav('/adminTasks');
      } else {
        nav(currentUser.user_type_id === 2 ? '/instructorTasks' : '/courses');
      }
    } else {
      nav('/logIn');
    }
  };

  return (
    <nav>
      <div className="brand" onClick={() => nav('/')}>
        🎓 האקדמיה
      </div>

      <div className="nav-items">
        <div className="nav-item" onClick={() => nav('/')}>בית</div>
        <div className="nav-item" onClick={() => nav('/about')}>About</div>
        <div className="nav-item" onClick={handleCoursesClick}>המשימות שלי</div>
        {isAdmin && (
          <div className="nav-item" onClick={() => nav('/newTask')}>הוספת משימה</div>
        )}
        {currentUser ? (
          <>
            <div className="nav-item-primary" onClick={() => nav('/home/profile')}>
              👤 {isAdmin ? 'מנהל' : currentUser.first_name}
            </div>
            <div className="nav-item-danger" onClick={handleLogout}>יציאה</div>
          </>
        ) : (
          <div className="nav-item" onClick={() => nav('/logIn')}>כניסה</div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;