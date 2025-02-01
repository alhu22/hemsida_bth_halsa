import { useState } from "react";
import { toast } from "react-hot-toast";

export default function AddQuestion() {
    const [question, setQuestion] = useState("");
    const [course, setCourse] = useState("");
    const [questionType, setQuestionType] = useState("");
    const [variatingValues, setVariatingValues] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/question/add", {
                question,
                course,
                question_type: questionType,
                variating_values: variatingValues,
            });
            
            const data = await response.json();
            if (data.success) {
                toast.success("Question added successfully!");
                setQuestion("");
                setCourse("");
                setQuestionType("");
                setVariatingValues("");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to add question");
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", width: "400px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
                <h2>Add Question</h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <label>Question</label>
                    <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />

                    <label>Course</label>
                    <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} required />

                    <label>Question Type</label>
                    <input type="text" value={questionType} onChange={(e) => setQuestionType(e.target.value)} required />

                    <label>Variating Values (JSON)</label>
                    <input type="text" value={variatingValues} onChange={(e) => setVariatingValues(e.target.value)} required />

                    <button type="submit" style={{ padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Add Question</button>
                </form>
            </div>
        </div>
    );
}
