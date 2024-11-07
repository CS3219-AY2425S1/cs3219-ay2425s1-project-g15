import { app, server } from "../server";
import * as db from "./db";
import supertest from "supertest";
const request = supertest(app);

// Connect to DB and test /api/
describe("Connect DB", () => {
  beforeAll(async () => {
    await db.connect();
  });

  test("GET - /api/", async () => {
    const res = await request.get("/api/").send();
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello from question service!");
  });
});

// Test /api/create
describe("Test Question API", () => {
  // Valid create
  test("POST /api/create - should create a new question", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "This is a sample question",
      category: ["General"],
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Question created successfully");
    expect(res.body.question).toHaveProperty("title", "Sample Question");
    expect(res.body.question).toHaveProperty(
      "description",
      "This is a sample question"
    );
    expect(res.body.question).toHaveProperty("category", ["General"]);
    expect(res.body.question).toHaveProperty("complexity", "Easy");
  });

  // Empty title
  test("POST /api/create - empty title", async () => {
    const newQuestion = {
      title: "",
      description: "This is a sample question",
      category: ["General"],
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
    expect(res.body.errors[0].path).toBe("title");
  });

  // Empty description
  test("POST /api/create - empty description", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "",
      category: ["General"],
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
    expect(res.body.errors[0].path).toBe("description");
  });

  // Empty category
  test("POST /api/create - empty category", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "This is a sample question",
      category: [],
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Category must be a non-empty array");
    expect(res.body.errors[0].path).toBe("category");
  });

  // Empty category with whitespace only
  test("POST /api/create - empty category with whitespace string", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "This is a sample question",
      category: ["   "],
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe(
      "Category must contain only non-empty strings"
    );
    expect(res.body.errors[0].path).toBe("category");
  });

  // Empty complexity
  test("POST /api/create - empty complexity", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "This is a sample question",
      category: ["General"],
      complexity: "",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
    expect(res.body.errors[0].path).toBe("complexity");
  });

  // Invalid title
  test("POST /api/create - invalid title", async () => {
    const newQuestion = {
      title: ["test"],
      description: "This is a sample question",
      category: "General",
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
    expect(res.body.errors[0].path).toBe("title");
  });

  // Invalid description
  test("POST /api/create - invalid description", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: ["test"],
      category: ["General"],
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
    expect(res.body.errors[0].path).toBe("description");
  });

  // Invalid category
  test("POST /api/create - invalid category", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "This is a sample question",
      category: "test",
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Category must be a non-empty array");
    expect(res.body.errors[0].path).toBe("category");
  });

  // Invalid category
  test("POST /api/create - invalid category", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "This is a sample question",
      category: [3, "test"],
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe(
      "Category must contain only non-empty strings"
    );
    expect(res.body.errors[0].path).toBe("category");
  });

  // Invalid category
  test("POST /api/create - invalid category", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "This is a sample question",
      category: ["test", ""],
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe(
      "Category must contain only non-empty strings"
    );
    expect(res.body.errors[0].path).toBe("category");
  });

  // Invalid category
  test("POST /api/create - invalid category with whitespace", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "This is a sample question",
      category: ["   "],
      complexity: "Easy",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe(
      "Category must contain only non-empty strings"
    );
    expect(res.body.errors[0].path).toBe("category");
  });

  // Invalid complexity
  test("POST /api/create - invalid complexity", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "This is a sample question",
      category: ["General"],
      complexity: ["test"],
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
    expect(res.body.errors[0].path).toBe("complexity");
  });

  // Duplicate question
  test("POST /api/create - duplicate question", async () => {
    const newQuestion = {
      title: "Sample Question",
      description: "This is a sample question",
      category: ["General"],
      complexity: "test",
    };

    const res = await request.post("/api/create").send(newQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("A question with this title already exists");
  });
});

// Test /api/all
describe("Test Get All", () => {
  // Get all with questions
  test("POST /api/all - should retrieve all questions", async () => {
    const res = await request.post("/api/all").send();
    const sampleQuestion = res.body.questions[0];
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.questions)).toBe(true);
    expect(res.body.questions.length).toBe(1);
    expect(res.body.currentPage).toBe(1);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.totalQuestions).toBe(1);
    expect(sampleQuestion).toHaveProperty("title", "Sample Question");
    expect(sampleQuestion).toHaveProperty(
      "description",
      "This is a sample question"
    );
    expect(sampleQuestion).toHaveProperty("category", ["General"]);
    expect(sampleQuestion).toHaveProperty("complexity", "Easy");
  });

  test("POST /api/all - filter questions", async () => {
    const searchQuestionTitle = {
      title: "Sample Question",
    };

    const searchQuestionComplexity = {
      complexity: ["Hard"],
    };

    const searchQuestionCategory = {
      category: ["Dynamic Programming"],
    };

    const newQuestion = {
      title: "Another Question",
      description: "This is another sample question",
      category: ["Dynamic Programming"],
      complexity: "Hard",
    };
    await request.post("/api/create").send(newQuestion);
    const res = await request.post("/api/all").send(searchQuestionTitle);
    const sampleQuestion = res.body.questions[0];
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.questions)).toBe(true);
    expect(res.body.questions.length).toBe(1);
    expect(res.body.currentPage).toBe(1);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.totalQuestions).toBe(1);
    expect(sampleQuestion).toHaveProperty("title", "Sample Question");
    expect(sampleQuestion).toHaveProperty(
      "description",
      "This is a sample question"
    );
    expect(sampleQuestion).toHaveProperty("category", ["General"]);
    expect(sampleQuestion).toHaveProperty("complexity", "Easy");

    const res2 = await request.post("/api/all").send(searchQuestionComplexity);
    const sampleQuestion2 = res2.body.questions[0];
    expect(res2.statusCode).toBe(200);
    expect(Array.isArray(res2.body.questions)).toBe(true);
    expect(res2.body.questions.length).toBe(1);
    expect(res2.body.currentPage).toBe(1);
    expect(res2.body.totalPages).toBe(1);
    expect(res2.body.totalQuestions).toBe(1);
    expect(sampleQuestion2).toHaveProperty("title", "Another Question");
    expect(sampleQuestion2).toHaveProperty(
      "description",
      "This is another sample question"
    );
    expect(sampleQuestion2).toHaveProperty("category", ["Dynamic Programming"]);
    expect(sampleQuestion2).toHaveProperty("complexity", "Hard");

    const res3 = await request.post("/api/all").send(searchQuestionCategory);
    const sampleQuestion3 = res3.body.questions[0];
    expect(res3.statusCode).toBe(200);
    expect(Array.isArray(res3.body.questions)).toBe(true);
    expect(res3.body.questions.length).toBe(1);
    expect(res3.body.currentPage).toBe(1);
    expect(res3.body.totalPages).toBe(1);
    expect(res3.body.totalQuestions).toBe(1);
    expect(sampleQuestion3).toHaveProperty("title", "Another Question");
    expect(sampleQuestion3).toHaveProperty(
      "description",
      "This is another sample question"
    );
    expect(sampleQuestion3).toHaveProperty("category", ["Dynamic Programming"]);
    expect(sampleQuestion3).toHaveProperty("complexity", "Hard");
  });

  test("POST /api/all - No questions found", async () => {
    const searchQuestionTitle = {
      title: "Sample Question that doesn't exist",
    };

    const searchQuestionComplexity = {
      complexity: ["Do not exist"],
    };

    const searchQuestionCategory = {
      category: ["Do not exist"],
    };

    const res = await request.post("/api/all").send(searchQuestionTitle);
    const res2 = await request.post("/api/all").send(searchQuestionComplexity);
    const res3 = await request.post("/api/all").send(searchQuestionCategory);
    expect(res.statusCode).toBe(200);
    expect(res.body.questions.length).toBe(0);
    expect(res.body.totalPages).toBe(0);
    expect(res.body.totalQuestions).toBe(0);

    expect(res2.statusCode).toBe(200);
    expect(res2.body.questions.length).toBe(0);
    expect(res2.body.totalPages).toBe(0);
    expect(res2.body.totalQuestions).toBe(0);

    expect(res3.statusCode).toBe(200);
    expect(res3.body.questions.length).toBe(0);
    expect(res3.body.totalPages).toBe(0);
    expect(res3.body.totalQuestions).toBe(0);
  });
});

// Test /api/count-question
describe("Test count question", () => {
  // Valid count question
  test("POST - count question", async () => {
    const countQuestionFilter = {
      complexity: ["Hard"],
      category: ["Dynamic Programming"],
    };
    const res = await request
      .post(`/api/count-question`)
      .send(countQuestionFilter);
    const sampleCount = res.body.counts[0];
    expect(res.statusCode).toBe(200);
    expect(sampleCount).toBe(1);
  });

  // No question exists
  test("POST - count question - none", async () => {
    const countQuestionFilter = {
      complexity: ["Medium"],
      category: ["Dynamic Programming"],
    };
    const res = await request
      .post(`/api/count-question`)
      .send(countQuestionFilter);
    const sampleCount = res.body.counts[0];
    expect(res.statusCode).toBe(200);
    expect(sampleCount).toBe(0);
  });

  // Batch read
  test("POST - count question - batch read", async () => {
    const countQuestionFilter = {
      complexity: ["Hard", "Easy"],
      category: ["Dynamic Programming", "General"],
    };
    const res = await request
      .post(`/api/count-question`)
      .send(countQuestionFilter);
    const sampleCount = res.body.counts;
    expect(sampleCount.length).toBe(2);
    expect(res.statusCode).toBe(200);
    expect(sampleCount[0]).toBe(1);
    expect(sampleCount[1]).toBe(1);
  });
});

// Test /api/pick-question
describe("Test pick question", () => {
  // Valid pick question
  test("POST - pick question", async () => {
    const pickQuestionFilter = {
      complexity: "Hard",
      category: "Dynamic Programming",
    };
    const res = await request
      .post(`/api/pick-question`)
      .send(pickQuestionFilter);
    const sampleQuestion = res.body;
    expect(res.statusCode).toBe(200);
    expect(sampleQuestion).toHaveProperty("questionid", 1091);
  });

  test("POST - pick another question", async () => {
    const pickQuestionFilter = {
      complexity: "Easy",
      category: "General",
    };
    const res = await request
      .post(`/api/pick-question`)
      .send(pickQuestionFilter);
    const sampleQuestion = res.body;
    expect(res.statusCode).toBe(200);
    expect(sampleQuestion).toHaveProperty("questionid", 1090);
  });

  // No question exists
  test("POST - pick question that doesn't exist", async () => {
    const pickQuestionFilter = {
      complexity: "Medium",
      category: "General",
    };
    const res = await request
      .post(`/api/pick-question`)
      .send(pickQuestionFilter);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("No questions found");
  });

  // Empty complexity
  test("POST - empty complexity", async () => {
    const pickQuestionFilter = {
      complexity: "",
      category: "General",
    };
    const res = await request
      .post(`/api/pick-question`)
      .send(pickQuestionFilter);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
  });

  // Empty category
  test("POST - empty category", async () => {
    const pickQuestionFilter = {
      complexity: "Easy",
      category: "",
    };
    const res = await request
      .post(`/api/pick-question`)
      .send(pickQuestionFilter);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
  });

  // Valid pick question - deleted question
  test("POST - pick question - deleted question if no non-deleted exists", async () => {
    const pickQuestionFilter = {
      complexity: "Hard",
      category: "Dynamic Programming",
    };
    const questionId = 1091; // We start with id 1091

    await request.post(`/api/${questionId}/delete`);
    const res = await request
      .post(`/api/pick-question`)
      .send(pickQuestionFilter);
    const sampleQuestion = res.body;
    expect(res.statusCode).toBe(200);
    expect(sampleQuestion).toHaveProperty("questionid", 1091);
  });
});

// Test /api/{id}
describe("Test Get by Id", () => {
  // Valid id
  test("GET /api/:id - valid id", async () => {
    const questionId = 1090; // We start with id 1090
    const res = await request.get(`/api/${questionId}`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("questionid", questionId);
    expect(res.body).toHaveProperty("title", "Sample Question");
    expect(res.body).toHaveProperty("description", "This is a sample question");
    expect(res.body).toHaveProperty("category", ["General"]);
    expect(res.body).toHaveProperty("complexity", "Easy");
  });

  // Negative id
  test("GET /api/:id - negative id", async () => {
    const questionId = -1;
    const res = await request.get(`/api/${questionId}`).send();
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
  });

  // Non-existent id
  test("GET /api/:id - non existent id", async () => {
    const questionId = 999999;
    const res = await request.get(`/api/${questionId}`).send();
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Question not found");
  });
});

// Test /api/{id}/update
describe("Test Update", () => {
  // Valid update
  test("POST - valid update", async () => {
    const updateQuestion = {
      title: "Update Title",
      description: "Update Description",
      category: ["Update Category"],
      complexity: "Update Complexity",
    };
    const questionId = 1090;
    const res = await request
      .post(`/api/${questionId}/update`)
      .send(updateQuestion);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("questionid", questionId);
    expect(res.body).toHaveProperty("title", updateQuestion.title);
    expect(res.body).toHaveProperty("description", updateQuestion.description);
    expect(res.body).toHaveProperty("category", updateQuestion.category);
    expect(res.body).toHaveProperty("complexity", updateQuestion.complexity);
  });

  // Empty update
  test("POST - empty title update", async () => {
    const updateQuestion = {
      title: 3,
    };
    const questionId = 1090;
    const res = await request
      .post(`/api/${questionId}/update`)
      .send(updateQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Field must be a string");
  });

  // Empty field update
  test("POST - empty update", async () => {
    const updateQuestion = {
      title: "",
      description: "",
      category: "",
      complexity: "",
    };
    const questionId = 1090;
    const res = await request
      .post(`/api/${questionId}/update`)
      .send(updateQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("At least one field must be provided");
  });

  // Update with invalid category
  test("POST - empty category", async () => {
    const updateQuestion = {
      category: [],
    };
    const questionId = 1090;
    const res = await request
      .post(`/api/${questionId}/update`)
      .send(updateQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Category must be a non-empty array");
  });

  // Update with invalid category
  test("POST - category containing numbers", async () => {
    const updateQuestion = {
      category: [3],
      complexity: ["test"],
    };
    const questionId = 1090;
    const res = await request
      .post(`/api/${questionId}/update`)
      .send(updateQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe(
      "Category must contain only non-empty strings"
    );
  });

  // Update with invalid category
  test("POST - category containing empty string", async () => {
    const updateQuestion = {
      description: "This is a sample question",
      category: ["test", ""],
      complexity: ["test"],
    };
    const questionId = 1090;
    const res = await request
      .post(`/api/${questionId}/update`)
      .send(updateQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe(
      "Category must contain only non-empty strings"
    );
  });

  // Negative id
  test("POST - negative id update", async () => {
    const updateQuestion = {
      title: "Update Title Again",
      description: "Update Description",
      category: ["Update Category"],
      complexity: "Update Complexity",
    };
    const questionId = -1;
    const res = await request
      .post(`/api/${questionId}/update`)
      .send(updateQuestion);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Question not found");
  });

  // Non-existent id
  test("POST - non-existent id update", async () => {
    const updateQuestion = {
      title: "Update Title Again",
      description: "Update Description",
      category: ["Update Category"],
      complexity: "Update Complexity",
    };
    const questionId = 999999;
    const res = await request
      .post(`/api/${questionId}/update`)
      .send(updateQuestion);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Question not found");
  });

  // Duplicate question
  test("POST - non-existent id update", async () => {
    const updateQuestion = {
      title: "Update Title",
      description: "Update Description",
      category: ["Update Category"],
      complexity: "Update Complexity",
    };
    const questionId = 1;
    const res = await request
      .post(`/api/${questionId}/update`)
      .send(updateQuestion);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("A question with this title already exists");
  });
});

// Test /api/{id}/delete
describe("Test Delete", () => {
  // Valid delete
  test("POST - valid delete", async () => {
    const questionId = 1090;
    const res = await request.post(`/api/${questionId}/delete`).send();
    expect(res.statusCode).toBe(200);
    const deleteRes = await request.get(`/api/${questionId}`).send();
    expect(deleteRes.statusCode).toBe(200);
    const question = deleteRes.body;
    expect(question.deleted).toBe(true);
  });

  // Negative id
  test("POST - negative id delete", async () => {
    const questionId = -1;
    const res = await request.post(`/api/${questionId}/delete`).send();
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid value");
  });

  // Non-existent id
  test("POST - non-existent id delete", async () => {
    const questionId = 999999;
    const res = await request.post(`/api/${questionId}/delete`).send();
    expect(res.statusCode).toBe(404);
    expect(res.body).toBe("Document not found");
  });
});

afterAll(async () => {
  await db.clearDatabase();
  await db.closeDatabase();
  server.close();
});
