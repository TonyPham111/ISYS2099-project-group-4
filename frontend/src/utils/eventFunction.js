export default function filterEventArray(targetArray, conditionArray) {
  console.log(
    `targetArray: ${JSON.stringify(
      targetArray
    )}\n conditionArray: ${JSON.stringify(conditionArray)}\n`
  );
  const newArray = targetArray.filter((item) => {
    for (let i = 0; i < conditionArray.length; ++i) {
      if (
        conditionArray[i].start == item.start &&
        conditionArray[i].end == item.end
      ) {
        return false;
      }
      //if not appear, return true
    }
    return true;
  });
  return newArray;
}

export function indexOfEvent(targetEvent, eventArray) {
  for (let i = 0; i < eventArray.length; ++i) {
    if (
      eventArray[i].start == targetEvent.start &&
      eventArray[i].end == targetEvent.end
    ) {
      return i;
    }
  }
  return -1;
}

export function detectAppointmentNotCover(appointArray, backgroundEventArray) {
  //return array of appointment that not fully cover
  if (backgroundEventArray.length === 0) {
    return appointArray;
  }
  const notFullyCoverAppointmentArray = appointArray.filter(
    (appointmentItem, index) => {
      for (let i = 0; i < backgroundEventArray.length; ++i) {
        // console.log(
        //   `appoint item #${index}: ${JSON.stringify(
        //     appointmentItem
        //   )}\n backgroundEvent index at: ${i}: ${JSON.stringify(
        //     backgroundEventArray[i]
        //   )}`
        // );
        // console.log();
        const isFullyCover =
          appointmentItem.start >= backgroundEventArray[i].start &&
          appointmentItem.start <= backgroundEventArray[i].end &&
          appointmentItem.end >= backgroundEventArray[i].start &&
          appointmentItem.end <= backgroundEventArray[i].end;
        // console.log(
        //   `startTime is fully conver: ${
        //     appointmentItem.start >= backgroundEventArray[i].start &&
        //     appointmentItem.start <= backgroundEventArray[i].end
        //   }`
        // );
        // console.log(
        //   `end Time is fully conver: ${
        //     appointmentItem.end >= backgroundEventArray[i].start &&
        //     appointmentItem.end <= backgroundEventArray[i].end
        //   }`
        // );
        // const isFullyNotCover =
        //   (appointmentItem.start < backgroundEventArray[i].start &&
        //     appointmentItem.end < backgroundEventArray[i].start) ||
        //   (appointmentItem.start > backgroundEventArray[i].end &&
        //     appointmentItem.end < backgroundEventArray[i].end);
        // const isPartiallyNotCover =
        //   (appointmentItem.start < backgroundEventArray[i].start &&
        //     appointmentItem.end >= backgroundEventArray[i].start) ||
        //   (appointmentItem.start <= backgroundEventArray[i].end &&
        //     appointmentItem.end > backgroundEventArray[i].end);
        if (isFullyCover) {
          return false;
        }
      }
      return true;
    }
  );
  return notFullyCoverAppointmentArray;
}
