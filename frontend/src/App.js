import Navbar from "./component/layout/Navbar";
import Sidebar from "./component/layout/Sidebar";
import Main from "./component/layout/Main";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
useEffect(() => {
    if (!localStorage.getItem("token")) {
        navigate('/login');
    }
}, []);
  return (   
    <section className="App w-screen h-screen bg-custom-dark-100">
      <Navbar/>
      <section className="w-full h-full flex">
        <Sidebar/>
        <Main/> 
      </section>
    </section>
  );
}

export default App;
