import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./auth/Authentication";
import Dashboard from "./dashboard/Dashboard";
import ListOfTasks from "./listoftasks/ListOfTasks";
import ProfilePage from "./profile/Profile";
import List from "./listoftasks/lists";


const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("UserId");
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/signup" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/add-list" element={<ListOfTasks/>}/>
        <Route path="/profil" element={<ProfilePage/>}/>
        <Route path="/lists" element={<List />}/>
      </Routes>
    </Router>
  );
}

export default App;
