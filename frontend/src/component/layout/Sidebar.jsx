import { Button } from "@/components/ui/button";
import { IoHome } from "react-icons/io5";
import { FaUserNurse } from "react-icons/fa6";
import { MdPeopleAlt } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({}) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState();
  const navigate = useNavigate();
  const handleOnClick = (navigationLink) =>{
    navigate(`/${navigationLink}`);
  }
  useEffect(()=>{
    /*need to set active link when router change because if not it will wrongly reorder activeItem*/
    if(activeItem!==location.pathname.split("/")){
      setActiveItem(location.pathname.split("/")[1]);
    }
    console.log(activeItem);
  },[location]);
  return (
    <section className="w-[70px] h-full bg-white ">
      <section className="w-full mt-[80px] flex items-center flex-col gap-[50px]">
        <Button onClick={()=>{ handleOnClick('dashboard') }} className={`border-0 ${activeItem=="dashboard"?"bg-custom-blue":""}`} variant="outline" size="icon">
          <IoHome className={`h-6 w-6 ${activeItem=="dashboard"?"text-white":"text-custom-blue"}`} />
        </Button>
        <Button onClick={()=>{ handleOnClick('staff') }} className={`border-0 ${activeItem=="staff"?"bg-custom-blue":""}`}  variant="outline" size="icon">
          <FaUserNurse className={`h-6 w-6 ${activeItem=="staff"?"text-white":"text-custom-blue"}`} />
        </Button>
        <Button onClick={()=>{ handleOnClick('patient') }} className={`border-0 ${activeItem=="patient"?"bg-custom-blue":""}`}  variant="outline" size="icon">
          <MdPeopleAlt className={`h-6 w-6 ${activeItem=="patient"?"text-white":"text-custom-blue"}`} />
        </Button>
        <Button onClick={()=>{ handleOnClick('appointment') }} className={`border-0 ${activeItem=="appointment"?"bg-custom-blue":""}`}  variant="outline" size="icon">
          <FaCalendarAlt className={`h-6 w-6 ${activeItem=="appointment"?"text-white":"text-custom-blue"}`} />
        </Button>
        <Button onClick={()=>{ handleOnClick('report') }} className={`border-0 ${activeItem=="report"?"bg-custom-blue":""}`}  variant="outline" size="icon">
          <LuClipboardList className={`h-6 w-6 ${activeItem=="report"?"text-white":"text-custom-blue"}`} />
        </Button>
      </section>
    </section>
  );
};

export default Sidebar;
