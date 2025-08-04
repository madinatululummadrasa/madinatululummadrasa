/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
import  { useState, useMemo, useCallback } from "react";
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
} from "@mui/material";

// Helper to filter by date range
const isWithinDateRange = (dateStr, start, end) => {
  if (!dateStr) return true; // If dateField is null or empty, it always matches
  const date = new Date(dateStr);
  if (start && new Date(start) > date) return false;
  if (end && new Date(end) < date) return false;
  return true;
};

const DynamicFilterTable = ({
  data,
  dateField = null, // e.g., 'orderDate', 'createdAt'
  includeKeys = null, // e.g., ['category', 'status']
  excludeKeys = [], // e.g., ['id', 'description']
}) => {
  // Unified state for all filters
  const [filterState, setFilterState] = useState({
    columnFilters: {}, // Stores filters for dynamic columns
    dateRange: { from: "", to: "" }, // Stores date range
    // Add other filter types here later (e.g., searchTerm, sort)
  });

  // Determine filterable keys
  const filterKeys = useMemo(() => {
    if (!data || data.length === 0) return [];
    const allKeys = Object.keys(data[0]);

    let keys = includeKeys
      ? allKeys.filter((key) => includeKeys.includes(key))
      : allKeys.filter((key) => typeof data[0][key] === "string" || typeof data[0][key] === "number"); // Include numbers for filtering if not specified

    // Remove unwanted keys and the dateField itself from column filters
    if (excludeKeys.length > 0) {
      keys = keys.filter((key) => !excludeKeys.includes(key));
    }
    if (dateField) {
      keys = keys.filter((key) => key !== dateField);
    }

    return keys;
  }, [data, includeKeys, excludeKeys, dateField]);

  // Memoize options for each filter key to avoid re-calculation
  const getFilterOptions = useCallback((key) => {
    const options = new Set(data.map((item) => item[key]).filter(Boolean));
    return Array.from(options);
  }, [data]);

  // Handler for all filter changes (column filters and date range)
  const handleFilterChange = useCallback((type, key, value) => {
    setFilterState((prevState) => {
      if (type === "column") {
        return {
          ...prevState,
          columnFilters: {
            ...prevState.columnFilters,
            [key]: value,
          },
        };
      } else if (type === "date") {
        return {
          ...prevState,
          dateRange: {
            ...prevState.dateRange,
            [key]: value,
          },
        };
      }
      return prevState;
    });
  }, []);

  // Handler to clear all filters
  const handleClearFilters = useCallback(() => {
    setFilterState({
      columnFilters: {},
      dateRange: { from: "", to: "" },
    });
  }, []);

  // Filter the data based on current filterState
  const filteredData = useMemo(() => {
    const { columnFilters, dateRange } = filterState;
    return data.filter((item) => {
      // Check column filters
      const matchColumnFilters = Object.entries(columnFilters).every(
        ([key, value]) => !value || String(item[key]) === String(value) // Convert to string for consistent comparison
      );

      // Check date range filter
      const matchDate =
        dateField && item[dateField]
          ? isWithinDateRange(item[dateField], dateRange.from, dateRange.to)
          : true;

      return matchColumnFilters && matchDate;
    });
  }, [data, filterState, dateField]);

  // Determine columns to display in the table header
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    // If includeKeys is specified, use only those. Otherwise, use all keys.
    const allDisplayKeys = includeKeys ? includeKeys : Object.keys(data[0]);

    // Filter out excludeKeys from display
    let displayColumns = allDisplayKeys.filter((key) => !excludeKeys.includes(key));

    // Ensure dateField is at the beginning if specified and not excluded
    if (dateField && !displayColumns.includes(dateField)) {
        displayColumns = [dateField, ...displayColumns];
    } else if (dateField && displayColumns.includes(dateField) && displayColumns[0] !== dateField) {
        // If dateField is in the list but not first, move it to the front
        displayColumns = [dateField, ...displayColumns.filter(key => key !== dateField)];
    }
    
    return displayColumns;
  }, [data, includeKeys, excludeKeys, dateField]);

  return (
    <Box sx={{ p: 2 }}>
      {/* Filter Section */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          p: 2,
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          alignItems: "flex-end", // Aligns items at the bottom
        }}
      >
        <Typography variant="h6" component="div" sx={{ width: '100%', mb: 1 }}>
          Filter Data
        </Typography>

        {dateField && (
          <>
            <TextField
              label="Date From"
              type="date"
              value={filterState.dateRange.from}
              onChange={(e) =>
                handleFilterChange("date", "from", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 180 }}
            />
            <TextField
              label="Date To"
              type="date"
              value={filterState.dateRange.to}
              onChange={(e) => handleFilterChange("date", "to", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 180 }}
            />
          </>
        )}

        {filterKeys.map((key) => (
          <FormControl key={key} sx={{ minWidth: 180 }}>
            <InputLabel id={`${key}-select-label`}>
             {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} {/* Makes "someKey" -> "Some Key" */}
            </InputLabel>
            <Select
              labelId={`${key}-select-label`}
              value={filterState.columnFilters[key] || ""}
              label={`Filter by ${key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}`}
              onChange={(e) => handleFilterChange("column", key, e.target.value)}
            >
              <MenuItem value="">
                <em>All {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</em>
              </MenuItem>
              {getFilterOptions(key).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        <Button variant="outlined" onClick={handleClearFilters} sx={{ ml: 2 }}>
          Clear Filters
        </Button>
      </Box>

      {/* Table Section */}
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}> {/* Added max height for scrollability */}
          <Table stickyHeader aria-label="dynamic filter table">
            <TableHead>
              <TableRow>
                {columns.map((key) => (
                  <TableCell key={key} sx={{ fontWeight: 'bold' }}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((entry, idx) => (
                  <TableRow key={idx} hover>
                    {columns.map((key) => (
                      <TableCell key={key}>
                        {entry[key] !== undefined && entry[key] !== null
                          ? entry[key].toString() // Ensure data is rendered as string
                          : "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" color="textSecondary">
                      No data found for the applied filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DynamicFilterTable;

// import { useState, useMemo } from "react";
// import { format } from "date-fns";
// import { ArrowDown, ArrowUp, X } from "lucide-react";

// // import { DateRangePicker } from "@/components/ui/date-range-picker";

// import Button from "../Shared/Button/Button";
// import { cn } from "../../lib/utils";
// import { DateRangePicker } from "../ui/date-range-picker";

// const DynamicFilterTable = ({ data = [], dateField = "date" }) => {
//   const [searchText, setSearchText] = useState("");
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const [sortConfig, setSortConfig] = useState(null);

//   const handleDateRangeChange = (range) => {
//     setStartDate(range?.from || null);
//     setEndDate(range?.to || null);
//   };

//   const filteredData = useMemo(() => {
//     return data.filter((item) => {
//       const searchMatch = Object.values(item).some((value) =>
//         String(value).toLowerCase().includes(searchText.toLowerCase())
//       );
//       const date = item[dateField] ? new Date(item[dateField]) : null;
//       const inDateRange =
//         !date ||
//         (!startDate && !endDate) ||
//         (startDate && endDate && date >= startDate && date <= endDate);
//       return searchMatch && inDateRange;
//     });
//   }, [data, searchText, startDate, endDate, dateField]);

//   const sortedData = useMemo(() => {
//     if (!sortConfig) return filteredData;
//     const { key, direction } = sortConfig;
//     return [...filteredData].sort((a, b) => {
//       const aVal = a[key] || "";
//       const bVal = b[key] || "";
//       return direction === "asc"
//         ? aVal.localeCompare(bVal)
//         : bVal.localeCompare(aVal);
//     });
//   }, [filteredData, sortConfig]);

//   const headers = useMemo(() => {
//     const allKeys = new Set();
//     data.forEach((item) => Object.keys(item).forEach((key) => allKeys.add(key)));
//     return Array.from(allKeys);
//   }, [data]);

//   const toggleSort = (key) => {
//     setSortConfig((prev) => {
//       if (!prev || prev.key !== key) return { key, direction: "asc" };
//       if (prev.direction === "asc") return { key, direction: "desc" };
//       return null;
//     });
//   };

//   const clearFilters = () => {
//     setSearchText("");
//     setStartDate(null);
//     setEndDate(null);
//   };

//   return (
//     <div
//       className={cn(
//         "p-4 rounded-xl border",
//         darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-black"
//       )}
//     >
//       <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
//         <input
//           placeholder="Search..."
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           className="w-64"
//         />
//         <DateRangePicker onUpdate={handleDateRangeChange} />
//         <Button variant="outline" onClick={clearFilters}>
//           <X size={16} className="mr-2" /> Clear Filters
//         </Button>
//         <Button variant="outline" onClick={() => setDarkMode((d) => !d)}>
//           {darkMode ? "Light Mode" : "Dark Mode"}
//         </Button>
//       </div>

//       <div className="overflow-auto max-h-[70vh] border rounded-xl">
//         <table className="min-w-full text-sm text-left sticky">
//           <thead
//             className={cn(
//               "sticky top-0 z-10",
//               darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
//             )}
//           >
//             <tr>
//               {headers.map((key) => (
//                 <th
//                   key={key}
//                   onClick={() => toggleSort(key)}
//                   className="p-3 cursor-pointer select-none whitespace-nowrap"
//                 >
//                   <div className="flex items-center gap-1">
//                     {key}
//                     {sortConfig?.key === key ? (
//                       sortConfig.direction === "asc" ? (
//                         <ArrowUp size={14} />
//                       ) : (
//                         <ArrowDown size={14} />
//                       )
//                     ) : null}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {sortedData.map((row, i) => (
//               <tr
//                 key={i}
//                 className={cn(
//                   i % 2 === 0 ? "bg-white" : "bg-gray-50",
//                   darkMode && (i % 2 === 0 ? "bg-gray-900" : "bg-gray-800")
//                 )}
//               >
//                 {headers.map((key) => (
//                   <td key={key} className="p-3 whitespace-nowrap">
//                     {key.toLowerCase().includes("date") && row[key]
//                       ? format(new Date(row[key]), "dd MMM yyyy")
//                       : row[key] ?? "—"}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//             {!sortedData.length && (
//               <tr>
//                 <td colSpan={headers.length} className="text-center p-4 text-muted-foreground">
//                   No data found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default DynamicFilterTable;
