import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { format } from "date-fns";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const defaultPeriods = 6;

const RoutineBuilder = () => {
  const axiosSecure = useAxiosSecure();
  const [routine, setRoutine] = useState({});
  const [periodTimes, setPeriodTimes] = useState(
    Array(defaultPeriods).fill({ start: "", end: "" })
  );

  const [teachers, setTeachers] = useState([]);

  const [allRoutines, setAllRoutines] = useState([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState(null);
  const [isNewRoutine, setIsNewRoutine] = useState(true);

  const [selectedCell, setSelectedCell] = useState(null);
  const [form, setForm] = useState({ subject: "", timeStart: "", timeEnd: "" });
  const [routineTitle, setRoutineTitle] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const { data } = await axiosSecure.get("/routines");
        setAllRoutines(data);
      } catch (err) {
        console.error("Failed to fetch routines:", err);
      }
    };
    fetchRoutines();
  }, [axiosSecure]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data } = await axiosSecure.get("/teachers");
        setTeachers(data.map(t => t.name));
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
        // fallback if needed
        setTeachers(["Mr. Ali", "Ms. Fatema", "Mr. Karim", "Ms. Rupa"]);
      }
    };
    fetchTeachers();
  }, [axiosSecure]);

  const openModal = (teacher, period) => {
    const key = `${teacher}-${period}`;
    const cell = routine[key];
    const fallbackStart = periodTimes[period]?.start || "";
    const fallbackEnd = periodTimes[period]?.end || "";

    setForm({
      subject: cell?.subject || "",
      timeStart: cell?.timeStart || fallbackStart,
      timeEnd: cell?.timeEnd || fallbackEnd,
    });

    setSelectedCell({ teacher, period });
  };

  const saveCell = () => {
    const key = `${selectedCell.teacher}-${selectedCell.period}`;
    setRoutine((prev) => ({ ...prev, [key]: form }));
    setSelectedCell(null);
  };

  const isCurrentClass = (start, end) => {
    if (!start || !end) return false;
    const now = format(currentTime, "HH:mm");
    return now >= start && now <= end;
  };

  const handleSaveRoutine = async () => {
    if (!routineTitle.trim()) {
      alert("Please enter a routine title.");
      return;
    }

    const formattedRoutine = {
      title: routineTitle,
      createdAt: new Date().toISOString(),
      periods: defaultPeriods,
      teachers,
      periodTimes,
      schedule: routine,
    };

    try {
      const { data } = await axiosSecure.post("/routines", formattedRoutine);
      alert("Routine saved successfully!");
      setIsNewRoutine(false);
      setSelectedRoutineId(data.insertedId);

      const { data: routines } = await axiosSecure.get("/routines");
      setAllRoutines(routines);
    } catch (err) {
      console.error(err);
      alert("Failed to save routine.");
    }
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <input
          type="text"
          placeholder="Routine Title (e.g. Class 9 Routine)"
          value={routineTitle}
          onChange={(e) => setRoutineTitle(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />
        <button
          onClick={handleSaveRoutine}
          className="bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          Save Routine
        </button>
      </div>

      <div className="flex gap-4 items-center mb-4 flex-wrap">
        <select
          className="p-2 border rounded"
          value={selectedRoutineId || ""}
          onChange={async (e) => {
            const id = e.target.value;
            if (!id) return;

            try {
              const { data } = await axiosSecure.get(`/routines/${id}`);
              setRoutineTitle(data.title);
              setRoutine(data.schedule);
              setPeriodTimes(data.periodTimes);
              setIsNewRoutine(false);
              setSelectedRoutineId(id);
            } catch (err) {
              console.error("Failed to load routine:", err);
            }
          }}
        >
          <option value="">Select a routine</option>
          {allRoutines.map((r) => (
            <option key={r._id} value={r._id}>
              {r.title}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setRoutine({});
            setRoutineTitle("");
            setPeriodTimes(Array(defaultPeriods).fill({ start: "", end: "" }));
            setSelectedRoutineId(null);
            setIsNewRoutine(true);
          }}
        >
          Create New Routine
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm md:text-base">
          <thead>
            <tr>
              <th className="border p-2">Teacher / Period</th>
              {Array.from({ length: defaultPeriods }, (_, i) => (
                <th key={i} className="border p-2">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">Period {i + 1}</span>
                    <div className="flex gap-1 mt-1">
                      <input
                        type="time"
                        className="text-xs w-20 p-1 border rounded text-center"
                        value={periodTimes[i]?.start || ""}
                        onChange={(e) => {
                          const newTimes = [...periodTimes];
                          newTimes[i] = { ...newTimes[i], start: e.target.value };
                          setPeriodTimes(newTimes);
                        }}
                      />
                      <span className="text-xs">-</span>
                      <input
                        type="time"
                        className="text-xs w-20 p-1 border rounded text-center"
                        value={periodTimes[i]?.end || ""}
                        onChange={(e) => {
                          const newTimes = [...periodTimes];
                          newTimes[i] = { ...newTimes[i], end: e.target.value };
                          setPeriodTimes(newTimes);
                        }}
                      />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher}>
                <td className="border p-2 font-semibold">{teacher}</td>
                {Array.from({ length: defaultPeriods }, (_, period) => {
                  const key = `${teacher}-${period}`;
                  const cell = routine[key];
                  const isCurrent =
                    cell?.timeStart &&
                    cell?.timeEnd &&
                    isCurrentClass(cell.timeStart, cell.timeEnd);

                  return (
                    <td
                      key={period}
                      className={`border p-2 text-center cursor-pointer ${isCurrent ? "bg-yellow-100" : "hover:bg-gray-100"}`}
                      onClick={() => openModal(teacher, period)}
                    >
                      {cell ? (
                        <div className="space-y-1">
                          <div className="font-medium">{cell.subject}</div>
                          <div className="text-xs text-gray-600">
                            {cell.timeStart} - {cell.timeEnd}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">+</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={!!selectedCell}
        onClose={() => setSelectedCell(null)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <Dialog.Panel className="bg-white p-4 rounded shadow-md max-w-sm w-full">
          <Dialog.Title className="text-lg font-semibold mb-2">Edit Slot</Dialog.Title>

          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full mb-3 p-2 border rounded"
          />

          <div className="flex justify-between gap-2 mb-4">
            <div className="flex-1">
              <label className="block text-xs mb-1 text-gray-600">Start</label>
              <input
                type="time"
                value={form.timeStart}
                onChange={(e) => setForm({ ...form, timeStart: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs mb-1 text-gray-600">End</label>
              <input
                type="time"
                value={form.timeEnd}
                onChange={(e) => setForm({ ...form, timeEnd: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setSelectedCell(null)}
              className="px-4 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={saveCell}
              className="px-4 py-1 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default RoutineBuilder;
