import { useState } from "react";
import axios from "axios";

export default function AddQuestion() {
    const [question_input, setQuestion] = useState("");
    const [answer_input, setAnswer] = useState("");
    const [answer_unit, setAnswerUnit] = useState("");
    const [course_input, setCourse] = useState("");
    const [question_type, setQuestionType] = useState("");
    const [variating_values, setVariatingValues] = useState("");

    const [isSuccess, setIsSuccess] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage("");
        setIsSuccess(false);
        setIsUploading(true);

        try {
            // Post request to upload question
            const response = await axios.post("http://localhost:5000/api/question/add", {
                question: question_input,
                course: course_input,
                question_type: question_type,
                variating_values: variating_values,
                answerFormula: answer_input,
                answerUnit: answer_unit
            });

            setIsSuccess(response.data.success); // Set status of success
            setResponseMessage(response.data.message); // Set message from response
            if (response.data.success) {
                setQuestion("");
                setCourse("");
                setQuestionType("");
                setVariatingValues("");
                setAnswer("");
                setAnswerUnit(""); // Also clear the unit field
            }
        } catch (err) {
            console.error("Error uploading question:", err);
            setIsSuccess(false);
            setResponseMessage(err.response?.data?.message || "Failed to upload data. Please try again.");
        } finally {
            setIsUploading(false);
            setTimeout(() => setResponseMessage(""), 10000); // Hide message after 10 seconds
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
            <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", width: "400px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
                <h2>Add Question</h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <label>Question</label>
                    <input type="text" 
                        value={question_input}
                        onChange={(e) => setQuestion(e.target.value)} 
                        placeholder="Ex. Question %%var_1%%kg rest of question %%var_2%%?"
                        required />

                    {/* Answer and Unit in a Row */}
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <div style={{ flex: 2 }}>
                            <label>Answer</label>
                            <input type="text" 
                                value={answer_input} 
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Ex. var_1 + var_2" 
                                required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Unit</label>
                            <input type="text"
                                value={answer_unit} 
                                onChange={(e) => setAnswerUnit(e.target.value)}
                                placeholder="Ex. kg" />
                        </div>
                    </div>

                    <label>Variating Values (JSON)</label>
                    <input type="text" 
                        value={variating_values} 
                        onChange={(e) => setVariatingValues(e.target.value)}
                        placeholder='Ex. {"var_1": [50,70], "var_2": [10,20]}'
                        required />

                    <label>Course</label>
                    <input type="text" 
                        value={course_input}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="Ex. ab1234"
                        required />

                    <label>Question Type</label>
                    <input type="text" 
                        value={question_type} 
                        onChange={(e) => setQuestionType(e.target.value)}
                        placeholder="Ex. test type A" 
                        required />

                    <button type="submit" disabled={isUploading}
                        style={{ 
                            padding: "10px", 
                            backgroundColor: "#007BFF", 
                            color: "white", 
                            border: "none", 
                            borderRadius: "5px", 
                            cursor: "pointer" }}>
                        Add Question
                    </button>

                    {/* Message about the upload */}
                    {responseMessage && (
                        <p style={{
                            color: isSuccess ? "green" : "red", 
                            marginTop: "10px" }}>
                            {responseMessage}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
