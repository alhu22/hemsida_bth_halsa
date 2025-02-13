const request = require("../../../backend/node_modules/supertest");
const express = require("../../../backend/node_modules/express");
const questionRoutes = require("../../../backend/routes/questionsRoutes.js");
const { addRecord, getRecords, getRecordById, updateRecord, deleteRecord } = require("../../../backend/models/questionModel");

const app = express();
app.use(express.json());
app.use("/api", questionRoutes);

jest.mock("../../../backend/models/questionModel");

describe("API Endpoints for Question Database", () => {
    const sampleRecord = { id: 1, question: "Sample Question", answer_formula: "x+1" };
    
    // -------------------------- Test Insertions -----------------------------
    it("should add a new question", async () => {
        addRecord.mockResolvedValue({ id: 1 });
        const res = await request(app).post("/api/question_data/add").send(sampleRecord);
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });
    
    it("should fail to add a question with missing fields", async () => {
        addRecord.mockRejectedValue({ status: 400, message: "Missing required fields" });
        const res = await request(app).post("/api/question_data/add").send({});
        expect(res.status).toBe(400);
    });

    // -------------------------- Test Fetching -----------------------------
    it("should fetch all questions", async () => {
        getRecords.mockResolvedValue([sampleRecord]);
        const res = await request(app).get("/api/question_data/all");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("should fetch a single question by ID", async () => {
        getRecordById.mockResolvedValue(sampleRecord);
        const res = await request(app).get("/api/question_data/1");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("should return 404 for non-existent question", async () => {
        getRecordById.mockRejectedValue({ status: 404, message: "Record not found" });
        const res = await request(app).get("/api/question_data/999");
        expect(res.status).toBe(404);
    });

    // -------------------------- Test Updating -----------------------------
    it("should update an existing question", async () => {
        updateRecord.mockResolvedValue({ message: "Record updated" });
        const res = await request(app).put("/api/question_data/update/1").send({ question: "Updated Question" });
        expect(res.status).toBe(200);
    });

    it("should fail to update a non-existent question", async () => {
        updateRecord.mockRejectedValue({ status: 404, message: "Record not found" });
        const res = await request(app).put("/api/question_data/update/999").send({ question: "Updated" });
        expect(res.status).toBe(404);
    });

    // -------------------------- Test Deleting -----------------------------
    it("should delete a question", async () => {
        deleteRecord.mockResolvedValue({ message: "Record deleted" });
        const res = await request(app).delete("/api/question_data/delete/1");
        expect(res.status).toBe(200);
    });

    it("should prevent deletion if the question is referenced elsewhere", async () => {
        deleteRecord.mockRejectedValue({ status: 400, message: "Cannot delete: Other records reference this entry." });
        const res = await request(app).delete("/api/question_data/delete/1");
        expect(res.status).toBe(400);
    });

    it("should return 404 when deleting a non-existent question", async () => {
        deleteRecord.mockRejectedValue({ status: 404, message: "Record not found" });
        const res = await request(app).delete("/api/question_data/delete/999");
        expect(res.status).toBe(404);
    });
});
