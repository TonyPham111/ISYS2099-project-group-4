export default function convertStringFormatToDate(date, time) {
  const [year, month, day] = date.split("-");
  const [hour, minute, second] = time.split(":");
  const convertedDateObject = new Date(
    parseInt(year),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    parseInt(hour, 10),
    parseInt(minute, 10),
    parseInt(second, 10)
  );
//   console.log(parseInt(year));
//   console.log(parseInt(month, 10));
//   console.log(parseInt(day, 10));
//   console.log(parseInt(hour, 10));
//   console.log(parseInt(minute, 10));
//   console.log(parseInt(second, 10));
//   console.log(`check convertedDateObject: ${convertedDateObject}`);
  return convertedDateObject;
}
