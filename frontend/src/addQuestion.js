import { useState } from "react";
import axios from "axios";

export default function AddQuestion() {
    const [question_input, setQuestion] = useState("");
    const [course_input, setCourse] = useState("");
    const [questionType, setQuestionType] = useState("");
    const [variatingValues, setVariatingValues] = useState("");

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
                question_type: questionType,
                variating_values: variatingValues
            });
    
            setIsSuccess(response.data.success); // Set statuss of success
            setResponseMessage(response.data.message); // Set message from response
            if (isSuccess){
                setQuestion(" ");
                setCourse(" ");
                setQuestionType(" ");
                setVariatingValues(" ");
            }
        } catch (err) {
            console.error("Error uploading question:", err);
            setIsSuccess(false);
            setResponseMessage(err.response?.data?.message || "Failed to upload data. Please try again.");
        } finally {
            setIsUploading(false);
            setTimeout(() => setResponseMessage(""), 10000); // Hide message after 10 second
        }
    };
    
    
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", width: "400px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
                <h2>Add Question</h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <label>Question</label>
                    <input type="text" value={question_input} onChange={(e) => setQuestion(e.target.value)} required />

                    <label>Course</label>
                    <input type="text" value={course_input} onChange={(e) => setCourse(e.target.value)} required />

                    <label>Question Type</label>
                    <input type="text" value={questionType} onChange={(e) => setQuestionType(e.target.value)} required />

                    <label>Variating Values (JSON)</label>
                    <input type="text" value={variatingValues} onChange={(e) => setVariatingValues(e.target.value)} required />

                    <button type="submit" disabled={isUploading}
                        style={{ 
                            padding: "10px", 
                            backgroundColor: "#007BFF", 
                            color: "white", 
                            border: "none", 
                            borderRadius: "5px", 
                            cursor: "pointer" }}
                        >Add Question</button>
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
