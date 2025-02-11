import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Inline styles
  const styles = {
    sidebar: {
      position: "fixed",
      left: isOpen ? "0" : "-250px",
      top: "0",
      width: "260px",
      height: "100vh",
      background: "#2c3e50",
      color: "white",
      transition: "left 0.3s ease-in-out",
      paddingTop: "20px",
      zIndex: 1001, // Ensure sidebar is above other content
      fontFamily: "'Poppins', sans-serif",
      boxShadow: "4px 0 10px rgba(0, 0, 0, 0.3)",
    },
    sidebarNav: {
      marginTop: "50px",
    },
    sidebarUl: {
      listStyle: "none",
      padding: "0",
      margin: "0",
    },
    sidebarLi: {
      padding: "15px",
      textAlign: "center",
      margin: "10px 20px",
      borderRadius: "8px",
      transition: "all 0.3s ease-in-out",
      fontSize: "1.1rem",
      backgroundColor: location.pathname === "/" ? "#e74c3c" : "transparent",
    },
    sidebarLink: {
      color: "white",
      textDecoration: "none",
      display: "block",
      fontWeight: 500,
      transition: "color 0.3s ease-in-out",
    },
    closeBtn: {
      position: "absolute",
      right: "15px",
      top: "15px",
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      color: "white",
      cursor: "pointer",
      marginBottom: "20px",
    },
    menuBtn: {
      position: "fixed", // Use fixed positioning for the menu button
      left: "15px",
      top: "15px",
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#2c3e50",
      zIndex: 1000, // Ensure the button is above other content
    },
    activeLink: {
      backgroundColor: "#e74c3c",
      fontWeight: "bold",
    },
  };

  return (
    <>
      {/* Menu Button */}
      <button style={styles.menuBtn} onClick={toggleSidebar}>
        &#9776;
      </button>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        {/* Close Button */}
        <button style={styles.closeBtn} onClick={toggleSidebar}>
          &times;
        </button>

        {/* Navigation Links */}
        <nav style={styles.sidebarNav}>
          <ul style={styles.sidebarUl}>
            <li
              style={{
                ...styles.sidebarLi,
                backgroundColor: location.pathname === "/" ? "#e74c3c" : "transparent",
              }}
            >
              <Link to="/dashboard" style={styles.sidebarLink}>
                Dashbord
              </Link>
            </li>
            <li
              style={{
                ...styles.sidebarLi,
                backgroundColor: location.pathname === "/add-list" ? "#e74c3c" : "transparent",
              }}
            >
              <Link to="/add-list" style={styles.sidebarLink}>
                Lists and Tasks
              </Link>
            </li>
            <li
              style={{
                ...styles.sidebarLi,
                backgroundColor: location.pathname === "/list-of-lists" ? "#e74c3c" : "transparent",
              }}
            >
              <Link to="/lists" style={styles.sidebarLink}>
                List of Lists and Priorities
              </Link>
            </li>
            <li
              style={{
                ...styles.sidebarLi,
                backgroundColor: location.pathname === "/profile" ? "#e74c3c" : "transparent",
              }}
            >
              <Link to="/profil" style={styles.sidebarLink}>
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}