import { Outlet } from 'react-router-dom';
import AccountDashboardHeader from './AccountDashboardHeader';
import AccountSidebar from './AccountSidebar';
import Breadcrumbs from './Components/Breadcrumb/Breadcrumb';


const AccountDashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-segoe">
      {/* Header */}
      <AccountDashboardHeader />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1E1E1E] text-white hidden md:block">
          <AccountSidebar />
        </aside>

        {/* Main panel */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="p-4 max-w-7xl mx-auto">
            <Breadcrumbs></Breadcrumbs>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountDashboardLayout;
