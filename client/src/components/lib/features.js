import moment from "moment";

const fileformatter = (url = "") => {
  const fileExt = url.split(".").pop();

  if (
    fileExt === "mp4" ||
    fileExt === "webm" ||
    fileExt === "mkv" ||
    fileExt === "ogg"
  ) {
    return "video";
  } else if (fileExt === "mp3" || fileExt === "wav") {
    return "audio";
  } else if (
    fileExt === "jpg" ||
    fileExt === "jpeg" ||
    fileExt === "png" ||
    fileExt === "gif"
  ) {
    return "image";
  }

  return "file";
};

const transformImage = (url = "", width = 100) => {
  const newUrl = url.replace("/upload", `/upload/dpr_auto/w_${width}`);
  return newUrl;
};

const getLast7Days = () => {
  const currentDate = moment();
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days").format("dddd");
    last7Days.unshift(dayDate);
  }
  return last7Days;
};

const saveOrGetLocalStorage = ({ get, key, value }) => {
  if (get) {
    return JSON.parse(localStorage.getItem(key));
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export { fileformatter, transformImage, getLast7Days, saveOrGetLocalStorage };
