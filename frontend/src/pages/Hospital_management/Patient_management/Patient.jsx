import { PopupContextProvider } from "@/contexts/popupContext";
import DataTable from "@/component/ui/DataTable";
import RegisterPatientButton from "../../../component/patient/general/RegisterPatientButton";
import MiniSearch from "minisearch";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";


export default function Patient() {
  const [url, setUrl] = useState("http://localhost:8000/patients");
  const { data, error, isLoading } = useSWR(url, fetcher);
  const navigate = useNavigate();
  if (error) {
    console.error(`error: ${error}`);
    return <div>error fetching data</div>;
  }
  if (isLoading) {
  }
  const headerData = [
    "id",
    "first_name",
    "last_name",
    "gender",
    "birth_date",
    "contact_phone_number",
    "home_address",
  ];

  function handleNavigateOnDataRow(item, rowIndex) {
    navigate(`${item.id}/personal-information`);
  }
  if (data) {
    return (
      <>
        {/*-------- headline and register patient button --------*/}
        <div className="w-full flex justify-between items-center">
          <h1>List of patient</h1>
          <PopupContextProvider>
            <RegisterPatientButton />
          </PopupContextProvider>
        </div>
        {/*-------- searching patient data --------*/}
        <div className="flex w-full max-w-sm items-center space-x-2">
          <input
            className="h-[40px] w-[200px]"
            type="input"
            placeholder="find by ID or name"
          />
        </div>
        {/*-------- show data table -------------*/}
        <DataTable
          headerData={headerData}
          data={data}
          hoverOnRow={true}
          handleOnClick={handleNavigateOnDataRow}
        />
      </>
    );
  }
}
