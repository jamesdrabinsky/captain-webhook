/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const { Pool } = require('pg');
const mongoose = require('mongoose');
const Request = require('./models/requests');
require('dotenv').config();

export const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
  host: 'localhost',
});

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI);

export async function createNewBinId(): Promise<string> {
  while (true) {
    try {
      const uuidTest = uuidv4();
      const binId = uuidTest.split('-').join('').slice(0, 13);
      const query = 'INSERT INTO request_bin (bin_id) VALUES ($1)';
      await pool.query(query, [binId]);
      return binId;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Duplicate bin_id', error.message);
      }
    }
  }
}

// Passed request object, parsed method, path, body, returns id
export async function addToMongo(req: express.Request): Promise<string | void> {
  try {
    const { method, path, url, headers, query, body } = req;
    const request = new Request({
      method,
      path,
      url,
      headers: JSON.stringify(headers),
      query: JSON.stringify(query),
      body: JSON.stringify(body),
    });
    const mongoRequestId = await request.save();
    return String(mongoRequestId._id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

export async function addToPostgres(
  method: string,
  url: string,
  mongoRequestId: string | void,
  binId: string,
  requestId: string,
) {
  try {
    const query = `
    INSERT INTO request (requestbin_id, mongo_key, method, path_name, request_id) 
    VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [binId, mongoRequestId, method, url, requestId]);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}
