// TeacherRoutineView.jsx (with Firebase)
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { db } from "../../firebase/firebase.config"; // assumes firebase.js exports initialized Firestore as 'db'
import { doc, getDoc, setDoc } from "firebase/firestore";

const teachers = ["Teacher 1", "Teacher 2"];
const periods = [
  { label: "1st period", time: "09:00 - 09:20" },
  { label: "2nd period", time: "09:20 - 09:40" },
  { label: "3rd period", time: "09:40 - 10:00" },
  { label: "4th period", time: "10:00 - 10:20" },
  { label: "5th period", time: "10:20 - 10:40" },
  { label: "6th period", time: "10:40 - 11:00" },
];

const routineId = "routine_teacher_view"; // could be dynamic per class/year

const TeacherRoutineView = () => {
  const [routine, setRoutine] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [form, setForm] = useState({ subject: "" });

  useEffect(() => {
    const loadRoutine = async () => {
      const ref = doc(db, "routines", routineId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setRoutine(data?.data || {});
      }
    };
    loadRoutine();
  }, []);

  const openModal = (teacher, periodIdx) => {
    const key = `${teacher}-${periodIdx}`;
    const data = routine[key] || { subject: "" };
    setSelectedCell({ teacher, periodIdx });
    setForm(data);
  };

  const saveCell = async () => {
    const key = `${selectedCell.teacher}-${selectedCell.periodIdx}`;
    const updatedRoutine = { ...routine, [key]: form };
    setRoutine(updatedRoutine);
    setSelectedCell(null);
    const ref = doc(db, "routines", routineId);
    await setDoc(ref, {
      class: "Shared",
      periods,
      data: updatedRoutine,
      lastUpdated: new Date()
    });
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <div className="overflow-x-auto">
        <table className="w-full text-sm md:text-base border">
          <thead>
            <tr>
              <th className="border p-2">Time</th>
              {periods.map((period, idx) => (
                <th key={idx} className="border p-2 text-center">
                  <div>{period.label}</div>
                  <div className="text-xs text-gray-500">{period.time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, tIdx) => (
              <tr key={tIdx}>
                <td className="border p-2 font-semibold whitespace-nowrap">{teacher}</td>
                {periods.map((_, pIdx) => {
                  const key = `${teacher}-${pIdx}`;
                  const cell = routine[key];
                  return (
                    <td
                      key={pIdx}
                      className="border p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => openModal(teacher, pIdx)}
                    >
                      {cell?.subject || <span className="text-gray-400">+</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedCell} onClose={() => setSelectedCell(null)} className="fixed inset-0 z-50 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-4 rounded shadow-md max-w-sm w-full">
          <Dialog.Title className="text-lg font-semibold mb-2">Edit Subject</Dialog.Title>
          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ subject: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setSelectedCell(null)} className="px-4 py-1 bg-gray-300 rounded">Cancel</button>
            <button onClick={saveCell} className="px-4 py-1 bg-blue-600 text-white rounded">Save</button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default TeacherRoutineView;
