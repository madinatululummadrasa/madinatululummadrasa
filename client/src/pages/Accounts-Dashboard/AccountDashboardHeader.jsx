import {
  FaWordpressSimple,
  FaEdit,
  FaComment,
  FaPlus,
  FaRocket,
  FaEye,
  FaQuestionCircle,
  FaBell,
  FaUserCircle,
  FaChevronDown
} from 'react-icons/fa';

const AccountDashboardHeader = () => {
  return (
    <div className="bg-black text-white px-4 py-2 flex justify-between items-center text-sm">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <FaWordpressSimple className="text-xl" />
        <span className="hover:underline cursor-pointer">Site Title</span>
        <div className="flex items-center gap-1 hover:underline cursor-pointer">
          <FaEdit className="text-xs" />
          <span>Edit Site</span>
        </div>
        <div className="flex items-center gap-1 hover:underline cursor-pointer">
          <FaComment className="text-xs" />
          <span>0</span>
        </div>
        <div className="flex items-center gap-1 hover:underline cursor-pointer">
          <FaPlus className="text-xs" />
          <span>New</span>
        </div>
        <button className="bg-[#0073aa] hover:bg-[#006799] px-3 py-1 rounded text-white font-semibold flex items-center gap-1 text-xs">
          <FaRocket /> Launch site
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <FaEye className="text-lg cursor-pointer hover:text-gray-400" title="Reader" />
        <FaQuestionCircle className="text-lg cursor-pointer hover:text-gray-400" title="Help" />
        <FaBell className="text-lg cursor-pointer hover:text-gray-400" title="Notifications" />
        
        {/* User Dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-1 cursor-pointer">
            <span>Howdy, Madinatul Ulum</span>
            <FaUserCircle className="text-lg" />
            <FaChevronDown className="text-xs" />
          </div>
          {/* Future dropdown can be added here */}
        </div>
      </div>
    </div>
  );
};

export default AccountDashboardHeader;
