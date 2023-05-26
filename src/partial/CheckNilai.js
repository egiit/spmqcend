const CheckNilai = (nilai) => {
  if (!nilai || isNaN(nilai)) return Number(0);

  return Number(nilai);
};

export default CheckNilai;
