import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
export default function CustomAutoComplete({
  value,
  options,
  getOptionLabel,
  label,
  onChange,
  size
}) {
    let customSx;
    if(size=="lg"){
        customSx ={
        ".MuiOutlinedInput-root .MuiAutocomplete-input": {
          padding: "0px",
        },
        width: "215px",
      }
    }else if(size=="md"){
        customSx ={
            ".MuiOutlinedInput-root .MuiAutocomplete-input": {
              padding: "0px",
            },
            width: "150px",
          }
    }
  return (
    <Autocomplete
      disablePortal
      options={options}
      value={value}
      onChange={onChange}
      getOptionLabel={getOptionLabel}
      sx={customSx}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
