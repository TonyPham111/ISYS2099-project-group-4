import { useContext, useEffect, useState } from "react";
import UploadFileButton from "../../Button/UploadFileButton";
import DataTable from "../../Table/DataTable";
import PreviewFileCard from "../../Card/PreviewFileCard";
import { UserContext } from "@/contexts/userContext";

export default function TestingForm({ testingData }) {
  const { userData } = useContext(UserContext);
  const headerData = [
    "name",
    "administrating_nurse",
    "administrating_date",
    "administrating_time",
  ];
  const [pdfFiles, setPdfFiles] = useState([]);
  const [imageFiles, setImagesFiles] = useState([]);

  function handleOnUpdateResult() {}
  function handleUploadPDFFile(files, rowIndex) {
    //check row index is not the same
    const availableRowIndex = pdfFiles.map((item) => {
      return item.row;
    });
    if (availableRowIndex.indexOf(rowIndex) < 0) {
      setPdfFiles([...pdfFiles, { row: rowIndex, fileData: files[0] }]);
    }
  }
  function handleUploadImageFile(files, rowIndex) {
    setImagesFiles([
      ...imageFiles,
      {
        row: rowIndex,
        fileData: files[0],
      },
    ]);
  }
  return (
    <div className="w-full h-full p-5  relative ">
      <div className="w-full h-[90%] overflow-scroll">
        {testingData.map((testing, rowIndex) => {
          let availableToUpload = true;
          let imagesLength = 0;
          return (
            <div className="mb-[10px]">
              <DataTable
                headerData={headerData}
                data={[testing]}
                handleOnClick={() => {}}
              />
              <h5 className="mt-[15px] text-xl">Test result:</h5>
              {/*------------ pdf result ----------*/}
              <div className="mb-[10px]">
                <div className="flex items-center h-[45px] gap-[20px]  my-[10px]">
                  <p className="text-lg w-[80px]">PDF:</p>
                  {pdfFiles.map((pdfFile, colIndex) => {
                    if (pdfFile.row == rowIndex) {
                      availableToUpload = false;
                      return (
                        <PreviewFileCard
                          fileData={pdfFile.fileData}
                          data={pdfFiles}
                          setData={setPdfFiles}
                          row={rowIndex}
                          columnIndex={colIndex}
                        />
                      );
                    }
                  })}
                  {/*----------button click to upload pdf----------*/}
                  {availableToUpload && userData.job_role == "Nurse" && (
                    <UploadFileButton
                      handleOnChange={handleUploadPDFFile}
                      textContent="upload pdf"
                      acceptTypes=".pdf"
                      rowIndex={rowIndex}
                    />
                  )}
                </div>
              </div>
              {/*------------ images result ----------*/}
              <div className="my-[10px]">
                <div className="flex items-center h-[45px] gap-[20px] my-[10px]">
                  <p className="text-lg w-[80px]">IMAGES:</p>
                  {imageFiles.map((imageFile, colIndex) => {
                    if (imageFile.row == rowIndex) {
                      imagesLength++;
                      if (imagesLength <= 5) {
                        return (
                          <PreviewFileCard
                            fileData={imageFile.fileData}
                            data={imageFiles}
                            setData={setImagesFiles}
                            rowIndex={rowIndex}
                            columnIndex={colIndex}
                          />
                        );
                      }
                    }
                  })}
                  {/*----------button click to upload images----------*/}
                  {userData.job_role == "Nurse" && (
                    <UploadFileButton
                      handleOnChange={handleUploadImageFile}
                      textContent="upload images"
                      acceptTypes={".jpg, .png, .web"}
                      rowIndex={rowIndex}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
