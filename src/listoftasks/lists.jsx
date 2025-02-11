import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SideBar from "../sidebar/SideBar";

const List = () => {
  const [lists, setLists] = useState([]); 
  const [tasks, setTasks] = useState([]); 
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchLists(currentUser.uid);
        fetchTasks(currentUser.uid);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchLists = async (userId) => {
    try {
      const listsCollection = collection(db, "lists");
      const q = query(listsCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const listsData = [];

      querySnapshot.forEach((doc) => {
        listsData.push({ id: doc.id, ...doc.data() });
      });
      setLists(listsData);
    } catch (error) {
      setError("Error fetching lists: " + error.message);
      console.error("Error fetching lists: ", error);
    }
  };

  const fetchTasks = async (userId) => {
    try {
      const tasksCollection = collection(db, "tasks");
      const q = query(tasksCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const tasksData = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() });
      });

      setTasks(tasksData);
      setLoading(false);
    } catch (error) {
      setError("Error fetching tasks: " + error.message);
      console.error("Error fetching tasks: ", error);
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const hue = (10 - priority) * 25;
    return `hsl(${hue}, 100%, 85%)`; 
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(to left, #6A11CB, #2575FC)",
        }}
      >
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 vw-100" style={{ background: "linear-gradient(to left, #6A11CB, #2575FC)" }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent p-3">
        <div className="container">
          <span className="navbar-brand fw-bold fs-4">My Lists</span>
        </div>
      </nav>

      <div className="container d-flex justify-content-center align-items-center pt-4">
        <div className="row w-100">
          <div className="col-md-3">
            <SideBar />
          </div>

          <div className="col-md-9">
            <h1 className="text-light fw-bold mb-4" style={{ fontFamily: "Poppins, Arial", fontSize: "2rem" }}>
              All Lists
            </h1>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Display Lists with Tasks */}
            <div className="row">
              {lists.map((list) => (
                <div key={list.id} className="col-md-4 mb-4">
                  <div
                    className="card shadow-lg p-3"
                    style={{
                      borderRadius: "20px",
                      backgroundColor: getPriorityColor(list.priority),
                      transition: "transform 0.3s ease-in-out",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <h3 className="card-title text-dark" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                      {list.name}
                    </h3>
                    <p className="text-dark" style={{ fontSize: "1rem" }}>
                      Priority: {list.priority}
                    </p>

                    {/* Display Tasks for the List */}
                    <div className="mt-3">
                      {tasks
                        .filter((task) => task.listId === list.id)
                        .map((task) => (
                          <div
                            key={task.id}
                            className="card mb-3"
                            style={{ width: "100%", marginBottom: "10px" }}
                          >
                            <div className="card-body" style={{ padding: "1rem" }}>
                              <h5 className="card-title text-dark" style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                                {task.title}
                              </h5>
                              <p className="card-text text-muted" style={{ fontSize: "1rem" }}>
                                {task.description}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
