import { useContext } from "react";
import { PopupContext } from "../contexts/popupContext";
import { MdClose } from "react-icons/md";

const Popup = ({children}) => {
  const { isPopup, setIsPopup } = useContext(PopupContext);
  const handleClosePopup = () => {
    setIsPopup(false);
  };
  return (
    <section
      className={` ${
        isPopup ? "" : "hidden"
      } w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-20 flex justify-center items-center`}
    >
      <section className="w-11/12 h-5/6 bg-white rounded-2xl pt-10 relative">
        <MdClose onClick={handleClosePopup} className="cursor-pointer h-6 w-6 text-custom-blue  absolute top-5 right-5" />
        <div className="w-full h-full rounded-2xl">
          {children}
        </div>
      </section>
    </section>
  );
};
export default Popup;
