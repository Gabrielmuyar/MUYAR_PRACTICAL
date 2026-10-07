import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.PROD ? "" : "http://localhost:5000";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = () => {
    axios
      .get(`${API_URL}/students`)
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching students:", error));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !course || !age) {
      alert("Please fill in all fields.");
      return;
    }

    if (editingId) {
      axios
        .put(`${API_URL}/students/${editingId}`, {
          name,
          course,
          age: Number(age),
        })
        .then(() => {
          resetForm();
          fetchStudents();
        })
        .catch((error) => console.error("Error updating student:", error));
    } else {
      axios
        .post(`${API_URL}/students`, {
          name,
          course,
          age: Number(age),
        })
        .then(() => {
          resetForm();
          fetchStudents();
        })
        .catch((error) => console.error("Error adding student:", error));
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  };

  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/students/${id}`)
      .then(() => fetchStudents())
      .catch((error) => console.error("Error deleting student:", error));
  };

  const resetForm = () => {
    setName("");
    setCourse("");
    setAge("");
    setEditingId(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Student Management System</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <h3>{editingId ? "Edit Student" : "Add Student"}</h3>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Juan Dela Cruz"
          />
        </div>
        <br />
        <div>
          <label>Course: </label>
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="e.g. BSIT"
          />
        </div>
        <br />
        <div>
          <label>Age: </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 20"
          />
        </div>
        <br />
        <button type="submit">
          {editingId ? "Update Student" : "Add Student"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h2>Students List</h2>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        students.map((student) => (
          <div
            key={student._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Course:</strong> {student.course}</p>
            <p><strong>Age:</strong> {student.age}</p>
            <button onClick={() => handleEdit(student)}>Edit</button>{" "}
            <button onClick={() => handleDelete(student._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;