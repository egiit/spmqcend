import CheckNilai from "./CheckNilai";

export const totalCol = (data, colname) => {
  if (!data.length) return 0;
  return data.reduce(
    (sum, item) =>
      parseInt(CheckNilai(sum)) + parseInt(CheckNilai(item[colname])),
    0
  );
};
