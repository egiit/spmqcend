import { Outlet, useOutletContext } from "react-router-dom";
import { QcEndProvider } from "../provider/QcEndProvider";

const QcMap = () => {
  return (
    <QcEndProvider>
      <Outlet context={useOutletContext()} />
    </QcEndProvider>
  );
};

export default QcMap;
