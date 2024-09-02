import { useEffect, useState } from "react";

export default function PreviewFileCard({
  fileData,
  rowIndex,
  columnIndex,
  data,
  setData,
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
    console.log(`check data: ${JSON.stringify(data)}`);
    const newData = data.filter((item) => {
      return item.fileData.name !== fileData.name;
    });
    setData(newData);
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
        <p className="text-sm">{fileData.size / 1000}MB</p>
      </div>
      <button
        onClick={handleDelete}
        className="w-[25px] h-[25px] rounded-full bg-[#636363] text-white absolute -right-[10px] -top-[10px] flex justify-center items-center"
      >
        -
      </button>
    </div>
  );
}
