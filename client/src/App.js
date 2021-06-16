import AppState from "./context/AppState";

import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Me from "./components/Me";

function App() {
    return (
        <AppState>
            <Navbar />
            <Me />
            <Register />
            <Login />
        </AppState>
    );
}

export default App;
