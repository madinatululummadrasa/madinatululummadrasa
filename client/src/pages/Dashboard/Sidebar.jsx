// components/Sidebar.jsx
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaCog, FaChevronDown } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const menuItems = [
  {
    name: 'Dashboard',
    icon: <MdDashboard />,
    path: '/dashboard', // ✅ Correct
  },
  {
    name: 'Users',
    icon: <FaUser />,
    submenu: [
      { label: 'All Users', path: '/dashboard/users' },
      { label: 'Add User', path: '/dashboard/users/add' },
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
    <div className="w-64 min-h-screen bg-gray-900 text-white p-3">
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
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => toggleSubmenu(index)}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.name}</span>
              </div>
              <FaChevronDown className="text-xs" />
            </div>
          ) : (
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          )}

          {/* Submenu */}
          {item.submenu && openSubmenu === index && (
            <div
              className={`bg-gray-800 ${
                isMobile ? 'block px-5' : 'absolute left-full top-0 min-w-[150px] z-50'
              }`}
            >
              {item.submenu.map((sub, idx) => (
                <NavLink
                  key={idx}
                  to={sub.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm hover:bg-gray-600 ${isActive ? 'bg-gray-700' : ''}`
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
