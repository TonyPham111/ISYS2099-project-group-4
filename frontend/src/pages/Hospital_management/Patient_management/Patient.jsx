import { PopupContextProvider } from "@/contexts/popupContext";
import DataTable from "@/component/ui/Table/DataTable";
import PopupButton from "@/component/ui/Button/PopupButton";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import RegisterPatientForm from "@/component/ui/Form/Create/RegisterPatientForm";
import { UserContext } from "@/contexts/userContext";
import CustomAutoComplete from "@/component/ui/DateTime/CustomAutoComplete";

export default function Patient() {
  const { userData } = useContext(UserContext);
  const [url, setUrl] = useState("http://localhost:8000/patients");
  const { data: renderData } = useSWR(url, fetcher);
  const { data, error, isLoading } = useSWR(
    "http://localhost:8000/patients",
    fetcher
  );
  const navigate = useNavigate();
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
  function handleOnChangeOnPatient(data) {
    if (data) {
      if (data.id == 0) {
        setUrl("http://localhost:8000/patients");
      } else {
        setUrl(`http://localhost:8000/patients/${data.id}`);
      }
    }
  }

  if (error) {
    console.error(`error: ${error}`);
    return <div>error fetching data</div>;
  }
  if (isLoading) {
  }

  if (data) {
    return (
      <>
        {/*-------- headline and register patient button --------*/}
        <div className="w-full flex justify-between items-center">
          <h1>List of patient</h1>
          {userData.job_role == "FrontDesk" && (
            <PopupContextProvider>
              <PopupButton
                PopupComponent={<RegisterPatientForm />}
                text={"register patient +"}
              />
            </PopupContextProvider>
          )}
        </div>
        {/*-------- searching patient data --------*/}
        <div className="flex w-full max-w-sm items-center space-x-2">
          <CustomAutoComplete
            options={[{ id: 0, name: "ALL" }, ...data]}
            onChange={(event, value) => {
              handleOnChangeOnPatient(value);
            }}
            getOptionLabel={(option) => {
              if (option.id == 0) {
                return option.name;
              } else {
                return `#${option.id}: ${option.last_name} ${option.first_name}`;
              }
            }}
            label={"search by id or name..."}
            size={"md"}
          />
        </div>
        {/*-------- show data table -------------*/}
        {/*data that render can be array or just an object so need to double check*/}
        <DataTable
          headerData={headerData}
          data={
            renderData
              ? renderData.length > 0
                ? [...renderData]
                : [renderData]
              : []
          }
          hoverOnRow={true}
          handleOnClick={handleNavigateOnDataRow}
        />
      </>
    );
  }
}
