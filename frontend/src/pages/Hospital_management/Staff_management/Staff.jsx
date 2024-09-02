import { PopupContextProvider } from "@/contexts/popupContext";
import DataTable from "@/component/ui/Table/DataTable";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import PopupButton from "@/component/ui/Button/PopupButton";
import AddStaffForm from "@/component/ui/Form/Create/AddStaffForm";
import { UserContext } from "@/contexts/userContext";

export default function Staff() {
  const { userData } = useContext(UserContext);
  const [url, setUrl] = useState(`http://localhost:8000/staffs`);
  useEffect(() => {
    if (userData) {
      if (userData.job_role == "HR") {
        const newUrl = `http://localhost:8000/staffs`;
        if (newUrl !== url) {
          setUrl(newUrl);
        }
      } else {
        const newUrl = `http://localhost:8000/staffs?manager_id=${userData.id}`;
        if (newUrl !== url) {
          setUrl(newUrl);
        }
      }
    }
  }, [userData]);
  const { error, isLoading, data } = useSWR(url, fetcher);
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
    "employment_type",
  ];
  const navigate = useNavigate();

  function handleNavigateOnDataRow(item, rowIndex) {
    navigate(`${item.id}/personal-information`);
  }
  if (error) {
    return <div>error when loading data</div>;
  } else if (isLoading) {
    return <div>isloading data</div>;
  } else if (data) {
    return (
      <>
        {/*-------- headline and register patient button --------*/}
        <div className="w-full flex justify-between items-center">
          <h1>List of staff</h1>
          {userData.job_role == "HR" && (
            <PopupContextProvider>
              <PopupButton
                PopupComponent={<AddStaffForm />}
                text={"add new staff + "}
              />
            </PopupContextProvider>
          )}
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
