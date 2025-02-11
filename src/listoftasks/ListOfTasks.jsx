import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SideBar from "../sidebar/SideBar";

const ListOfTasks = () => {
  const [lists, setLists] = useState([]); 
  const [tasks, setTasks] = useState([]); 
  const [newListName, setNewListName] = useState("");
  const [newPriority, setNewPriority] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [user, setUser] = useState(null); 
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

  // Fetch lists from Firestore
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
    } catch (error) {
      console.error("Error fetching tasks: ", error);
      alert("Error fetching tasks: " + error.message);
    }
  };

const createList = async () => {
    if (!newListName.trim()||!newPriority.trim()) {
      alert("List name cannot be empty!");
      return;
    }
  
    if (!user) {
      alert("User is not authenticated.");
      return;
    }
  
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "lists"), {
        name: newListName,
        createdAt: new Date(),
        userId: user.uid,
        priority: newPriority,
      });
      setLists([...lists, { id: docRef.id, name: newListName, priority: 5 }]);
      setNewListName("");
      setNewPriority(0);
      setShowListModal(false); 
      alert("List created successfully!");
    } catch (error) {
      console.error("Error creating list: ", error);
      alert("Error creating list: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, listId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { listId: listId });
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, listId: listId } : task
        )
      );
      alert("Task assigned to list successfully!");
    } catch (error) {
      console.error("Error updating task: ", error);
      alert("Error updating task: " + error.message);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 vw-100" style={{ background: "linear-gradient(to left, #6A11CB, #2575FC)" }}>
      <SideBar />
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent p-3">
        <div className="container">
          <span className="navbar-brand fw-bold fs-4">List of Tasks</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid flex-grow-1 d-flex p-4">
        {/* Left Side: List of Lists */}
        <div className="col-md-3">
          <div className="card shadow-lg p-3" style={{ borderRadius: "20px" }}>
            <h2 className="text-primary fw-bold" style={{ fontFamily: "Poppins, Arial" }}>Lists</h2>
            <p className="text-muted">Create and manage your lists.</p>

            {/* Create New List Button */}
            <button
              className="btn btn-primary w-100 rounded-pill mb-4"
              onClick={() => setShowListModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i> Create New List
            </button>

            {/* Display Lists */}
            <div className="list-group">
              {lists.map((list) => (
                <div
                  key={list.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, list.id)}
                >
                  <span>{list.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: List of Tasks */}
        <div className="col-md-9 vw-10" style={{ paddingLeft: "20px", maxWidth: "500px" }}>
  <div className="card shadow-lg p-3" style={{ borderRadius: "20px" }}>
    <h2 className="text-primary fw-bold" style={{ fontFamily: "Poppins, Arial" }}>Tasks</h2>
    <p className="text-muted">Drag and drop tasks into lists.</p>

    {/* Display Tasks */}
    <div className="d-flex flex-wrap gap-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="card mb-3"
          style={{ width: "200px" }}
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
        >
          <div className="card-body">
            <h5 className="card-title">{task.title}</h5>
            <p className="card-text">{task.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
      </div>

      {/* Create List Modal */}
      {showListModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New List</h5>
                <button type="button" className="btn-close" onClick={() => setShowListModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">List Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Enter list name"
                  />
                  <label className="form-label">Priority from 1-10</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    placeholder="Enter Priority"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowListModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={createList} disabled={loading}>
                  {loading ? "Creating..." : "Create List"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showListModal && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default ListOfTasks;