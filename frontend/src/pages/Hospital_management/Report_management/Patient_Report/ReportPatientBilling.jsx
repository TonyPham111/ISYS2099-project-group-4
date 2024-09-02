import PopupButton from "@/component/ui/Button/PopupButton";
import useSWR from "swr";
import CustomAutoComplete from "@/component/ui/DateTime/CustomAutoComplete";
import { PopupContextProvider } from "@/contexts/popupContext";
import CreateBillingForm from "@/component/ui/Form/Create/CreteBillingForm";

export default function ReportPatientBilling() {
  const { data: patientData } = useSWR("http://localhost:8000/patients");
  return (
    <section className="w-full h-full">
      <div className="w-full flex justify-between p-2">
        <CustomAutoComplete
          options={[
            { id: 0, first_name: "ALL", last_name: "" },
            ...patientData,
          ]}
          getOptionLabel={(option) => {
            return `#${option.id}: ${option.first_name} ${option.last_name} `;
          }}
          label={"choose patient"}
          size={"md"}
        />
        <PopupContextProvider>
          <PopupButton PopupComponent={<CreateBillingForm/>} text={"create billing +"}/>
        </PopupContextProvider>
      </div>
    </section>
  );
}
