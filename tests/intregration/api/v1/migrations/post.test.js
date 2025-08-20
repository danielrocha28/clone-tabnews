import database from "infra/database";
import orcherstrator from "tests/orcherstrator";

beforeAll(async () => {
  await orcherstrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response1 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response1.status).toBe(201);

        const respondeBody1 = await response1.json();

        expect(Array.isArray(respondeBody1)).toBe(true);
        expect(respondeBody1.length).toBeGreaterThan(0);
      });

      test("For the second time", async () => {
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response2.status).toBe(200);

        const respondeBody2 = await response2.json();

        expect(Array.isArray(respondeBody2)).toBe(true);
        expect(respondeBody2.length).toBe(0);
      });
    });
  });
});
