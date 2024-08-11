import { PopupContextProvider } from "../../../contexts/popupContext";
import RegisterButton from "./component/RegisterButton";
const Patient = () => {
  return (
    <section className="w-11/12 h-5/6 bg-white rounded-2xl p-5">
      <div className="w-full flex justify-between items-center">
        <h1>List of patient</h1>
        <PopupContextProvider>
          <RegisterButton />
        </PopupContextProvider>
      </div>
    </section>
  );
};
export default Patient;
