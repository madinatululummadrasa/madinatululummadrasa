import { createBrowserRouter } from 'react-router-dom'
import Main from '../layouts/Main'
import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'

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
import Results from '../pages/ClassResultPAge/Results'
import UpdateStudentData from '../pages/UpdateStudentData/UpdateStudentData'
import PrivateRoute from './PrivateRoute'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        // Wrap your Home component (and any other default protected routes) with PrivateRoute
        element: <Home />
      },
      {
        path: '/notice',
        element: <NoticePage />,
      },
      {
        path: '/notice-details/:id',
        element: <NoticeDetails />,
      },
      {
        path: '/notice-upload',
        element: <PrivateRoute><NoticeUploadPage /></PrivateRoute>,
      },
      {
        path: '/student-list',
        element: <StudentListPage />,
      },
      {
        path: '/add-student',
        element: <PrivateRoute><AddStudentPage /></PrivateRoute>,
      },
      {
        path: '/students/:studentId',
        element: <StudentDetailsPage />,
      },

      {
        path: '/students/attendance/:studentId',
        element: <PrivateRoute><AddAttendancePage /></PrivateRoute>,
      },
      {
        path: '/students/attendance',
        element: <PrivateRoute><AddAttendancePage /></PrivateRoute>,
      },
      {
        path: '/add-results',
        element: <PrivateRoute><AddResultPage /></PrivateRoute>,
      },

      {
        path: '/class-results',
        element: <PrivateRoute><ClassResultPage /></PrivateRoute>,
      },

      {
        path: '/routine-make',
        element:<RoutineBuilder />,
      },
      {
        path: '/jonobal/teachers-details/:teachersId',
        element:<PrivateRoute><TeachersDetailsPage /></PrivateRoute>,
      },
      {
        path: '/teachers',
        element:<PrivateRoute><TeachersList /></PrivateRoute>,
      },
      {
        path: 'add-new-things', // Relative path within Main
        element:<PrivateRoute><AddNewThings /></PrivateRoute>,
      },
      {
        path: 'add-teachers', // Relative path within Main
        element:<PrivateRoute><AddTeachersPage /></PrivateRoute>,
      },

      {
        path: '/speech',
        element:<PrivateRoute><Speech /></PrivateRoute>,
      },
      {
        path: '/results',
        element:<PrivateRoute><Results /></PrivateRoute>,
      },
      {
        path: '/update-student',
        element:<PrivateRoute><UpdateStudentData /></PrivateRoute>,
      },
    ],
  },
  // The login route should NOT be wrapped by PrivateRoute, as it's the destination for unauthenticated users
  { path: '/login', element: <Login /> },

]);