const { expect } = require("chai");
const supertest = require("supertest");

process.env.TZ = "UCT";
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_EXPIRY = "3m";

global.expect = expect;
global.supertest = supertest;

require("dotenv").config();

process.env.TEST_DB_URL =
  process.env.TEST_DB_URL || "postgresql://bugtraxapp@localhost/bugtraxapptest";
