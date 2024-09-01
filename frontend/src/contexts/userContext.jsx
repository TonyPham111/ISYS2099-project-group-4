import { createContext, useState } from "react";

const UserContext = createContext();

function UserContextProvider({ children }) {
  const [id, ] = useState(false);
  return (
    <UserContext.Provider value={{ isPopup, setIsPopup }}>
      {children}
    </UserContext.Provider>
  );
}
export { PopupContext, PopupContextProvider };
