// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.scss';
// import { Route, Routes } from 'react-router'; 
// import NavBar from './components/NavBar/NavBar';
// import Home from './components/Home/Home';
// import LogIn from './components/LogIn/LogIn';
// import Profile from './components/Profile/Profile';
// import Courses from './components/Courses/Courses';
// import NewTask from './components/NewTask/NewTask';
// import Register from './components/Register/Register';
// import InstructorTasks from './components/InstructorTasks/InstructorTasks';
// import About from './components/About/About'; // וודא שהקובץ קיים
// import Toast from './components/Toast/Toast';
// import { useSelector, useDispatch } from 'react-redux';
// import { Navigate } from 'react-router';
// import type { RootState } from './store/store';
// import { setMessage } from './store/messageSlice';
// function App() {
//     const currentUser = useSelector((state: RootState) => state.user.currentUser);
//   const dispatch = useDispatch();

// const protect = (element: any) => {
//   if (!currentUser) {
//     setTimeout(() => {
//       dispatch(setMessage({ text: 'עליך להתחבר תחילה', type: 'warning' }));
//     }, 0);
//     return <Navigate to="/logIn" />;
//   }
//   return element;
// };
//   return (
//     <div dir="rtl" className="container-fluid p-0">
//       <NavBar /> 

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/logIn" element={<LogIn />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/courses" element={<Courses />} />
//         <Route path="/instructorTasks" element={<InstructorTasks />} />

//         {/* אזור אישי עם Layout */}
//         <Route path="/home" element={<Home />}>
//           <Route path="profile" element={<Profile />} />
//           <Route path="courses" element={<Courses />} />
//           <Route path="instructorTasks" element={<InstructorTasks />} />
//           <Route path="/newTask" element={<NewTask />} />
// <Route path="/admin" element={<NewTask />} />
//         </Route>
//       </Routes>

//             <Toast />
//     </div>
//   );
// }

// export default App;
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Route, Routes } from 'react-router';
import NavBar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import LogIn from './components/LogIn/LogIn';
import Profile from './components/Profile/Profile';
import Courses from './components/Courses/Courses';
import NewTask from './components/NewTask/NewTask';
import Register from './components/Register/Register';
import InstructorTasks from './components/InstructorTasks/InstructorTasks';
import About from './components/About/About';
import Toast from './components/Toast/Toast';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router';
import type { RootState } from './store/store';
import { setMessage } from './store/messageSlice';

function App() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();

  const protect = (element: any) => {
    if (!currentUser) {
      setTimeout(() => {
        dispatch(setMessage({ text: 'עליך להתחבר תחילה', type: 'warning' }));
      }, 0);
      return <Navigate to="/logIn" />;
    }
    return element;
  };

  return (
    <div dir="rtl" className="container-fluid p-0">
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/instructorTasks" element={<InstructorTasks />} />
                  <Route path="/newTask" element={<NewTask />} />

        {/* אזור אישי עם Layout */}
        <Route path="/home" element={<Home />}>
          <Route path="profile" element={<Profile />} />
          <Route path="courses" element={<Courses />} />
          <Route path="instructorTasks" element={<InstructorTasks />} />
          {/* <Route path="/admin" element={<NewTask />} /> */}
          </Route>
          </Routes>

      <Toast />
    </div>
  );
}

export default App;