// components/Sidebar.jsx
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaCog, FaClipboard,FaAward  } from 'react-icons/fa';
import { FaUserGear } from "react-icons/fa6";
import { GiTeacher,GiNotebook  } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { TiPin } from "react-icons/ti";
import { MdDashboard } from 'react-icons/md';
import './raju.css'




const menuItems = [
  {
    name: 'Dashboard',
    icon: <MdDashboard />,
    path: '/dashboard', // ✅ Correct
  },
  {
    name: 'Notice',
    icon: <TiPin />,
    submenu: [
      { label: 'All notice', path: '/dashboard/notice' },
      { label: 'Upload new notice ', path: '/dashboard/notice-upload' },
    ],
  },
  {
    name: 'Routine',
    icon: <FaClipboard />,
    submenu: [
      { label: 'Routine', path: '/dashboard/routine' },
      { label: 'Create new routine', path: '/dashboard/routine-make' },
    ],
  },
  {
    name: 'Teachers',
    icon: <GiTeacher />,
    submenu: [
      { label: 'All teachers', path: '/dashboard/teachers' },
      { label: 'Add new teacher', path: '/dashboard/add-teachers' },
    ],
  },
  {
    name: 'Students',
    icon: <PiStudentFill />,
    submenu: [
      { label: 'Students list', path: '/dashboard/student-list' },
      { label: 'Add new student', path: '/dashboard/routine-make' },
      { label: 'Update student', path: '/dashboard/routine-make' },
    ],
  },
  {
    name: 'Addendence',
    icon: <GiNotebook  />,
    submenu: [
      { label: 'All attendence', path: '/dashboard/attendence' },
      { label: 'Update attendence', path: '/dashboard/add-attendence' },

    ],
  },
  {
    name: 'Result management',
    icon: <FaAward />,
    submenu: [
      { label: 'Exams Result', path: '/dashboard/results' },
      { label: 'Update result(For Admin)', path: '/dashboard/class-results' },
      { label: 'Add result', path: '/dashboard/add-results' },

    ],
  },
  {
    name: 'Users',
    icon: <FaUserGear  />,
    submenu: [
      { label: 'Manage users', path: '/dashboard/users' },
      { label: 'Add new user', path: '/dashboard/users/add' },
    ],
  },

  {
    name: 'Settings',
    icon: <FaCog />,
    path: '/dashboard/settings', // ✅ Corrected
  },



];

const Sidebar = () => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  return (
    <div className="raju w-64  min-h-screen bg-[#1D2327] text-white p-3">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="relative group"
          onMouseEnter={() => !isMobile && setOpenSubmenu(index)}
          onMouseLeave={() => !isMobile && setOpenSubmenu(null)}
        >
          {/* ✅ Use NavLink if no submenu */}
          {item.submenu ? (
            <div
              className="flex items-center justify-between px-3 py-2 hover:bg-[#1A1E23] cursor-pointer"
              onClick={() => toggleSubmenu(index)}
            >
              <div className="flex items-center text-[#B0B8C0]  gap-4">
                <span className='text-xl'>{item.icon}</span>{/* change icon size from here */}
                <span className='text-white'>{item.name}</span>
              </div>

            </div>
          ) : (
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex  items-center gap-4 px-3 py-2 text-[#B0B8C0] hover:bg-gray-700 ${isActive ? 'bg-[#0073AA]' : ''}`
              }
            >
              <span className='text-xl'> {item.icon}</span>{/* change icon size from here */}
              <span className='text-white'>{item.name}</span>
            </NavLink>
          )}

          {/* Submenu */}
          {item.submenu && openSubmenu === index && (
            <div
              className={`bg-gray-800  ${isMobile ? 'block px-5' : 'absolute left-full top-0 min-w-[150px] z-50'
                }`}
            >
              {item.submenu.map((sub, idx) => (
                <NavLink
                  key={idx}
                  to={sub.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm text-white hover:bg-[#1A1E23] ${isActive ? 'bg-gray-700' : ''}`
                  }
                  onClick={() => isMobile && setOpenSubmenu(null)}
                >
                  {sub.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
