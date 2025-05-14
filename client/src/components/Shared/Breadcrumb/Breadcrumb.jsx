import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Label map (you can extend this)
  const decode = (segment) => {
    const map = {
      '': 'মূলপাতা',
      'home': 'মূলপাতা',
      'dashboard': 'ড্যাশবোর্ড',
      'notice-board': 'নোটিশ বোর্ড',
      'profile': 'প্রোফাইল',
      'settings': 'সেটিংস',
      // add more routes as needed
    };
    return map[segment] || segment;
  };

  return (
    <div className="text-center mt-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {decode(pathnames[pathnames.length - 1] || '')}
      </h2>
      <nav className="text-gray-500 text-sm flex justify-center items-center space-x-2">
        {/* First breadcrumb always goes to root */}
        <Link to="/" className="flex items-center space-x-1 hover:underline">
          <span>🏠</span>
          <span>{decode('')}</span> {/* dynamically get label for root */}
        </Link>

        {/* Loop through the rest of the path */}
        {pathnames.map((value, index) => {
          const to = '/' + pathnames.slice(0, index + 1).join('/');
          const isLast = index === pathnames.length - 1;

          return (
            <span key={to} className="flex items-center space-x-2">
              <span className="text-gray-400">›</span>
              {isLast ? (
                <span className="text-green-600 font-semibold">{decode(value)}</span>
              ) : (
                <Link to={to} className="hover:underline">
                  {decode(value)}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumb;
