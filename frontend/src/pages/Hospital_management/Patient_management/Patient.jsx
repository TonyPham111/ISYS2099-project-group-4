import { PopupContextProvider } from "@/contexts/popupContext";
import DataTable from "@/component/ui/DataTable";
import RegisterPatientButton from "../../../component/patient/general/RegisterPatientButton";
import * as patientService from "@/services/patientService.js";
import MiniSearch from "minisearch";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Patient() {
  const patientData = patientService.getPatients();
  const [filterData, setFilterData] = useState(patientData);
  const headerData = [
    "id",
    "first_name",
    "last_name",
    "gender",
    "birth_date",
    "contact_phone_number",
    "home_address"
  ];
const navigate = useNavigate();
  let miniSearch = new MiniSearch({
    fields: ["id", "first_name", "last_name"], // fields to index for full-text search
    storeFields: ["id"], // fields to return with search results
  });
  miniSearch.addAll(patientData);

  const handleSearchData = (searchingData) => {
    if (searchingData == "") {
      setFilterData(patientData);
    } else {
      let result = miniSearch.search(searchingData);
      result = result.map((item) => item.id);
      result = patientData.filter((item) => {
        return result.includes(Number(item.id));
      });
      setFilterData(result);
    }
  };
  function handleNavigateOnDataRow(item, rowIndex){
    navigate(`${item.id}/personal-information`);
  }
  return (
    <>
      {/*-------- headline and register patient button --------*/}
      <div className="w-full flex justify-between items-center">
        <h1>List of patient</h1>
        <PopupContextProvider>
          <RegisterPatientButton/>
        </PopupContextProvider>
      </div>
      {/*-------- searching patient data --------*/}
      <div className="flex w-full max-w-sm items-center space-x-2">
        <input className="h-[40px] w-[200px]"
          onChange={(e) => handleSearchData(e.target.value)}
          type="input"
          placeholder="find by ID or name"
        />
      </div>
      {/*-------- show data table -------------*/}
      <DataTable headerData={headerData} data={filterData} hoverOnRow={true} handleOnClick={handleNavigateOnDataRow}/>
    </>
  );
}
