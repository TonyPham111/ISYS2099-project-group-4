//* only accept Date object as a input arrayOfEvents[Date], event: Date
export default function detectEventOverlapping(arrayOfEvents, event) {
  let isOverlapping = false;
  //choose only list that have same day with event
  const sameDateEvents = arrayOfEvents.filter((item) => {
    return item.start.getDate() === event.start.getDate();
  });

  for (let i = 0; i < sameDateEvents.length; ++i) {
    let condition1 =
      event.start > sameDateEvents[i].start &&
      event.start < sameDateEvents[i].end;
    let condition2 =
      event.end > sameDateEvents[i].start && event.end < sameDateEvents[i].end;
    let condition3 =
      event.start <= sameDateEvents[i].start &&
      event.end >= sameDateEvents[i].end;

    if (condition1 || condition2 || condition3) {
      isOverlapping = true;
    }
  }
  return isOverlapping;
}
