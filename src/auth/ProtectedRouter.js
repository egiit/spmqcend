import { useContext } from "react";

import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const ProtectedRouter = ({ children }) => {
  // const navigate = useNavigate();
  const { value } = useContext(AuthContext);
  const { token } = value;
  // const location = useLocation();

  if (!token) {
    return <Navigate to="/" />;
  }
  // console.log(checkAccessPath);
  // if (!checkAccessPath) {
  //   return navigate(-1);
  // }

  return children;
};

export default ProtectedRouter;
