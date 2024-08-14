import { PopupContextProvider } from "@/contexts/popupContext";
import DataTable from "@/component/ui/DataTable";
import * as staffService from "@/services/staffService.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddStaffButton from "@/component/staff/general/AddStaffButton";

export default function Staff() {
  const staffData = staffService.getStaffs();
  const [filterData, setFilterData] = useState(staffData);
  const headerData = [
    "id",
    "first_name",
    "last_name",
    "job",
    "gender",
    "birth_date",
    "home_address",
    "contact_phone_number",
    "email",
    "wage",
    "hire_date",
    "employment_type"
  ];
const navigate = useNavigate();
  
  function handleNavigateOnDataRow(item, rowIndex){
    navigate(`${item.id}/personal-information`);
  }
  return (
    <>
      {/*-------- headline and register patient button --------*/}
      <div className="w-full flex justify-between items-center">
        <h1>List of staff</h1>
        <PopupContextProvider>
          <AddStaffButton/>
        </PopupContextProvider>
      </div>
      {/*-------- searching patient data --------*/}
      {/* <div className="flex w-full max-w-sm items-center space-x-2">
        <input className="h-[40px] w-[200px]"
          onChange={(e) => handleSearchData(e.target.value)}
          type="input"
          placeholder="find by ID or name"
        />
      </div> */}
      {/*-------- show data table -------------*/}
      <DataTable headerData={headerData} data={filterData} hoverOnRow={true} handleOnClick={handleNavigateOnDataRow}/>
    </>
  );
}
