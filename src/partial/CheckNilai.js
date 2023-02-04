const CheckNilai = (nilai) => {
  if (!nilai || isNaN(nilai)) return 0;

  return nilai;
};

export default CheckNilai;
