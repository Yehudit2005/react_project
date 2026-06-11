// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.scss';
// import { Route, Routes, useNavigate } from 'react-router';
// import { useEffect } from 'react';
// import Home from './components/Home/Home';
// import LogIn from './components/LogIn/LogIn';
// import Profile from './components/Profile/Profile';
// import Courses from './components/Courses/Courses';
// import NewTask from './components/NewTask/NewTask';
// import Register from './components/Register/Register';
// import InstructorTasks from './components/InstructorTasks/InstructorTasks';
// // import NotFound from './components/NotFound/NotFound';

// function App() {
//   const nav = useNavigate();

//   useEffect(() => {
//     nav('/logIn');
//   }, []);

//   return (
//     <div dir="rtl" className="row">
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/logIn" element={<LogIn />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/home" element={<Home />}>
//           <Route path="profile" element={<Profile />} />
//           <Route path="courses" element={<Courses />} />
//           <Route path="newTask" element={<NewTask />} />
//           <Route path="instructorTasks" element={<InstructorTasks />} />
//         </Route>
//       </Routes>
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
import About from './components/About/About'; // וודא שהקובץ קיים

function App() {
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
        
        {/* אזור אישי עם Layout */}
        <Route path="/home" element={<Home />}>
          <Route path="profile" element={<Profile />} />
          <Route path="courses" element={<Courses />} />
          <Route path="newTask" element={<NewTask />} />
          <Route path="instructorTasks" element={<InstructorTasks />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;