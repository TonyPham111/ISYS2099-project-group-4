import { GrLogout } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";
import { useContext } from "react";
const Navbar = () => {
  const navigate = useNavigate();
  const {userData, setUserData} = useContext(UserContext);
  return (
    <section className="w-screen h-[50px] fixed bg-custom-blue flex justify-end items-center p-5">
      <div
        onClick={() => {
          localStorage.removeItem("userData");
          setUserData(null);
          navigate("/login");
        }}
      >
        <GrLogout className="w-[25px] h-[25px] text-white" />
      </div>
    </section>
  );
};

export default Navbar;
