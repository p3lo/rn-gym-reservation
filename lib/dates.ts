export function formatDate(givenDate: Date) {
  const date = new Date(givenDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return day + '.' + month + '.' + year;
}
export function getTimeFromDate(date: Date) {
  let getDate = new Date(date);
  let hours = getDate.getHours();
  let minutes = getDate.getMinutes();
  return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}
