import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';

// Employee Pages
import EmployeeHome from './pages/employee/EmployeeHome/EmployeeHome.jsx';
import Attendance from './pages/employee/Attendance/Attendance.jsx';
import Todo from './pages/employee/Todo/Todo.jsx';
import DailyActivity from './pages/employee/DailyActivity/DailyActivity.jsx';
import Directory from './pages/employee/Directory/Directory.jsx';
import Profile from './pages/employee/Profile/Profile.jsx';
import Leave from './pages/employee/Leave/Leave.jsx';
import Notices from './pages/employee/Notices/Notices.jsx';

// CEO Pages
import CEOHome from './pages/ceo/CEOHome/CEOHome.jsx';
import UserManagement from './pages/ceo/UserManagement/UserManagement.jsx';
import MonitoringOverview from './pages/ceo/MonitoringOverview/MonitoringOverview.jsx';
import ActivityMonitoring from './pages/ceo/ActivityMonitoring/ActivityMonitoring.jsx';
import TodoMonitoring from './pages/ceo/TodoMonitoring/TodoMonitoring.jsx';
import AttendanceMonitoring from './pages/ceo/AttendanceMonitoring/AttendanceMonitoring.jsx';
import NoticeManagement from './pages/ceo/NoticeManagement/NoticeManagement.jsx';

// HR Pages
import HRHome from './pages/hr/HRHome/HRHome.jsx';
import HRAttendance from './pages/hr/Attendance/Attendance.jsx';
import HRTodo from './pages/hr/Todo/Todo.jsx';
import HRDailyActivity from './pages/hr/DailyActivity/DailyActivity.jsx';
import HRLeaveRequest from './pages/hr/LeaveRequest/LeaveRequest.jsx';
import HRNoticeManagement from './pages/hr/NoticeManagement/NoticeManagement.jsx';
import HRUserManagement from './Pages/hr/UserManagement/UserManagement.jsx';

// Shared Pages
import ProjectsList from './pages/shared/Projects/ProjectsList.jsx';
import ProjectBoard from './pages/shared/Projects/ProjectBoard.jsx';

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
