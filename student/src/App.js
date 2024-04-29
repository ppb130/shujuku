import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import LoginRegister from "./login/LoginRegister";
import StudentHome from "./studentHome/studentHome"
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/StudentHome" element={<StudentHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
