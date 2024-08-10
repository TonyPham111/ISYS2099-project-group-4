import { Button } from "../../components/ui/button";
import { IoHome } from "react-icons/io5";
import { FaUserNurse } from "react-icons/fa6";
import { MdPeopleAlt } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({}) => {
  const [activeItem, setActiveItem] = useState(1);
  const navigate = useNavigate();

  const handleOnClick = (activeItem, navigationLink) =>{
    setActiveItem(activeItem);
    navigate(`/${navigationLink}`);
  }
  return (
    <section className="w-[70px] h-full bg-white ">
      <section className="w-full mt-[80px] flex items-center flex-col gap-[50px]">
        <Button onClick={()=>{ handleOnClick(1,'dashboard') }} className={`border-0 ${activeItem==1?"bg-custom-blue":""}`} variant="outline" size="icon">
          <IoHome className={`h-6 w-6 ${activeItem==1?"text-white":"text-custom-blue"}`} />
        </Button>
        <Button onClick={()=>{ handleOnClick(2,'staff') }} className={`border-0 ${activeItem==2?"bg-custom-blue":""}`}  variant="outline" size="icon">
          <FaUserNurse className={`h-6 w-6 ${activeItem==2?"text-white":"text-custom-blue"}`} />
        </Button>
        <Button onClick={()=>{ handleOnClick(3,'patient') }} className={`border-0 ${activeItem==3?"bg-custom-blue":""}`}  variant="outline" size="icon">
          <MdPeopleAlt className={`h-6 w-6 ${activeItem==3?"text-white":"text-custom-blue"}`} />
        </Button>
        <Button onClick={()=>{ handleOnClick(4,'appointment') }} className={`border-0 ${activeItem==4?"bg-custom-blue":""}`}  variant="outline" size="icon">
          <FaCalendarAlt className={`h-6 w-6 ${activeItem==4?"text-white":"text-custom-blue"}`} />
        </Button>
        <Button onClick={()=>{ handleOnClick(5,'report') }} className={`border-0 ${activeItem==5?"bg-custom-blue":""}`}  variant="outline" size="icon">
          <LuClipboardList className={`h-6 w-6 ${activeItem==5?"text-white":"text-custom-blue"}`} />
        </Button>
      </section>
    </section>
  );
};

export default Sidebar;
