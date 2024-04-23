import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginRegister from "./login/LoginRegister";
import UserBook from "./manage/userbook";
import AdminBook from "./manage/adminbook";
import Cookies from "js-cookie";
import "./App.css";

function App() {
  const identity = Cookies.get("user_identity");
  const username = Cookies.get("username");
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginRegister />} />
          <Route
            path="/"
            element={
              <Navigate
                replace
                to={
                  username
                    ? identity === "admin"
                      ? "/adminBook"
                      : "/userBook"
                    : "/login"
                }
              />
            }
          />
          <Route path="/adminBook" element={<AdminBook />} />
          <Route path="/userBook" element={<UserBook />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
