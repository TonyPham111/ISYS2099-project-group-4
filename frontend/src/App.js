import Navbar from "./component/layout/Navbar";
import Sidebar from "./component/layout/Sidebar";
import Main from "./component/layout/Main";

import { UserContext, UserContextProvider } from "./contexts/userContext";
import { useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";
export default function App() {
  const { userData } = useContext(UserContext);
  return (
    <>
      <section className="App w-screen h-screen bg-custom-dark-100">
        {userData && <Navbar />}
        <section className="w-full h-full flex">
          {userData && <Sidebar />}
          <Main />
        </section>
      </section>
      <Toaster position="top-center" />
    </>
  );
}
