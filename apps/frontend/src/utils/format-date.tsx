// libs
import dayjs from "dayjs";

export const formatDate = (dateString: string) => {
  const date = dayjs(dateString);
  const formattedDate = date.format("MMMM DD YYYY");

  return formattedDate;
};
