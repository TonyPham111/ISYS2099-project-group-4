import { PopupContextProvider } from "../../../contexts/popupContext";
import DataTable from "../../../component/DataTable";
import RegisterButton from "./component/RegisterButton";
import * as patientService from "@/services/patientService.js";

const Patient = () => {
  const patientData = patientService.getPatients();
  const headerData = [
    "id",
    "first_name",
    "last_name",
    "gender",
    "birth_date",
    "home_address",
    "contact_phone_number",
  ];
  const handleSearchDta = () => {};
  return (
    <section className="w-11/12 h-5/6 bg-white rounded-2xl p-5 flex flex-col gap-4">
      {/*-------- headline and register patient button --------*/}
      <div className="w-full flex justify-between items-center">
        <h1>List of patient</h1>
        <PopupContextProvider>
          <RegisterButton />
        </PopupContextProvider>
      </div>
      {/*-------- searching patient data --------*/}
      <div className="flex w-full max-w-sm items-center space-x-2">
        < input type="input" placeholder="find by ID or name" />
        <button
          onClick={handleSearchDta}
          className="bg-custom-blue"
          type="submit"
        >
          Search
        </button>
      </div>
      {/*-------- show data table -------------*/}
      <DataTable headerData={headerData} data={patientData} />
    </section>
  );
};
export default Patient;
