import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
export default function CustomDatePicker({ value, setValue, size }) {
  let customSx;
  if (size == "lg") {
    customSx = {
      ".css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
        minWidth: "290px",
        height: "17px",
      },
    };
  }else if(size == "md"){

  }else if(size == "sm"){
    customSx = {
      ".css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
        width:"150px",
        height: "7px",
      },
    };
  } else{
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
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
