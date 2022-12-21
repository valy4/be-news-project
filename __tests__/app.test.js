const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
require("jest-sorted");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("3. GET /api/topics", () => {
  test("the URL to respond with status 200 and the response object to contain an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("if the user passes an incorrect path it responds with 404 error", () => {
    return request(app)
      .get("/api/top")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page not found!");
      });
  });
});
describe("4.GET /api/articles", () => {
  test("responds with statusCode 200 and also if the response contains an object with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(5);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("responds with statusCode 404 if the user passes an incorrect path", () => {
    return request(app)
      .get("/api/arts")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page not found!");
      });
  });
  test("responds with statusCode 200 if the response is sorted by date(created_at) in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("5.GET /api/articles/:article_id", () => {
  test("responds with statusCode 200 and the response contains an article object ", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(2);
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("responds with a statusCode 400 if the user passes an invalid end point", () => {
    return request(app)
      .get("/api/articles/votes")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
  test("responds with a statusCode 404 if the user passes a valid but non-existent end point", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Article not found");
      });
  });
});
describe("6.GET /api/articles/:article_id/comments", () => {
  test("responds with statusCode 200 and the response contains an array of comments", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(2);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("responds with statusCode 200 if the user exists but there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("responds with statusCode 404 if the user passes an incorrect path", () => {
    return request(app)
      .get("/api/articles/3/comm")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page not found!");
      });
  });
  test("responds with statusCode 400 if the user passes an incorrect id", () => {
    return request(app)
      .get("/api/articles/art3/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("responds with statusCode 404 if the user passes a valid id but non existent", () => {
    return request(app)
      .get("/api/articles/3300/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});
describe("7.POST/api/articles/:article_id/comments", () => {
  test("responds with statusCode 201 and responds with the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "hjhgfhjf",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 19,
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "hjhgfhjf",
        });
      });
  });
  test("responds with statusCode 201 and ingnores if the user sends extra propeties in the body", () => {
    const newComment = {
      username: "butter_bridge",
      body: "A brand new comment.",
      isBestComment: "true",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 19,
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "A brand new comment.",
        });
      });
  });
  test("responds with statusCode 400 if the user sends no body", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("No Body");
      });
  });
  test("responds with statusCode 404 if the user sends a valid username but non-existent", () => {
    const newComment = {
      username: "butter_br",
      body: "hdgjhkhk",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("responds with statusCode 400 if the user sends an invalid article_id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "hdgjhkhk",
    };
    return request(app)
      .post("/api/articles/bannna/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("responds with statusCode 404 if the user sends a valid id but non-existent", () => {
    const newComment = {
      username: "butter_bridge",
      body: "hdgjhkhk",
    };
    return request(app)
      .post("/api/articles/33003/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
describe("8.PATCH /api/articles/:article_id" , () => {
  test("responds with status 200 and the response object contains the updated article", () => {
    const newArticle = {
      inc_votes: 30
    }
    return request(app)
    .patch('/api/articles/1')
    .send(newArticle)
    .expect(200)
    .then(({body}) => {
      const {article} = body
      expect(article).toMatchObject({
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: 130,
      })
    })
  })
  test("responds with status 400 if user passes incorrect number", () => {
    const newArticle = {
      inc_votes: "number"
    }
    return request(app)
    .patch('/api/articles/3')
    .send(newArticle)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
  })
  test("responds with status 400 if user passes incorrect property", () => {
    const newArticle = {
      inc_vot: 30
    }
    return request(app)
    .patch('/api/articles/3')
    .send(newArticle)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("No Body");
    });
  })
})
test("responds with statusCode 400 if the user sends an invalid article_id", () => {
  const newArticle = {
    inc_votes: 30
  }
  return request(app)
    .patch("/api/articles/bannna")
    .send(newArticle)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request");
    });
});
test("responds with statusCode 404 if the user sends a valid but non-existent article_id", () => {
  const newArticle = {
    inc_votes: 30
  }
  return request(app)
    .patch("/api/articles/3303")
    .send(newArticle)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found");
    });
});