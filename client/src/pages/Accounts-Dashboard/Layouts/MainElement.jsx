
// Define the data for your icons, text, and now links!
const iconData = [
  { id: 1, icon: 'https://i.ibb.co/Q7KXQYdF/class.png', text: 'ক্লাস তৈরি', link: 'accounts-dashboard/create-class' },
  { id: 2, icon: 'https://i.ibb.co/KpdNGjdP/students.png', text: 'ছাত্র-ছাত্রী', link: 'accounts-dashboard/students' },
  { id: 3, icon: 'https://i.ibb.co/CpTjtbF5/member.png', text: 'সদস্য', link: 'accounts-dashboard/members' },
  { id: 4, icon: 'https://i.ibb.co/8LkJQfxK/collection.png', text: 'কালেকশন', link: 'accounts-dashboard/add-new-collection-entry' },
  { id: 5, icon: 'https://i.ibb.co/fGvLNXKK/collectionreport.png', text: 'কালেকশন রিপোর্ট', link: '#collection-report' },
  { id: 6, icon: 'https://i.ibb.co/Z6cptFwH/studentsfeecollection.png', text: 'ছাত্র-ছাত্রীর কালেকশন', link: '#student-collection' },
  { id: 7, icon: 'https://i.ibb.co/TDm5zFNy/memberfeecollection.png', text: 'সদস্যের কালেকশন', link: '#member-collection' },
  { id: 8, icon: 'https://i.ibb.co/8DM70m4R/salarydue.png', text: 'বেতনের বাকি রিপোর্ট', link: '#salary-due-report' },
  { id: 9, icon: 'https://i.ibb.co/60hZjGww/cost.png', text: 'খরচের খাত', link: 'accounts-dashboard/expense-category' },
  { id: 10, icon: 'https://i.ibb.co/d0HBsHZK/incometype.png', text: 'কালেকশনের খাত', link: 'accounts-dashboard/collection-category' },
  { id: 11, icon: 'https://i.ibb.co/4nWXDjLG/cashreport.png', text: 'ক্যাশ রিপোর্ট', link: '#cash-report' },
  { id: 12, icon: 'https://i.ibb.co/hRwB7RKW/incomeexpense.png', text: 'আয়-ব্যয়', link: '#income-expense' },
  { id: 13, icon: 'https://i.ibb.co/qLrwY0Sq/otherscashmoney.png', text: 'অন্যান্য নগদ জমা', link: '#other-cash-deposit' },
  { id: 14, icon: 'https://i.ibb.co/1fjQPgz1/othersincomeexpense.png', text: 'অন্যান্য আয়-ব্যয়', link: '#other-income-expense' },
  { id: 15, icon: 'https://i.ibb.co/23SC1CL0/loan.png', text: 'ঋণ', link: '#loan' },
  { id: 16, icon: 'https://i.ibb.co/TDm5zFNy/memberfeecollection.png', text: 'ব্যাংক', link: '#bank' },
  { id: 17, icon: 'https://i.ibb.co/GQd59L1k/borrow.png', text: 'কর্জ প্রদান', link: '#loan-given' },
  { id: 18, icon: 'https://i.ibb.co/V0tm91Mp/ownertransaction.png', text: 'মালিকের লেনদেন', link: '#owner-transaction' },
  { id: 19, icon: 'https://i.ibb.co/MyB10CVm/costreport.png', text: 'খরচের রিপোর্ট', link: '#expense-report' },
  { id: 20, icon: 'https://i.ibb.co/DfRG6pyt/salaryreport.png', text: 'বেতনের রিপোর্ট', link: '#salary-report' },
  { id: 21, icon: 'https://i.ibb.co/6JJ27bc1/studentpresent.png', text: 'ছাত্র-ছাত্রীর উপস্থিতি', link: '#student-attendance' },
  { id: 22, icon: 'https://i.ibb.co/TBCqYv11/staffpresent.png', text: 'স্টাফদের উপস্থিতি', link: '#staff-attendance' },
  { id: 23, icon: 'https://i.ibb.co/FLPvy5tH/worker.png', text: 'স্টাফ', link: '#staff' },
  { id: 24, icon: 'https://i.ibb.co/4whN0NHD/money.png', text: 'শুরুর টাকা', link: '#opening-balance' },
  { id: 25, icon: 'https://i.ibb.co/4whN0NHD/money.png', text: 'class fee set', link: 'accounts-dashboard/setclassfee' },
];

const MainElement = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 font-inter">
      {/* Header Section */}
      <header className="mb-8 text-center">
        <p className="text-gray-600 text-sm mb-4">আজ শনিবার, জুন ২১, ২০২৫ সাল</p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button className="bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600 transition-colors">
            গ্রাফ রিপোর্ট দেখুন
          </button>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition-colors">
            সার্ভিসের জন্য অনুরোধ করুন
          </button>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">হিসাব ব্যবস্থাপনা</h1>
      </header>

      {/* Icon Grid Section */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
        {iconData.map((item) => (
          // Wrapped the div with an <a> tag and added href
          <a
            key={item.id}
            href={item.link} // Use the link from the item data
            className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer no-underline text-inherit" // Added no-underline and text-inherit for styling
          >
            {/* You can replace this img with an SVG or a FontAwesome icon component later */}
            <img src={item.icon}  className="w-14 h-14 mb-2 " />
            <p className="text-center text-sm font-medium text-gray-700">{item.text}</p>
          </a>
        ))}
      </section>
    </div>
  );
};

export default MainElement;
