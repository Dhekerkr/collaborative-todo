import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SideBar from "../sidebar/SideBar";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [editTaskId, setEditTaskId] = useState(null); // Track the task being edited
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [tasks, setTasks] = useState([]); // Local state to store tasks
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchTasks(currentUser.uid); 
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);


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

  const addTask = async () => {
    if (!taskTitle.trim() || !taskDescription.trim()) {
      alert("Both fields are required!");
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title: taskTitle,
        description: taskDescription,
        createdAt: new Date(),
        userId: user.uid, 
        completed: false, 
      });

      
      const newTask = { id: docRef.id, title: taskTitle, description: taskDescription, completed: false };
      setTasks([...tasks, newTask]);

      alert("Task added successfully!");
      closeModal();
    } catch (error) {
      alert("Error adding task: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId)); 
      setTasks(tasks.filter((task) => task.id !== taskId)); 
      alert("Task deleted successfully!");
    } catch (error) {
      alert("Error deleting task: " + error.message);
    }
  };

  const openEditModal = (task) => {
    setEditTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditTaskId(null);
    setEditTaskTitle("");
    setEditTaskDescription("");
  };

  const editTask = async () => {
    if (!editTaskTitle.trim() || !editTaskDescription.trim()) {
      alert("Both fields are required!");
      return;
    }

    setLoading(true);
    try {
      const taskRef = doc(db, "tasks", editTaskId);
      await updateDoc(taskRef, {
        title: editTaskTitle,
        description: editTaskDescription,
      });

      setTasks(
        tasks.map((task) =>
          task.id === editTaskId
            ? { ...task, title: editTaskTitle, description: editTaskDescription }
            : task
        )
      );

      alert("Task updated successfully!");
      closeEditModal();
    } catch (error) {
      alert("Error updating task: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        completed: !completed,
      });

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      alert("Error toggling task completion: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const openModal = () => setShowModal(true);

  const closeModal = () => {
    setShowModal(false);
    setTaskTitle("");
    setTaskDescription("");
  };

  return (
    <div>
        <SideBar />
    
    <div className="d-flex flex-column min-vh-100 vw-100" style={{ background: "linear-gradient(to left, #6A11CB, #2575FC)" }}>
      
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent p-3">
        <div className="container">
          <span className="navbar-brand fw-bold fs-4">Dashboard</span>
          <button className="btn btn-outline-light rounded-pill" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="card shadow-lg text-center p-4" style={{ borderRadius: "20px", maxWidth: "500px", width: "100%" }}>
          <h2 className="text-primary fw-bold" style={{ fontFamily: "Poppins, Arial" }}>Welcome !</h2>
          <p className="text-muted">Manage your tasks efficiently.</p>

          {/* Task Section */}
          <div className="mt-4">
            <h5 className="fw-bold text-secondary">Your Tasks</h5>
            {tasks.length === 0 ? (
              <p className="text-muted">You don’t have any tasks yet.</p>
            ) : (
              <ul className="list-group">
                {tasks.map((task) => (
                  <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id, task.completed)}
                        className="me-3"
                      />
                      <div>
                        <h6 className="text-dark">{task.title}</h6>
                        <p className="text-muted">{task.description}</p>
                      </div>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(task)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteTask(task.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button className="btn btn-primary w-100 rounded-pill mt-3" onClick={openModal}>
              <i className="bi bi-plus-circle me-2"></i> Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Task</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Enter task title"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Task Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Enter task description"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={addTask} disabled={loading}>
                  {loading ? "Saving..." : "Save Task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editTaskTitle}
                    onChange={(e) => setEditTaskTitle(e.target.value)}
                    placeholder="Enter task title"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Task Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={editTaskDescription}
                    onChange={(e) => setEditTaskDescription(e.target.value)}
                    placeholder="Enter task description"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeEditModal}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={editTask} disabled={loading}>
                  {loading ? "Updating..." : "Update Task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showModal || showEditModal) && <div className="modal-backdrop show"></div>}
    </div>
    </div>
  );
};

export default Dashboard;