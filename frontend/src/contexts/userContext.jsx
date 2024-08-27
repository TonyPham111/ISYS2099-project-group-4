import { createContext, useState } from "react";

const UserContext = createContext();

function UserContextProvider({ children }) {
  const [isPopup, setIsPopup] = useState(false);
  return (
    <PopupContext.Provider value={{ isPopup, setIsPopup }}>
      {children}
    </PopupContext.Provider>
  );
}
export { PopupContext, PopupContextProvider };
