const request = require("../../../backend/node_modules/supertest");
const express = require("../../../backend/node_modules/express");
const questionRoutes = require("../../../backend/routes/questionsRoutes.js");
const { addRecord, getRecords, getRecordById, updateRecord, deleteRecord } = require("../../../backend/models/questionModel");

const app = express();
app.use(express.json());
app.use("/api", questionRoutes);

jest.mock("../../../backend/models/questionModel");

describe("API Endpoints for Database Tables", () => {
    const sampleRecords = {
        question_data: {
            question: "Sample Question",
            answer_unit_id: 1,
            answer_formula: "x+1",
            variating_values: "{\"x\": 2}",
            course_code: "CS101",
            question_type_id: 1,
            hint_id: 1
        },
        units: {
            ascii_name: "unit_name",
            accepted_answer: "valid answer"
        },
        course: {
            course_code: "CS101",
            course_name: "Computer Science",
            question_types: "[1,2]"
        },
        medicine: {
            namn: "Aspirin",
            fass_link: "http://fass.se/aspirin",
            skyrkor_doser: "{\"dose\": 500}"
        },
        qtype: {
            name: "Multiple Choice",
            history_json: "{\"attempts\": 5}"
        }
    };

    Object.keys(sampleRecords).forEach(table => {
        describe(`Testing ${table} Table`, () => {
            // -------------------------- Test Insertions -----------------------------
            it(`should add a new record to ${table}`, async () => {
                addRecord.mockResolvedValue({ id: 1 });
                const res = await request(app).post(`/api/${table}/add`).send(sampleRecords[table]);
                expect(res.status).toBe(201);
                expect(res.body.success).toBe(true);
            });

            it(`should fail to add a record with missing required fields to ${table}`, async () => {
                addRecord.mockRejectedValue({ status: 400, message: "Missing required fields" });
                const res = await request(app).post(`/api/${table}/add`).send({});
                expect(res.status).toBe(400);
            });

            if (["question_data", "medicine", "qtype"].includes(table)) {
                it(`should fail if JSON column is invalid in ${table}`, async () => {
                    addRecord.mockRejectedValue({ status: 400, message: "Invalid JSON format" });
                    const invalidRecord = { ...sampleRecords[table], variating_values: "invalid json" };
                    const res = await request(app).post(`/api/${table}/add`).send(invalidRecord);
                    expect(res.status).toBe(400);
                });
            }

            // -------------------------- Test Fetching -----------------------------
            it(`should fetch all records from ${table}`, async () => {
                getRecords.mockResolvedValue([sampleRecords[table]]);
                const res = await request(app).get(`/api/${table}/all`);
                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
            });

            it(`should fetch a single record by ID from ${table}`, async () => {
                getRecordById.mockResolvedValue(sampleRecords[table]);
                const res = await request(app).get(`/api/${table}/1`);
                expect(res.status).toBe(200);
                expect(res.body.success).toBe(true);
            });

            // -------------------------- Test Updating -----------------------------
            it(`should update an existing record in ${table}`, async () => {
                updateRecord.mockResolvedValue({ message: "Record updated" });
                const res = await request(app).put(`/api/${table}/update/1`).send(sampleRecords[table]);
                expect(res.status).toBe(200);
            });

            it(`should fail to update a non-existent record in ${table}`, async () => {
                updateRecord.mockRejectedValue({ status: 404, message: "Record not found" });
                const res = await request(app).put(`/api/${table}/update/999`).send(sampleRecords[table]);
                expect(res.status).toBe(404);
            });

            // -------------------------- Test Deleting -----------------------------
            it(`should delete a record from ${table}`, async () => {
                deleteRecord.mockResolvedValue({ message: "Record deleted" });
                const res = await request(app).delete(`/api/${table}/delete/1`);
                expect(res.status).toBe(200);
            });

            it(`should prevent deletion if a record in ${table} is referenced elsewhere`, async () => {
                deleteRecord.mockRejectedValue({ status: 400, message: "Cannot delete: Other records reference this entry." });
                const res = await request(app).delete(`/api/${table}/delete/1`);
                expect(res.status).toBe(400);
            });

            it(`should return 404 when deleting a non-existent record from ${table}`, async () => {
                deleteRecord.mockRejectedValue({ status: 404, message: "Record not found" });
                const res = await request(app).delete(`/api/${table}/delete/999`);
                expect(res.status).toBe(404);
            });
        });
    });
});
