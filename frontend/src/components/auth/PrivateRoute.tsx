import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type Props = {
  children: JSX.Element;
};

export default function PrivateRoute({ children }: Props) {
  const { token, lojistaId } = useAuth();

  if (!token) {
    // Não logado → volta pro login
    return <Navigate to="/auth" />;
  }

  if (!lojistaId) {
    // Logado mas sem lojista → força cadastrar loja
    return <Navigate to="/auth" state={{ tab: "lojista" }} />;
  }

  return children;
}