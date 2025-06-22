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

import AddTeachersPage from '../pages/Teachers/AddTeachersPage/AddTeachersPage'
import TeachersList from '../pages/Teachers/TeachersList/TeachersList'
import Speech from '../pages/Speech/Speech'
import Results from '../pages/ClassResultPAge/Results'
import UpdateStudentData from '../pages/UpdateStudentData/UpdateStudentData'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'

import Overview from '../pages/Dashboard/Admin/Overview'
import DashboardLayout from '../pages/Dashboard/DashboardLayout'
import ManageUsers from '../pages/Dashboard/Admin/user/ManageUsers'
import AddNewUser from '../pages/Dashboard/Admin/user/AddNewUser'
import NoticeTable from '../pages/Notice/Component/NoticeTable'


import CreateClass from '../pages/Accounts-Dashboard/Components/class/CreateClass'
import AccountDashboardLayout from '../pages/Accounts-Dashboard/Layouts/AccountDashboardLayout'
import MainElement from '../pages/Accounts-Dashboard/Layouts/MainElement'
import ShowAllClass from '../pages/Accounts-Dashboard/Components/class/ShowAllClass'
import Students from '../pages/Accounts-Dashboard/students/Students'




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
        element: <AdminRoute><ClassResultPage /></AdminRoute>,
      },

      {
        path: '/routine-make',
        element: <RoutineBuilder />,
      },
      {
        path: '/jonobal/teachers-details/:teachersId',
        element: <PrivateRoute><TeachersDetailsPage /></PrivateRoute>,
      },
      {
        path: '/teachers',
        element: <PrivateRoute><TeachersList /></PrivateRoute>,
      },
      {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
          { index: true, element: <Overview /> }, // 
          { path: 'users', element: <ManageUsers></ManageUsers> },
          { path: 'users/add', element: <AddNewUser /> },
          { path: 'notice-upload', element: <NoticeUploadPage></NoticeUploadPage> },
          { path: 'notice', element: <NoticeTable></NoticeTable> },
          { path: 'teachers', element: <TeachersList></TeachersList> },
          { path: 'add-teachers', element: <AddTeachersPage></AddTeachersPage> },
          { path: 'routine-make', element: <RoutineBuilder /> },
          { path: 'add-attendence', element: <AddAttendancePage /> },
          { path: 'student-list', element: <StudentListPage /> },
          { path: "students/:studentId", element: <StudentDetailsPage /> },
          { path: "jonobal/teachers-details/:teachersId", element: <TeachersDetailsPage /> },
          { path: "results", element: <Results /> },
          { path: "class-results", element: <ClassResultPage /> },
          { path: "add-results", element: <AddResultPage /> },
          { path: 'settings', element: <Speech /> },

        ],
      },
      {
        path: '/accounts-dashboard',
        element: <PrivateRoute><AccountDashboardLayout /></PrivateRoute>,
        children: [
          { index: true, element: <MainElement></MainElement> }, // 
          { path: 'create-class', element: <CreateClass></CreateClass> },
          { path: 'all-class', element: <ShowAllClass/> },
          { path: 'students', element: <Students/> },
        ],
      },
      {
        path: 'add-teachers', // Relative path within Main
        element: <PrivateRoute><AddTeachersPage /></PrivateRoute>,
      },

      {
        path: '/speech',
        element: <PrivateRoute><Speech /></PrivateRoute>,
      },
      {
        path: '/results',
        element: <PrivateRoute><Results /></PrivateRoute>,
      },
      {
        path: '/update-student',
        element: <PrivateRoute><UpdateStudentData /></PrivateRoute>,
      },
    ],
  },
  // The login route should NOT be wrapped by PrivateRoute, as it's the destination for unauthenticated users
  { path: '/login', element: <Login /> },

]);