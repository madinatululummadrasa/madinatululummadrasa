/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

// Create context
const FilteredResultsContext = createContext();

// Custom hook for easy use
export const useFilteredResults = () => {
  return useContext(FilteredResultsContext);
};

// Context Provider component
export const FilteredResultsProvider = ({ children }) => {
  const [filteredResults, setFilteredResults] = useState([]);

  return (
    <FilteredResultsContext.Provider value={{ filteredResults, setFilteredResults }}>
      {children}
    </FilteredResultsContext.Provider>
  );
};
// Usage example:
// import { useFilteredResults } from 'path-to-your-hook';  