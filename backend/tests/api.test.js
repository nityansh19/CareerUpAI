const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { app } = require("../server");

test("health reports the Supabase migration state without MongoDB", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
  assert.equal(response.body.database, "supabase-migration-pending");
  assert.equal(response.body.version, 3);
  assert.deepEqual(response.body.capabilities, ["api-shell"]);
});

test("legacy online-account routes are disabled during migration", async () => {
  for (const [method, path] of [
    ["post", "/api/users/register"],
    ["post", "/api/users/login"],
    ["get", "/api/users/me"],
    ["put", "/api/users/workspace"],
    ["get", "/api/users/resume"],
  ]) {
    const response = await request(app)[method](path).send({});
    assert.equal(response.status, 503);
    assert.equal(response.body.code, "SUPABASE_MIGRATION_PENDING");
  }
});
