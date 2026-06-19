import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./features/auth/Login/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import TerminalPage from "./features/terminals/TerminalPage";
import PageLayout from "./Components/PageLayout/PageLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route element={<PageLayout />}>
                    <Route
                        path="/terminals"
                        element={
                            <ProtectedRoute>
                                <TerminalPage />
                            </ProtectedRoute>
                        }
                    />
                 </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
