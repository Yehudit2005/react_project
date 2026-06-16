import type { FC } from 'react';
import './Home.scss';
import { Outlet, useLocation } from 'react-router'; // ייבוא של Outlet ו-useLocation
import myVideo from '../../assets/collage.mp4';

const Home: FC = () => {
  const location = useLocation(); // נבדוק איפה אנחנו נמצאים

  return (
    <div className="Home">
      {(location.pathname === '/' || location.pathname === '/home') && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <video src={myVideo} width="70%" controls autoPlay muted loop />
        </div>
      )}

      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
};


export default Home;