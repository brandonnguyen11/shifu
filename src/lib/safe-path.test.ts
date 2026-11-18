import assert from "node:assert/strict";
import test from "node:test";

import {
  continueTarget,
  destinationFor,
  publicOrigin,
  safeInternalPath,
} from "./safe-path.ts";

const fallback = "/auth/continue";

test("keeps in-app paths, queries, and hashes", () => {
  assert.equal(safeInternalPath("/tutor", fallback), "/tutor");
  assert.equal(
    safeInternalPath("/tutor/students/emma-reyes?tab=notes", fallback),
    "/tutor/students/emma-reyes?tab=notes"
  );
  assert.equal(safeInternalPath("/student/room#next", fallback), "/student/room#next");
});

test("sends unknown roles to the chooser with a workspace return path", () => {
  assert.equal(continueTarget(""), "/auth/continue");
  assert.equal(continueTarget("//example.com"), "/auth/continue");
  assert.equal(
    continueTarget("/tutor/payments"),
    "/auth/continue?next=%2Ftutor%2Fpayments"
  );
  assert.equal(
    destinationFor("/tutor/payments", "tutor"),
    "/tutor/payments"
  );
  assert.equal(destinationFor("/tutor/payments", "student"), "/student/room");
  assert.equal(destinationFor("//example.com", "student"), "/student/room");
});

test("keeps loopback callbacks on the host the browser used", () => {
  assert.equal(
    publicOrigin("http://localhost:3000/auth/callback", "127.0.0.1:3000"),
    "http://127.0.0.1:3000"
  );
  assert.equal(
    publicOrigin("http://localhost:3000/auth/callback", "evil.example"),
    "http://localhost:3000"
  );
  assert.equal(
    publicOrigin("https://app.example.com/auth/callback", "app.example.com"),
    "https://app.example.com"
  );
});

test("rejects off-site and protocol-relative targets", () => {
  for (const value of [
    "//example.com",
    "//example.com/path",
    "https://example.com",
    "http://example.com/tutor",
    "javascript:alert(1)",
    "/\\example.com",
    "\\\\example.com",
    "",
    null,
    undefined,
  ]) {
    assert.equal(safeInternalPath(value, fallback), fallback, String(value));
  }
});
