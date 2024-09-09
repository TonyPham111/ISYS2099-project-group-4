import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import { useState, useEffect } from "react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { type } from "@testing-library/user-event/dist/type";

export default function ReviewPDF({
  fileData,
  data,
  setData,
  allowDelete,
  pageWidth,
  pageHeight,
}) {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
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
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }
  return (
    <div>
      <Document
        className="w-full flex justify-center "
        file={fileData}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <div className="relative">
          <Page
            className="shadow-2xl border-solid border-[0.5px] border-custom-dark-200 relative"
            pageNumber={pageNumber}
            width={pageWidth}
            height={pageHeight}
            renderAnnotationLayer={false}
            renderTextLayer
          />
          {allowDelete && (
            <button
              onClick={handleDelete}
              className="w-[25px] h-[25px] rounded-full bg-custom-blue text-white absolute -right-[10px] -top-[10px] flex justify-center items-center z-10"
            >
              -
            </button>
          )}
        </div>
      </Document>
      <div className="w-full flex flex-col items-center">
        <p>
          Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
        </p>
        <div className="flex gap-[20px]">
          <button
            className={`bg-custom-dark-300 text-white w-[100px] ${
              pageNumber <= 1 && "opacity-35"
            }`}
            type="button"
            disabled={pageNumber <= 1}
            onClick={previousPage}
          >
            Previous
          </button>
          <button
            className={`bg-custom-dark-300 text-white w-[100px] ${
              pageNumber >= numPages && "opacity-35"
            }`}
            type="button"
            disabled={pageNumber >= numPages}
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
