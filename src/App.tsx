import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import NotFound from "./pages/NotFound";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import { Toaster } from "react-hot-toast";
import Protected from "./components/Protected";
import { useAuth } from "./hooks/useAuth";
import HomePage from "./pages/HomePage";

function App() {
  const { token } = useAuth();

  return (
    <Router>
      <Toaster />
      <NavBar />
      <Routes>
        <Route
          path='/'
          element={
            <Protected token={token}>
              <HomePage />
            </Protected>
          }
        ></Route>
        <Route
          path='/chat-app'
          element={
            <Protected token={token}>
              <ChatPage />
            </Protected>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
