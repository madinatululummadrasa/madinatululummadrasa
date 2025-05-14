// components/filters/StudentFilterBar.jsx
/* eslint-disable react/prop-types */

const StudentFilterBar = ({
  selectedYear,
  setSelectedYear,
  selectedClass,
  setSelectedClass,
  searchRoll,
  setSearchRoll,
}) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 mb-4 items-center justify-start">
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="border px-3 py-2 rounded text-sm"
      >
        <option value="">সব বছর</option>
      
        <option value="2025">2025</option>
        <option value="2026">2026</option>
        <option value="2027">2027</option>
        <option value="2027">2028</option>
        <option value="2027">2029</option>
        <option value="2027">2030</option>
      </select>

      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="border px-3 py-2 rounded text-sm"
      > 
        <option value="">সব ক্লাস</option>
        <option value="শিশু">শিশু</option>
        <option value="প্রথম"> প্রথম</option>
        <option value="দ্বিতীয়"> দ্বিতীয়</option>
        <option value="তৃতীয়"> তৃতীয় </option>
        <option value="চতুর্থ"> চতুর্থ </option>
        <option value="পঞ্চম"> পঞ্চম</option>
        <option value="হেফজ"> হেফজ</option>
      </select>

      <input
        type="number"
        value={searchRoll}
        onChange={(e) => setSearchRoll(e.target.value)}
        placeholder="রোল"
        className="border px-3 py-2 rounded text-sm"
      />
    </div>
  );
};

export default StudentFilterBar;
