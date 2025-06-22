/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const SearchFilter = ({ data = [], searchBy = [], onFiltered, placeholder = "Search..." }) => {
    const [query, setQuery] = useState("");
useEffect(() => {
    const filtered = data.filter((item) =>
        searchBy.some((key) =>
            item[key]?.toString().toLowerCase().includes(query.toLowerCase())
        )
    );
    onFiltered(filtered);
}, [query, data, searchBy, onFiltered]); // ✅ fixed

    return (
        <div className="mb-4">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="border p-2 w-full rounded"
            />
        </div>
    );
};

export default SearchFilter;
