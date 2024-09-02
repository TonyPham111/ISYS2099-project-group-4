import CustomAutoComplete from "@/component/ui/DateTime/CustomAutoComplete";
import DataTable from "@/component/ui/Table/DataTable";
import { useEffect, useState } from "react";
import fetcher from "@/utils/fetcher";
import useSWR from "swr";
export default function ReportWageChangeHistory() {
  const [chosenStaff, setChosenStaff] = useState(null);
  const headerData = [
    "staff_id",
    "date_change",
    "old_wage",
    "new_wage",
  ];
  const [url, setUrl] = useState(`http://localhost:8000/staffs/wage_change_history`);
  const { data: wageChangeData } = useSWR(url, fetcher);
  const { data: staffData } = useSWR(`http://localhost:8000/staffs`, fetcher);

  function handleOnSearch() {
    if (chosenStaff && chosenStaff.id !== 0) {
      setUrl(
        `http://localhost:8000/staffs/wage_change_history?staffId=${chosenStaff.id}`
      );
    } else if (chosenStaff && chosenStaff.id == 0) {
      setUrl(`http://localhost:8000/staffs/wage_change_history`);
    }
  }
  if (!staffData) {
    return <></>;
  }
  return (
    <section className="w-full h-full flex flex-col gap-[15px]">
      <div className="w-full flex justify-between">
        <div className="flex gap-[10px] items-center">
          <CustomAutoComplete
            value={chosenStaff}
            options={[
              { id: 0, first_name: "ALL", last_name: "" },
              ...staffData,
            ]}
            onChange={(event, value) => {
              setChosenStaff(value);
            }}
            getOptionLabel={(option) => {
              return `#${option.id}: ${option.first_name} ${option.last_name} `;
            }}
            label={"choose staff"}
            size={"md"}
          />
          <button
            onClick={handleOnSearch}
            className="h-[40px] bg-custom-blue text-white"
          >
            search
          </button>
        </div>
      </div>
      <DataTable
        headerData={headerData}
        data={wageChangeData ? wageChangeData: []}
        hoverOnRow={true}
        handleOnClick={() => {}}
      />
    </section>
  );
}
