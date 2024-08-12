import { PopupContext } from "@/contexts/popupContext";
import { useContext, useState } from "react";
import Popup from "../../ui/Popup";
import TreatmentHistoryForm from "./TreatmentHistoryForm";
export default function DataTreatmentTable({ headerData, data }) {
  const { isPopup, setIsPopup } = useContext(PopupContext);
  const [treatmentId, setTreatmentId] = useState(null);
  return (
    <>
      <section className="w-full overflow-scroll rounded-xl">
        <table className=" w-full">
          <thead className="h-[50px] bg-custom-dark-100 p-3">
            <tr>
              {headerData.map((item, index) => (
                <td key={index}>{item}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                className="tr--hover"
                key={item.treatment_id}
                onClick={() => {
                  setIsPopup(true);
                  setTreatmentId(item.treatment_id);
                }}
              >
                {headerData.map((keyItem) => (
                  <td>{item[keyItem]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <Popup>
        <TreatmentHistoryForm treatmentId={treatmentId}/>
      </Popup>
    </>
  );
}
