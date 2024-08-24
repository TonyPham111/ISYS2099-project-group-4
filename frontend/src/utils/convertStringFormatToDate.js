export default function convertStringFormatToDate(date, time) {
  let year, month, day, hour, minute, second;
  let convertedDateObject;
  if (date) {
    [day, month, year] = date.split("/");
    [day, month, year] = [
      parseInt(day, 10),
      parseInt(month, 10) - 1,
      parseInt(year),
    ];
  }
  if (time) {
    [hour, minute, second] = time.split(":");
    [hour, minute, second] = [
      parseInt(hour, 10),
      parseInt(minute, 10),
      parseInt(second, 10),
    ];
  }
  if (date && time) {
    convertedDateObject = new Date(year, month, day, hour, minute, second);
  } else if (date) {
    convertedDateObject = new Date(year, month, day);
  } else if (time) {
    convertedDateObject = new Date(hour, minute, second);
  } else {
    return Error("input is invalid, please check again");
  }

  //   console.log(parseInt(year));
  //   console.log(parseInt(month, 10));
  //   console.log(parseInt(day, 10));
  //   console.log(parseInt(hour, 10));
  //   console.log(parseInt(minute, 10));
  //   console.log(parseInt(second, 10));
  //   console.log(`check convertedDateObject: ${convertedDateObject}`);
  return convertedDateObject;
}
