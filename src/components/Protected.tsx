import { Navigate } from "react-router-dom";
function Protected({
  token,
  children,
}: {
  token: string | null;
  children: JSX.Element;
}) {
  if (!token) {
    return <Navigate to='/login' replace />;
  }
  return children;
}
export default Protected;
