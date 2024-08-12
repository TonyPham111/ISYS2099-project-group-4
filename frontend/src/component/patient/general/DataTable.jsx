import React from "react";
import { useNavigate } from "react-router-dom";

export default function DataTable({ headerData, data }) {
  const navigate = useNavigate();
  return (
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
            <tr className="tr--hover" onClick={()=>{navigate(`${item.id}/personal-information`)}} key={item.id}>
              {headerData.map((keyItem) => (
                <td>{item[keyItem]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
