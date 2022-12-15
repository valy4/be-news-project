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
        expect(body.msg).toEqual("Bad request - invalid id");
      });
  });
  test("responds with a statusCode 404 if the user passes a valid but non-existent end point", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Page not found!");
      });
  });
});
