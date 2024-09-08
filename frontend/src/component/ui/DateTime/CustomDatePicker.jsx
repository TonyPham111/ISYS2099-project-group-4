import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MdPadding } from "react-icons/md";
export default function CustomDatePicker({
  value,
  setValue,
  size,
  min,
  max,
  readOnly,
}) {
  let customSx;
  if (size == "lg") {
    customSx = {
      ".css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
        minWidth: "290px",
        height: "17px",
      },
    };
  } else if (size == "md") {
  } else if (size == "sm") {
    customSx = {
      ".css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
        width: "150px",
        height: "7px",
      },
    };
  } else if (size == "full") {
    customSx = {
      height: "100%",
      width: "100%",
    };
  } else {
    customSx = {};
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          sx={customSx}
          format="DD/MM/YYYY"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          readOnly={readOnly}
          minDate={min}
          maxDate={max}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
