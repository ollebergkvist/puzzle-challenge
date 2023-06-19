// libs
import dayjs from "dayjs";

export const formatDate = (dateString) => {
  const date = dayjs(dateString);
  const formattedDate = date.format("MMMM DD YYYY");

  return formattedDate;
};
