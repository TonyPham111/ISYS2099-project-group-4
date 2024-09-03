import { useContext, useEffect, useState } from "react";
import UploadFileButton from "../../Button/UploadFileButton";
import DataTable from "../../Table/DataTable";
import PreviewFileCard from "../../Card/PreviewFileCard";
import { UserContext } from "@/contexts/userContext";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { PopupContext } from "@/contexts/popupContext";

export default function TestingForm({ testingData }) {
  const { id } = useParams();
  const { userData } = useContext(UserContext);
  const {setIsPopup} = useContext(PopupContext);
  const headerData = [
    "ordering_date",
    "test_name",
    "administrating_nurse",
    "administrating_date",
    "administrating_time",
  ];
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFiles, setImagesFiles] = useState([]);
  useEffect(() => {
    console.log(`check pdf file: ${pdfFile}`);
    console.log(`check images files: ${imageFiles}`);
  }, [pdfFile, imageFiles]);
  function handleOnUpdateResult() {
    if (pdfFile && imageFiles.length > 0) {
      const sendData = {
        test_id: testingData.test_id,
        patient_id: Number(id),
        pdfFile: pdfFile,
        imagesFiles: imageFiles,
        administrating_date: dayjs().format("YYYY-MM-DD"),
        administrating_time: dayjs().format("HH:mm:ss"),
      };
      console.log(`sendData: ${sendData.imagesFiles}`);
      setIsPopup(false);
    } else {
      toast.error("pdf file and at least 1 image file must be upload!");
    }
  }
  function handleUploadPDFFile(files) {
    setPdfFile(files[0]);
  }
  function handleUploadImageFile(files) {
    const availableFileName = imageFiles.map((image) => {
      return image.name;
    });
    if (availableFileName.indexOf(files[0].name)) {
      setImagesFiles([...imageFiles, files[0]]);
    } else {
      toast.error("cannot upload image file with same name!");
    }
    console.log(`4`);
  }
  return (
    <div className="w-full h-full p-5  relative ">
      <div className="w-full h-[90%] overflow-scroll">
        <div className="mb-[10px]">
          <DataTable
            headerData={headerData}
            data={[testingData]}
            handleOnClick={() => {}}
          />
          <h5 className="mt-[15px] text-xl">Test result:</h5>
          {/*------------ pdf result ----------*/}
          <div className="mb-[10px]">
            <div className="flex items-center h-[45px] gap-[20px]  my-[10px]">
              <p className="text-lg w-[80px]">PDF:</p>
              {pdfFile ? (
                <PreviewFileCard
                  fileData={pdfFile}
                  data={pdfFile}
                  setData={setPdfFile}
                />
              ) : (
                userData.job_role == "Nurse" && (
                  <UploadFileButton
                    handleOnChange={handleUploadPDFFile}
                    textContent="upload pdf"
                    acceptTypes=".pdf"
                  />
                )
              )}
            </div>
          </div>
          {/*------------ images result ----------*/}
          <div className="my-[10px]">
            <div className="flex items-center h-[45px] gap-[20px] my-[10px]">
              <p className="text-lg w-[80px]">IMAGES:</p>
              {imageFiles.map((imageFile) => {
                return (
                  <PreviewFileCard
                    fileData={imageFile}
                    data={imageFiles}
                    setData={setImagesFiles}
                  />
                );
              })}
              {/*----------button click to upload images----------*/}
              {userData.job_role == "Nurse" && (
                <UploadFileButton
                  handleOnChange={handleUploadImageFile}
                  textContent="upload images"
                  acceptTypes={".jpg, .png, .web"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {/*-------------------------------- upload button [for Nurse role only] -------------------------------*/}
      {userData.job_role == "Nurse" && (
        <div className="w-full h-[10%] py-3 flex justify-center items-center border-t-[0.5px] border-solid border-custom-dark-300">
          <button
            onClick={handleOnUpdateResult}
            className="bg-custom-blue text-white"
          >
            update result +{" "}
          </button>
        </div>
      )}
    </div>
  );
}
