import { atom } from "recoil";

export const RefetchBasked = atom({
  key: "refetchBasked", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});
export const RefetchLocalBasked = atom({
  key: "refetchBasked", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});
