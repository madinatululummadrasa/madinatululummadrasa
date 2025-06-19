import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './component/DashboardHeader';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-segoe">
      {/* Header */}
      <DashboardHeader />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1E1E1E] text-white hidden md:block">
          <Sidebar />
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
