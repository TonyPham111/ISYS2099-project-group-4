import { useState, useContext, useEffect } from "react";
import { PopupContext } from "@/contexts/popupContext";
import CustomAutoComplete from "@/component/ui/DateTime/CustomAutoComplete";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import toast from "react-hot-toast";
export default function CreateOrderTestingForm() {
  const { id } = useParams();
  const [createdData, setCreatedData] = useState([]);
  const { setIsPopup } = useContext(PopupContext);
  const headerData = ["testing", "price", "duration", "test_description"];
  const { data: testingData } = useSWR(
    "http://localhost:8000/test_types",
    fetcher
  );
  function handleCreateOrder() {
    let readyToCreateOrder = true;
    /*----check if it meet requirement to create new treatment ( not allow any blank input )*/
    if (createdData.length > 0) {
      for (let i = 0; i < createdData.length; ++i) {
        if (!createdData[i]["id"]) {
          readyToCreateOrder = false;
        }
      }
    } else {
      readyToCreateOrder = false;
    }
    if (readyToCreateOrder) {
      const sendData = {
        date: dayjs().format("YYYY-MM-DD"),
        patient_id: Number(id),
        tests: createdData.map((item) => {
          return Number(item.id);
        }),
      };
      console.log(JSON.stringify(sendData));
      toast.success("new allergy record of this patient have been created");
      setIsPopup(false);
    } else {
      if (createdData.length == 0) {
        toast.error("please fill at least 1 record!");
      } else {
        toast.error(
          "please fill all data and allergy name cannot be the same with past record!"
        );
      }
    }
  }
  return (
    <div className="w-full h-full p-5 flex flex-col gap-[10px] relative">
      <div className="w-full h-[90%] overflow-scroll">
        <h2>Order Testing</h2>
        <CreateTestingTable
          headerData={headerData}
          data={createdData}
          setData={setCreatedData}
          testingData={testingData}
        />
      </div>
      <div className="w-[95%] mx-auto pt-5 border-t-2 border-custom-gray-200 flex justify-center absolute bottom-[10px]">
        <button
          onClick={handleCreateOrder}
          className="h-[50px] w-[250px] bg-custom-blue text-white"
        >
          Order test +
        </button>
      </div>
    </div>
  );
}

function CreateTestingTable({ headerData, data, setData, testingData }) {
  /*-------------------------main function---------------------------*/
  function handleAutoCompleteOnChange(event, value, rowIndex) {
    data[rowIndex].id = value.id;
    data[rowIndex].test_name = value.test_name;
    data[rowIndex].price = value.price;
    data[rowIndex].duration = value.duration;
    data[rowIndex].test_description = value.test_description;

    setData([...data]);
  }
  function handleAddRowData() {
    setData([
      ...data,
      {
        id: null,
        test_name: null,
        price: null,
        duration: null,
        test_description: null,
      },
    ]);
  }
  function removeRow(index) {
    data.splice(index, 1);
    setData([...data]);
  }
  /*-----------------------------------------------------------------*/
  return (
    <>
      <table className="w-full">
        <thead className="h-[50px] bg-custom-dark-100 p-3">
          <tr>
            {headerData.map((item, index) => (
              <td key={index}>{item}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr>
              {headerData.map((keyItem) => {
                /*----------------------auto complete input (diagnosis)--------------------------*/
                if (keyItem == "testing") {
                  return (
                    <td className="w-[70px] h-[20px] py-[5px]">
                      <CustomAutoComplete
                        options={testingData}
                        // value={patientValue}
                        onChange={(event, value) => {
                          handleAutoCompleteOnChange(event, value, rowIndex);
                        }}
                        getOptionLabel={(option) => {
                          return `#${option.id}: ( ${option.test_name} )`;
                        }}
                        label={"search by test id or test name ..."}
                        size={"full"}
                      />
                    </td>
                  );
                } else if (keyItem == "") {
                  /*------------------------ remove row button -------------------------------*/
                  return (
                    <td className="w-[30px] h-[20px]  py-[5px]">
                      <button
                        onClick={() => {
                          removeRow(rowIndex);
                        }}
                        className="bg-custom-blue text-white w-[50px] py-1"
                      >
                        -
                      </button>
                    </td>
                  );
                } else {
                  return (
                    <td className="w-[70px] h-[20px]  py-[5px] ">
                      {item[keyItem]}
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>{" "}
      {/*------------------------ add row button -------------------------------*/}
      <button
        onClick={handleAddRowData}
        className="bg-custom-blue text-white w-[150px]"
      >
        add condtion +{" "}
      </button>
    </>
  );
}
