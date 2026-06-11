
import type { FC } from 'react';
import './Home.scss';
import { Outlet, useNavigate } from 'react-router';
import myVideo from '../../assets/collage.mp4';
interface HomeProps {}

// const Home: FC<HomeProps> = () => {
//   const _myNavigate=useNavigate();

//   return <div className="Home">
   
//   <nav className="navbar navbar-expand-lg navbar-light bg-light">
//   <a className="navbar-brand" >my webSite</a>
//   <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//     <span className="navbar-toggler-icon"></span>
//   </button>
//   <div className="collapse navbar-collapse" id="navbarNav">
//     <ul className="navbar-nav">
//       <li className="nav-item active">
//         <a className="nav-link" onClick={()=>{_myNavigate('/home')}} >Home <span className="sr-only">(current)</span></a>
//       </li>
//       <li className="nav-item">
//         <a className="nav-link" onClick={()=>{_myNavigate('about')}}>About</a>
//       </li>
//       <li className="nav-item">
//         <a className="nav-link" onClick={()=>{_myNavigate('cart')}}>cart</a>
//       </li>
    
//     </ul>
//   </div>
// </nav>
//  <Outlet></Outlet>
//   </div>
// }

// export default Home;
 

const Home: FC = () => {
  return (
    <div className="Home">
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        {/* 2. שימוש במשתנה בתוך ה-src */}
        <video 
          src={myVideo} 
          width="70%" 
          controls 
          autoPlay 
          muted 
          loop 
        />
      </div>
    </div>
  );
};

export default Home;
