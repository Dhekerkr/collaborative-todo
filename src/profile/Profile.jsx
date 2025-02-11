import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser } from "react-icons/fa";
import SideBar from "../sidebar/SideBar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const auth = getAuth();
  const db = getFirestore();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email);

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setName(userDoc.data().name || "John Doe");
        }
      } else {
      }
    });

    return unsubscribe; 
  }, [auth, db]);

  const updateUserProfile = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const changeUserPassword = (e) => {
    e.preventDefault();
    alert("Password updated successfully!");
  };

  return (
    <div>
      <SideBar />

      <div className="d-flex flex-column min-vh-100 vw-100" style={{ background: "linear-gradient(to left, #6A11CB, #2575FC)" }}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-transparent p-3">
          <div className="container">
            <span className="navbar-brand fw-bold fs-4">Profile</span>
          </div>
        </nav>

        <div className="container flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="card shadow-lg text-center p-4" style={{ borderRadius: "20px", maxWidth: "500px", width: "100%" }}>
            <h2 className="text-primary fw-bold" style={{ fontFamily: "Poppins, Arial" }}>My Profile</h2>
            <div className="profile-header my-3">
              <div className="profile-avatar-container">
                <FaUser className="profile-avatar" style={{ fontSize: "50px" }} />
              </div>
              <div className="profile-info">
                <p className="profile-email text-muted">{email}</p>
              </div>
            </div>
            <form onSubmit={updateUserProfile}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 rounded-pill">Update Profile</button>
            </form>
            <form onSubmit={changeUserPassword} className="mt-3">
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-warning w-100 rounded-pill">Update Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
