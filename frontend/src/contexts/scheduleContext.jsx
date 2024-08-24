import { createContext, useState } from "react";

const ScheduleContext = createContext();

function ScheduleContextProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [backgroundEvents, setBackgroundEvents] = useState([]);
  const [filterBackgroundEvents, setFilterBackgroundEvents] = useState([]);
  return (
    <ScheduleContext.Provider
      value={{
        events,
        setEvents,
        backgroundEvents,
        setBackgroundEvents,
        filterBackgroundEvents,
        setFilterBackgroundEvents,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}
export { ScheduleContext, ScheduleContextProvider };
