/* eslint-disable react/prop-types */
import { useState } from "react";
// import { format } from "date-fns";

export const DateRangePicker = ({ onUpdate }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleChange = (type, value) => {
    if (type === "from") setFrom(value);
    else setTo(value);

    onUpdate({
      from: type === "from" ? value : from,
      to: type === "to" ? value : to,
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <label>From:</label>
      <input
        type="date"
        value={from}
        onChange={(e) => handleChange("from", e.target.value)}
        className="border p-1 rounded"
      />
      <label>To:</label>
      <input
        type="date"
        value={to}
        onChange={(e) => handleChange("to", e.target.value)}
        className="border p-1 rounded"
      />
    </div>
  );
};
