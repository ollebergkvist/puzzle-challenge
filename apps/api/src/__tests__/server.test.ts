// libs
import supertest from "supertest";
import { createServer } from "../server";

describe("server", () => {
  it("health check returns 200", async () => {
    await supertest(createServer())
      .get("/api/health")
      .expect(200)
      .then((res) => {
        expect(res.body.ok).toBe(true);
      });
  });
});
