import { tagList } from "@/constant/common_constants";

export const createCookie = (MembershipIdName, MembershipID) => {
  let expires;
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  expires = `; expires=${date.toGMTString()}`;
  document.cookie = `${MembershipIdName}=${MembershipID}${expires}; path=/`;
};
export const removeCookie = (cookieName) => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const checkTimeisOver = async (serverTime) => {
  const currentTime = Date.now();
  const timeDiffrence = currentTime - serverTime;
  if (timeDiffrence > 7200000) {
    console.log("Time is over");
    return true;
  }
  console.log("In Time");
  return false;
};
export const getingHeadingText = async (options) => {
  const tagLists = tagList[options.lang];
  const itemObject = await tagLists?.find(
    (object) => object.category === options.category
  );
  if (itemObject) {
    return itemObject.heading;
  } else {
    return null;
  }
};
