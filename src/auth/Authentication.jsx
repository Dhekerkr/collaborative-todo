import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [btnClicked, setBtnClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || (!isLogin && !name)) {
      setError("⚠️ All fields are required.");
      setLoading(false);
      return;
    }

    try {
        if (isLogin) {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          localStorage.setItem("UserId", userCredential.user.uid);
          navigate("/dashboard");
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          localStorage.setItem("UserId", userCredential.user.uid);
          alert("Signup successful! Please log in.");
          setIsLogin(true);
        }
      } catch (err) {
        console.error("Firebase Auth Error:", err.code, err.message);
      
        if (err.code === "auth/email-already-in-use") {
          setError("⚠️ Email is already in use.");
        } else if (err.code === "auth/weak-password") {
          setError("⚠️ Password should be at least 6 characters.");
        } else if (err.code === "auth/invalid-email") {
          setError("⚠️ Invalid email format.");
        } else {
          setError("❌ Authentication failed. Please try again.");
        }
      
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ background: "linear-gradient(to left, #6A11CB, #2575FC)", minWidth: "98.8vw" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <div className="card shadow-lg" style={{ borderRadius: "20px" }}>
          <div className="card-body">
            <h2 className="text-center mb-4" style={{ fontFamily: "Poppins, Arial", color: "#2575FC" }}>
              {isLogin ? "Welcome Back!" : "Create Your Account"}
            </h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-3">
                  <label className="form-label" style={{ fontFamily: "Poppins, Arial" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ fontFamily: "Poppins, Arial" }}
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label" style={{ fontFamily: "Poppins, Arial" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control rounded-3"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ fontFamily: "Poppins, Arial" }}
                />
              </div>

              <div className="mb-4 position-relative">
                <label className="form-label" style={{ fontFamily: "Poppins, Arial" }}>
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control rounded-3"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ fontFamily: "Poppins, Arial" }}
                />
                <button
                  type="button"
                  className="position-absolute top-50 end-0 mt-3 translate-middle-y border-0 bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? <FaEyeSlash color="#2575FC" /> : <FaEye color="#2575FC" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-100 btn"
                disabled={loading}
                onClick={() => setBtnClicked(true)}
                style={{
                  borderRadius: "30px",
                  fontFamily: "Poppins, Arial",
                  padding: "10px 20px",
                  backgroundColor: btnClicked ? "#6A11CB" : "#2575FC",
                  color: "#FFF",
                }}
              >
                {loading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Log In" : "Sign Up"}
              </button>
            </form>

            <p className="mt-3 text-center" style={{ fontFamily: "Poppins, Arial, sans-serif" }}>
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <span
                    style={{ color: "#2575FC", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => {
                      setIsLogin(false);
                      setError("");
                    }}
                  >
                    Sign up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    style={{ color: "#2575FC", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => {
                      setIsLogin(true);
                      setError("");
                    }}
                  >
                    Log in
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
