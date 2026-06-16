// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.scss';
// import { Route, Routes } from 'react-router';
// import { lazy, Suspense } from 'react';
// import NavBar from './components/NavBar/NavBar';
// import Home from './components/Home/Home';
// import LogIn from './components/LogIn/LogIn';
// import Profile from './components/Profile/Profile';
// import Courses from './components/Courses/Courses';
// import Register from './components/Register/Register';
// import InstructorTasks from './components/InstructorTasks/InstructorTasks';
// import About from './components/About/About';
// import Toast from './components/Toast/Toast';
// import AdminTasks from './components/AdminTasks/AdminTasks';
// import { useSelector, useDispatch } from 'react-redux';
// import { Navigate } from 'react-router';
// import type { RootState } from './store/store';
// import { setMessage } from './store/messageSlice';
// import { useEffect } from 'react';
// import { setUser, setAdmin } from './store/userSlice';

// const NewTask = lazy(() => import('./components/NewTask/NewTask'));

// function App() {
//   const currentUser = useSelector((state: RootState) => state.user.currentUser);
//   const dispatch = useDispatch();

//   const protect = (element: any) => {
//     if (!currentUser) {
//       setTimeout(() => {
//         dispatch(setMessage({ text: 'עליך להתחבר תחילה', type: 'warning' }));
//       }, 0);
//       return <Navigate to="/logIn" />;
//     }
//     return element;
//   };

//   return (
//     <div dir="rtl" className="container-fluid p-0">
//       <NavBar />

//       <Suspense fallback={<div>טוען...</div>}>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/logIn" element={<LogIn />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/courses" element={<Courses />} />
//           <Route path="/instructorTasks" element={<InstructorTasks />} />
//           <Route path="/newTask" element={<NewTask />} />
//           <Route path="/adminTasks" element={<AdminTasks />} />

//           <Route path="/home" element={<Home />}>
//             <Route path="profile" element={<Profile />} />
//             <Route path="courses" element={<Courses />} />
//             <Route path="instructorTasks" element={<InstructorTasks />} />
//           </Route>
//         </Routes>
//       </Suspense>

//       <Toast />
//     </div>
//   );
// }

// export default App;
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Route, Routes } from 'react-router';
import { lazy, Suspense, useEffect } from 'react';
import NavBar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import LogIn from './components/LogIn/LogIn';
import Profile from './components/Profile/Profile';
import Courses from './components/Courses/Courses';
import Register from './components/Register/Register';
import InstructorTasks from './components/InstructorTasks/InstructorTasks';
import About from './components/About/About';
import Toast from './components/Toast/Toast';
import AdminTasks from './components/AdminTasks/AdminTasks';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router';
import type { RootState } from './store/store';
import { setMessage } from './store/messageSlice';
import { setUser, setAdmin } from './store/userSlice';

const NewTask = lazy(() => import('./components/NewTask/NewTask'));

function App() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const navigationEntries =
      performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];

    if (navigationEntries[0]?.type === 'reload') {
      dispatch(setUser(null));
      dispatch(setAdmin(false));

      window.location.replace('/');
    }
  }, [dispatch]);

  const protect = (element: any) => {
    if (!currentUser) {
      setTimeout(() => {
        dispatch(setMessage({ text: 'עליך להתחבר תחילה', type: 'warning' }));
      }, 0);
      return <Navigate to="/logIn" replace />;
    }

    return element;
  };

  return (
    <div dir="rtl" className="container-fluid p-0">
      <NavBar />

      <Suspense fallback={<div>טוען...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />

          <Route path="/courses" element={protect(<Courses />)} />
          <Route path="/instructorTasks" element={protect(<InstructorTasks />)} />
          <Route path="/newTask" element={protect(<NewTask />)} />
          <Route path="/adminTasks" element={protect(<AdminTasks />)} />

          <Route path="/home" element={<Home />}>
            <Route path="profile" element={protect(<Profile />)} />
            <Route path="courses" element={protect(<Courses />)} />
            <Route path="instructorTasks" element={protect(<InstructorTasks />)} />
          </Route>
        </Routes>
      </Suspense>

      <Toast />
    </div>
  );
}

export default App;