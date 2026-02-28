import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login/Login.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';

// Employee Pages
import EmployeeHome from './Pages/employee/EmployeeHome/EmployeeHome.jsx';
import Attendance from './Pages/employee/Attendance/Attendance.jsx';
import Todo from './Pages/employee/Todo/Todo.jsx';
import DailyActivity from './Pages/employee/DailyActivity/DailyActivity.jsx';
import Directory from './Pages/employee/Directory/Directory.jsx';
import Profile from './Pages/employee/Profile/Profile.jsx';
import Leave from './Pages/employee/Leave/Leave.jsx';
import Notices from './Pages/employee/Notices/Notices.jsx';

// CEO Pages
import CEOHome from './Pages/ceo/CEOHome/CEOHome.jsx';
import UserManagement from './Pages/ceo/UserManagement/UserManagement.jsx';
import MonitoringOverview from './Pages/ceo/MonitoringOverview/MonitoringOverview.jsx';
import ActivityMonitoring from './Pages/ceo/ActivityMonitoring/ActivityMonitoring.jsx';
import TodoMonitoring from './Pages/ceo/TodoMonitoring/TodoMonitoring.jsx';
import AttendanceMonitoring from './Pages/ceo/AttendanceMonitoring/AttendanceMonitoring.jsx';
import NoticeManagement from './Pages/ceo/NoticeManagement/NoticeManagement.jsx';

// HR Pages
import HRHome from './Pages/hr/HRHome/HRHome.jsx';
import HRAttendance from './Pages/hr/Attendance/Attendance.jsx';
import HRTodo from './Pages/hr/Todo/Todo.jsx';
import HRDailyActivity from './Pages/hr/DailyActivity/DailyActivity.jsx';
import HRLeaveRequest from './Pages/hr/LeaveRequest/LeaveRequest.jsx';
import HRNoticeManagement from './Pages/hr/NoticeManagement/NoticeManagement.jsx';
import HRUserManagement from './Pages/hr/UserManagement/UserManagement.jsx';

// Shared Pages
import ProjectsList from './Pages/shared/Projects/ProjectsList.jsx';
import ProjectBoard from './Pages/shared/Projects/ProjectBoard.jsx';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* CEO Routes */}
        <Route
          path="/dashboard/ceo"
          element={
            <PrivateRoute allowedRoles={['ceo']}>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<CEOHome />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="notices-manage" element={<NoticeManagement />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/:id" element={<ProjectBoard />} />
          <Route path="leave" element={<Leave />} />
          <Route path="directory" element={<Directory />} />
          <Route path="monitoring" element={<MonitoringOverview />} />
          <Route path="monitoring/activities" element={<ActivityMonitoring />} />
          <Route path="monitoring/todos" element={<TodoMonitoring />} />
          <Route path="monitoring/attendance" element={<AttendanceMonitoring />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* HR Routes */}
        <Route
          path="/dashboard/hr"
          element={
            <PrivateRoute allowedRoles={['hr']}>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<HRHome />} />
          <Route path="attendance" element={<HRAttendance />} />
          <Route path="todo" element={<HRTodo />} />
          <Route path="activity" element={<HRDailyActivity />} />
          <Route path="leave-request" element={<HRLeaveRequest />} />
          <Route path="notices-manage" element={<HRNoticeManagement />} />
          <Route path="users" element={<HRUserManagement />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/:id" element={<ProjectBoard />} />
          <Route path="leave" element={<Leave />} />
          <Route path="directory" element={<Directory />} />
          <Route path="monitoring" element={<MonitoringOverview />} />
          <Route path="monitoring/activities" element={<ActivityMonitoring />} />
          <Route path="monitoring/todos" element={<TodoMonitoring />} />
          <Route path="monitoring/attendance" element={<AttendanceMonitoring />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Employee Routes */}
        <Route
          path="/dashboard/employee"
          element={
            <PrivateRoute allowedRoles={['employee']}>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<EmployeeHome />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="todo" element={<Todo />} />
          <Route path="activity" element={<DailyActivity />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/:id" element={<ProjectBoard />} />
          <Route path="leave" element={<Leave />} />
          <Route path="notices" element={<Notices />} />
          <Route path="directory" element={<Directory />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
