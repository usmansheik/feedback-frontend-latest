import logo from './logo.svg';
import './App.css';
import ViewProducts from "./components/ViewProducts";
import LoginPage from "./LoginPage";
import {BrowserRouter, Route, Routes, useHistory, Navigate, useNavigate} from "react-router-dom";
import RegisterPage from "./RegisterPage";
import Dashboard from "../src/components/Dashboard"

function Root() {
    return (
        <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route
                path="/dashboard"
                element={
                    <Dashboard />
                }
            />


        </Routes>
    );
}
function App() {

    return (
        <BrowserRouter>
            <Root />
        </BrowserRouter>
    );
}

export default App;
