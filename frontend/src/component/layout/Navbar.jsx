import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <section className="w-screen h-[50px] fixed bg-custom-blue flex justify-end items-center p-5">
      <div
        onClick={() => {
          localStorage.removeItem("userData");
          navigate("/login");
        }}
      >
        <FiLogOut  className="text-white w-[25px] h-[25px] cursor-pointer" />
      </div>
    </section>
  );
};

export default Navbar;
