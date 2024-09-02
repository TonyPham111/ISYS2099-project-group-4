import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useEffect } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
export default function UploadFileButton({ textContent, handleOnChange, acceptTypes, multiple, rowIndex }) {
  return (
    <Button
      sx={{
        backgroundColor: "#636363",
        width:"50px",
        height:"35px",
        borderRadius:"100px"
      }}
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      // startIcon={<FaCloudUploadAlt />}
    >
      +
      <VisuallyHiddenInput
        type="file"
        onChange={(event) =>{ handleOnChange(event.target.files, rowIndex)}}
        accept={acceptTypes}
      />
    </Button>
  );
}
