const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("3. GET /api/topics", () => {
  test("the URL to respond with status 200 and the response object to contain an array of topics", () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(3);
        body.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("if the user passes an incorrect path it responds with 404 error", () =>{
    return request (app)
    .get('/api/top')
    .expect(404)
    .then(({body}) => {
            expect(body.msg).toBe("Page not found!")
    })
  })
});
