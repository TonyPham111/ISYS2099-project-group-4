import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";

export default function DataTable({ headerData, data }) {
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
            <tr className="tr--hover" key={item.id}>
              {headerData.map((keyItem) => (
                <td>{getKeyValue(item, keyItem)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
