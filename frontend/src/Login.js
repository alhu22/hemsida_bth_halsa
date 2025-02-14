import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Adjust if needed

const tables = {
  question_data: ["question", "answer_unit_id", "answer_formula", "variating_values", "course_code", "question_type_id", "hint_id"],
  units: ["ascii_name", "accepted_answer"],
  course: ["course_code", "course_name", "question_types"],
  medicine: ["namn", "fass_link", "skyrkor_doser"],
  qtype: ["name", "history_json"],
};


export default function Login() {
    const [selectedTable, setSelectedTable] = useState("question_data");
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState(null);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${API_BASE_URL}/${selectedTable}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        setMessage(result.message);
      } catch (error) {
        if (message == null) {
          setMessage("Error adding record");
        }
      }
    };

    return (
        <div>
            <h2>Add Record to Database</h2>
            <label>
            Select Table:
            <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
                {Object.keys(tables).map((table) => (
                <option key={table} value={table}>{table}</option>
                ))}
            </select>
            </label>
            <form onSubmit={handleSubmit}>
            {tables[selectedTable].map((field) => (
                <div key={field}>
                <label>{field}: </label>
                <input type="text" name={field} onChange={handleChange} />
                </div>
            ))}
            <button type="submit">Add Record</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}