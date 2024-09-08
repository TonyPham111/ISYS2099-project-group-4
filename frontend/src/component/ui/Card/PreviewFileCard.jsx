import { useEffect, useState } from "react";
import byteSize from "byte-size";
export default function PreviewFileCard({
  fileData,
  data,
  setData,
  allowDelete,
}) {
  const [fileUrl, setFileUrl] = useState("");
  useEffect(() => {
    if (fileData) {
      // Create an object URL for the selected file
      const url = URL.createObjectURL(fileData);
      setFileUrl(url); // Update state with the object URL
    }
  }, []);
  function handleDelete() {
    if (Array.isArray(data)) {
      const newData = data.filter((item) => {
        return item.name !== fileData.name;
      });
      setData(newData);
    } else {
      setData(null);
    }
  }
  return (
    <div className="w-[200px] h-full border-[0.5px] border-solid border-custom-dark-200 shadow-md rounded-md flex justify-between p-[2px] relative">
      {/*--------- click to download -------------*/}
      <a
        href={fileUrl}
        className="w-[30%] h-full bg-custom-blue rounded-sm text-center text-white"
        download
      >
        {fileData.type.split("/")[1]}
      </a>
      {/*--------- file description -------------*/}
      <div className="w-[65%] h-full ">
        <p className="w-full line-clamp-1 text-sm font-semibold">
          {fileData.name}
        </p>
        <p className="text-sm">{byteSize(fileData.size).toString()}</p>
      </div>
      {allowDelete && (
        <button
          onClick={handleDelete}
          className="w-[25px] h-[25px] rounded-full bg-[#636363] text-white absolute -right-[10px] -top-[10px] flex justify-center items-center z-10"
        >
          -
        </button>
      )}
    </div>
  );
}
