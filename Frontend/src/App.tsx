import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./features/auth/Login/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import TerminalPage from "./features/terminals/TerminalPage";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/terminals"
                    element={
                        <ProtectedRoute>
                            <TerminalPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
