import { PopupContextProvider } from "@/contexts/popupContext";
import DataTable from "@/component/ui/Table/DataTable";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import PopupButton from "@/component/ui/Button/PopupButton";
import AddStaffForm from "@/component/ui/Form/Create/AddStaffForm";
import { UserContext } from "@/contexts/userContext";
import CustomAutoComplete from "@/component/ui/DateTime/CustomAutoComplete";

export default function Staff() {
  const [departmentId, setDepartmentId] = useState(null);
  const [namingOrder, setNamingOrder] = useState(null);
  const { userData } = useContext(UserContext);
  const [url, setUrl] = useState(`http://localhost:8000/staffs`);
  const { error, isLoading, data: staffData } = useSWR(url, fetcher);
  const { data: departmentData } = useSWR(
    "http://localhost:8000/departments",
    fetcher
  );
  const [headerData, setHeaderData] = useState([
    "id",
    "full_name",
    "job_name",
    "department_name",
    "gender",
    "birth_date",
    "home_address",
    "contact_phone_number",
    "email",
    "wage",
    "hire_date",
  ]);
  const navigate = useNavigate();
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
  useEffect(() => {
    console.log(`check department data: ${departmentData}`);
  }, [departmentData]);
  useEffect(() => {
    console.log(`check staff data: ${staffData}`);
  }, [staffData]);
  function handleNavigateOnDataRow(item, rowIndex) {
    navigate(`../${item.id}/personal-information`);
  }
  function handleOnSearch() {
    if (departmentId>=0 && namingOrder) {
      if (departmentId == 0) {
        const newUrl = `http://localhost:8000/staffs?naming_order=${namingOrder}`;
        setUrl(newUrl);
        setDepartmentId(departmentId);
        setNamingOrder(namingOrder);
        console.log('trigger 1');
      } else {
        const newUrl = `http://localhost:8000/staffs?department_id=${departmentId}&naming_order=${namingOrder}`;
        setUrl(newUrl);
        setDepartmentId(departmentId);
        setNamingOrder(namingOrder);
        console.log('trigger 2');
      }
    } else if (departmentId >= 0) {
      if (departmentId == 0) {
        const newUrl = `http://localhost:8000/staffs`;
        setUrl(newUrl);
        setDepartmentId(departmentId);
        setNamingOrder(namingOrder);
        console.log('trigger 3');
      } else {
        const newUrl = `http://localhost:8000/staffs?department_id=${departmentId}`;
        setUrl(newUrl);
        setDepartmentId(departmentId);
        setNamingOrder(namingOrder);
        console.log('trigger 4');
      }
    } else if (namingOrder) {
      const newUrl = `http://localhost:8000/staffs?naming_order=${namingOrder}`;
      setUrl(newUrl);
      setDepartmentId(departmentId);
      setNamingOrder(namingOrder);
      console.log('trigger 5');
    }
  }
  if (error) {
    return <div>error when loading data</div>;
  } else if (isLoading) {
    return <div>is loading data</div>;
  } else if (staffData) {
    return (
      <>
        {/*-------- headline and add staff button --------*/}
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
        {/*-------- searching staff data base on department or asc or desc name --------*/}
        <div className="flex gap-[30px]">
          {/*choose department*/}
          <CustomAutoComplete
            options={
              departmentData ? [{ id: 0, name: "All" }, ...departmentData] : []
            }
            onChange={(event, value) => {
              setDepartmentId(value?.id);
            }}
            getOptionLabel={(option) => {
              return `${option.name}`;
            }}
            label={"department ..."}
            size={"md"}
          />
          {/*choose naming order*/}
          <div className="w-[170px]">
            <CustomAutoComplete
              options={[
                { value: "asc", name: "ascending order" },
                { value: "desc", name: "descending order" },
              ]}
              onChange={(event, value) => {
                setNamingOrder(value?.value);
              }}
              getOptionLabel={(option) => {
                return `${option.name}`;
              }}
              label={"naming order ..."}
              size={"full"}
            />
          </div>
          <button
            onClick={handleOnSearch}
            className="bg-custom-blue text-white"
          >
            search
          </button>
        </div>
        {/*-------- show data table -------------*/}
        <DataTable
          headerData={headerData}
          data={staffData ? staffData : []}
          hoverOnRow={true}
          handleOnClick={handleNavigateOnDataRow}
        />
      </>
    );
  }
}
