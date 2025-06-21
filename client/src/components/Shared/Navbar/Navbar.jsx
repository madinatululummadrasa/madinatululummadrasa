import { useState } from 'react';
import { FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Container from '../Container';
import useAuth from '../../../hooks/useAuth';

const menuItems = [
  {
    label: 'পরিচিতি',
    submenu: [
      { label: 'প্রতিষ্ঠান পরিচিতি', link: '/porichiti/protisthan' },
      { label: 'ইতিহাস', link: '/porichiti/itihash' },
      { label: 'নোটিশ আপলোড ', link: '/notice-upload' },
      { label: 'নোটিশ দেখুন', link: '/notice' },
      { label: 'Dashboard ', link: '/dashboard' },
      { label: 'Accounts Dashboard ', link: '/accounts-dashboard' },
      { label: 'স্কুল পরিচালকদের বানী ', link: '/speech' },

    ],
  },
  {
    label: 'জনবল',
    submenu: [
      { label: 'শিক্ষকবৃন্দ', link: '/teachers' },
      { label: 'কর্মকর্তা/কর্মচারী', link: '/jonobal/staff' },
      { label: 'Add Routine', link: '/routine-make' },
    ],
  },
  {
    label: 'শিক্ষার্থী',
    submenu: [
      { label: ' শিক্ষার্থী তালিকা ', link: '/student-list' },
      { label: 'ভর্তি তথ্য', link: '/students/admission' },
      { label: 'Add Students', link: '/add-student' },
      { label: 'Add Attendence', link: '/students/attendance' },
      { label: 'Update Student', link: '/update-student' },
    ],
  },
  {
    label: 'পরীক্ষার ফলাফল',
    submenu: [
      { label: 'Add Result', link: '/add-results' },
      { label: 'Admins Result', link: '/class-results' },
      { label: 'Result', link: '/results' },
      { label: 'পাবলিক পরীক্ষা', link: '/results/public' },
    ],
  },
];

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const { user, logOut } = useAuth();
  
  

  return (
    <Container>
      <nav className="bg-white font-bengali text-base shadow md:px-6 py-2 rounded-md z-50 mt-6">
        <div className="flex items-center justify-between">
          {/* Logo + Branding */}
          <div className="flex items-center space-x-3 font-bengali text-base leading-relaxed tracking-wide">
            <img src="/logom.jpg" alt="logo" className="w-16 h-16 object-contain" />
            <div>
              <h1 className="text-lg font-bold">মাদিনাতুল উলুম মাদরাসা</h1>
              <p className="text-xs text-gray-500 -mt-1">কুরআন শিক্ষার আলো</p>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-6 text-sm font-medium relative">
            <li>
              <Link to="/">
                <button className="bg-green-600 text-white px-4 py-1 rounded-full font-bengali text-base leading-relaxed tracking-wide">
                  মূলপাতা
                </button>
              </Link>
            </li>

            {menuItems.map((item, index) => (
              <li
                key={index}
                className="text-base leading-relaxed tracking-wide font-bengali relative group"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="cursor-pointer hover:text-green-600 flex items-center space-x-1">
                  <span>{item.label}</span>
                  <span className="transform transition-transform duration-200">▾</span>
                </button>

                {/* Dropdown */}
                <div
                  className={` absolute top-full left-1/2 -translate-x-1/2 mt-10 w-52 bg-white rounded-md shadow-md border transition-all duration-100 z-40
                    ${activeDropdown === index ? 'opacity-100 visible' : 'opacity-0 invisible'}
                  `}
                >
                  <div className="  absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-md z-[-1]" />

                  {item.submenu.map((sub, subIndex) => (
                    <Link to={sub.link} key={subIndex}>
                      <div className="px-8  py-2  hover:bg-green-50 hover:text-green-600 cursor-pointer text-base leading-relaxed tracking-wide font-bengali border-b last:border-b-0">
                        {sub.label}
                      </div>
                    </Link>
                  ))}
                </div>
              </li>
            ))}

            <li>
              <Link to="/gallery" className="cursor-pointer text-base leading-relaxed tracking-wide font-bengali hover:text-green-600">
                ছবীর গ্যালারী
              </Link>
            </li>
            <li>
              <Link to="/contact" className="cursor-pointer text-base leading-relaxed tracking-wide font-bengali hover:text-green-600">
                যোগাযোগ
              </Link>
            </li>
          </ul>

          {/* Login Button */}
          {/* User Profile or Login */}
          {user ? (
            <div className="relative group ml-4">
              <img
                src={user.photoURL || '/default-user.png'}
                alt="Profile"
                className="w-10 h-10 rounded-full border object-cover cursor-pointer"
              />

              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition duration-200">
                <div className="px-4 py-2 text-sm font-semibold text-gray-800 border-b">{user.displayName || user.email}</div>
                <button
                  onClick={logOut}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 text-sm"
                >
                  লগ আউট
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <button className="hidden md:flex items-center bg-green-500 text-white px-4 py-1 rounded-full space-x-2 font-bengali text-base leading-relaxed tracking-wide">
                <FaSignInAlt />
                <span>Login</span>
              </button>
            </Link>
          )}

        </div>

        {/* Mobile Menu Items */}
        {mobileMenuOpen && (
          <div className="md:hidden text-base leading-relaxed tracking-wide font-bengali mt-3 space-y-2">
            <Link to="/">
              <button className="w-full text-base leading-relaxed tracking-wide font-bengali bg-green-600 text-white px-4 py-2 rounded">
                মূলপাতা
              </button>
            </Link>
            {menuItems.map((item, index) => (
              <div key={index}>
                <p className="font-semibold text-base leading-relaxed tracking-wide font-bengali text-gray-700">{item.label}</p>
                <ul className="ml-4 text-base leading-relaxed tracking-wide font-bengali text-gray-600 space-y-1">
                  {item.submenu.map((sub, i) => (
                    <li key={i}>
                      <Link to={sub.link} className="hover:text-green-600 block">
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <Link to="/gallery" className="block font-semibold text-base leading-relaxed tracking-wide font-bengali text-gray-700">
              ছবীর গ্যালারী
            </Link>
            <Link to="/contact" className="block font-semibold text-base leading-relaxed tracking-wide font-bengali text-gray-700">
              যোগাযোগ
            </Link>

            <Link to="/login">
              <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded space-x-2 w-full mt-2 justify-center font-bengali text-base leading-relaxed tracking-wide">
                <FaSignInAlt />
                <span>Login</span>
              </button>
            </Link>
          </div>
        )}
      </nav>
    </Container>
  );
};

export default Navbar;
