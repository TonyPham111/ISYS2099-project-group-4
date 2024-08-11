import { createContext, useEffect, useState } from "react";

const PopupContext = createContext();

function PopupContextProvider({ children }) {
  const [isPopup, setIsPopup] = useState(false);
  useEffect(()=>{
    console.log(`popup status: ${isPopup}`);
  }, [isPopup]);
  return (
    <PopupContext.Provider value={{ isPopup, setIsPopup }}>
      {children}
    </PopupContext.Provider>
  );
}
export { PopupContext, PopupContextProvider };
