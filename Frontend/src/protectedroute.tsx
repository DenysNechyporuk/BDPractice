import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./features/auth/Auth";

type Props = {
    children: ReactNode;
};

function ProtectedRoute({ children }: Props) {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;