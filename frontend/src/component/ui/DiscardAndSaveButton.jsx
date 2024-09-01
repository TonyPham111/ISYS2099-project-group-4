export default function DiscardAndSaveButton({handleDiscardChange, handleSaveInformation}) {
  return (
    <div className="p-3 w-full border-t-[2px] border-solid border-custom-dark-100 flex gap-[10px] justify-end  items-start">
      <button
        onClick={handleDiscardChange}
        className="h-[50px] bottom-5 right-5 bg-red-600 text-white"
      >
        Discard changes
      </button>
      <button
        onClick={handleSaveInformation}
        className="h-[50px] bottom-5 right-5 bg-custom-blue text-white"
      >
        Save information
      </button>
    </div>
  );
}
