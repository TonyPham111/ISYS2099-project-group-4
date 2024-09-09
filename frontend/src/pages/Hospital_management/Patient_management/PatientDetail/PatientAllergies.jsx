import { useState, useContext, useEffect } from "react";
import { PopupContext, PopupContextProvider } from "@/contexts/popupContext";
import DataTable from "@/component/ui/Table/DataTable";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useParams } from "react-router-dom";
import PopupButton from "@/component/ui/Button/PopupButton";
import { UserContext } from "@/contexts/userContext";
import CreateAllergiesForm from "@/component/ui/Form/Create/CreateAllergiesForm";
export default function PatientAllergies() {
  const { userData } = useContext(UserContext);
  const [isPopup, setIsPopup] = useState(false);
  const [specificAllergyData, setSpecificAllergyData] = useState(null);
  const headerData = [
    "record_date",
    "allergy_name",
    "allergy_type",
    "allergen",
    "allergy_group",
  ];
  const { id } = useParams();
  const { error, isLoading, data } = useSWR(
    `http://localhost:8000/patients/${id}/allergies`,
    fetcher
  );
  const {data: allergyData} = useSWR("http://localhost:8000/allergies", fetcher)
  useEffect(() => {
    console.log(`check data: ${JSON.stringify(data)}`);
    console.log(`check allergy data: ${JSON.stringify(allergyData)}`);
  }, [data, allergyData]);
  if (error) {
    return <div>error when loading data</div>;
  } else if (isLoading) {
    return <div>is loading data</div>;
  }
    return (
      <section className="w-full h-full flex flex-col gap-[15px]">
        <div className="w-full flex justify-end">
          {userData?.job_role == "Doctor" && (
            <PopupContextProvider>
              <PopupButton
                PopupComponent={
                  <CreateAllergiesForm
                    createdAllergiesData={allergyData?.map((item) => {
                      return item.allergy_name;
                    })}
                  />
                }
                text={"create new allergies + "}
              />
            </PopupContextProvider>
          )}
        </div>
        <DataTable
          headerData={headerData}
          data={data? (Array.isArray(data) ? data : [data]):[]}
          hoverOnRow={true}
          handleOnClick={() => {}}
        />
      </section>
    );
}
