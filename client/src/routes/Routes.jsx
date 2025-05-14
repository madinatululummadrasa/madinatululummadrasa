import { createBrowserRouter } from 'react-router-dom'
import Main from '../layouts/Main'
import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import NoticePage from '../pages/Notice/NoticePage'
import NoticeDetails from '../pages/Notice/Component/NoticeDetails'
import NoticeUploadPage from '../pages/Notice/NoticeUploadPage'
import StudentListPage from '../pages/StudentListPage/StudentListPage'
import AddStudentPage from '../pages/AddStudentPage/AddStudentPage'
import StudentDetailsPage from '../pages/StudentListPage/StudentDetailsPage'
import AddAttendancePage from '../pages/AddAttendancePage/AddAttendancePage'
import AddResultPage from '../pages/AddResultPage/AddResultPage'
import ClassResultPage from '../pages/ClassResultPAge/ClassResultPage'
import RoutineBuilder from '../pages/Routine/RoutineBuilder'
import TeachersDetailsPage from '../pages/Teachers/TeachersDetails/TeachersDetailsPage'
import AddNewThings from '../pages/Dashboard/AddNewThings'
import AddTeachersPage from '../pages/Teachers/AddTeachersPage/AddTeachersPage'
import TeachersList from '../pages/Teachers/TeachersList/TeachersList'
import Speech from '../pages/Speech/Speech'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/notice',
        element: <NoticePage></NoticePage>,
      },
      {
        path: '/notice-details/:id',
        element: <NoticeDetails></NoticeDetails>,
      },
      {
        path: '/notice-upload',
        element: <NoticeUploadPage></NoticeUploadPage>,
      },
      {
        path: '/student-list',
        element: <StudentListPage/>,
      },
      {
        path: '/add-student',
        element: <AddStudentPage></AddStudentPage>,
      },
      {
        path: '/students/:studentId',
        element: <StudentDetailsPage></StudentDetailsPage>,
      },
  
      {
        path: '/students/attendance/:studentId',
        element: <AddAttendancePage></AddAttendancePage>,
      },
      {
        path: '/students/attendance',
        element: <AddAttendancePage></AddAttendancePage>,
      },
      {
        path: '/add-results',
        element: <AddResultPage/>,
      },
  
      {
        path: '/class-results',
        element: <ClassResultPage/>,
      },
  
      {
        path: '/routine-make',
        element:<RoutineBuilder></RoutineBuilder>,
      },
      {
        path: '/jonobal/teachers-details/:teachersId',
        element:<TeachersDetailsPage/>,
      },
      {
        path: '/teachers',
        element:<TeachersList></TeachersList>,
      },
      {
        path: 'add-new-things',
        element:<AddNewThings></AddNewThings>,
      },
      {
        path: 'add-teachers',
        element:<AddTeachersPage/>,
      },
  
      {
        path: '/speech',
        element:<Speech/>,
      },
  
  
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
])
