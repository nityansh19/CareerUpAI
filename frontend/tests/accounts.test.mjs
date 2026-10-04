import test from "node:test";
import assert from "node:assert/strict";
import * as module from "../src/auth/localAccount.js";
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => store.get(k) || null,
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
test("device accounts stay separate and registration starts empty", async () => {
  const first = await module.createLocalDemoAccount({
    name: "Test One",
    email: "ONE@example.com",
    password: "test-password-one",
  });
  assert.deepEqual(first.skills, []);
  assert.equal(first.resumeAnalysis, null);
  assert.equal(first.email, "one@example.com");
  assert.ok(!JSON.stringify([...store.values()]).includes("test-password-one"));
  const second = await module.createLocalDemoAccount({
    name: "Test Two",
    email: "two@example.com",
    password: "test-password-two",
  });
  assert.notEqual(first.id, second.id);
  assert.equal(
    (
      await module.authenticateLocalDemoAccount(
        "one@example.com",
        "test-password-one",
      )
    ).id,
    first.id,
  );
  assert.equal(
    (
      await module.authenticateLocalDemoAccount(
        "two@example.com",
        "test-password-two",
      )
    ).id,
    second.id,
  );
});
test("login rejects unknown accounts and wrong passwords instead of creating users", async () => {
  const size = store.size;
  await assert.rejects(
    module.authenticateLocalDemoAccount("missing@example.com", "anything-123"),
    /No account/,
  );
  assert.equal(store.size, size);
  await assert.rejects(
    module.authenticateLocalDemoAccount(
      "one@example.com",
      "incorrect-password",
    ),
    /incorrect/,
  );
});
test("duplicate emails and short passwords are rejected", async () => {
  await assert.rejects(
    module.createLocalDemoAccount({
      name: "Again",
      email: "ONE@EXAMPLE.COM",
      password: "password-123",
    }),
    /already exists/,
  );
  await assert.rejects(
    module.createLocalDemoAccount({
      name: "Short",
      email: "short@example.com",
      password: "short",
    }),
    /8–128/,
  );
});
