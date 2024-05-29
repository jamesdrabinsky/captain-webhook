/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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

export async function getRequestsFromPostgres(binId: string): Promise<any> {
  try {
    const query = `
    SELECT path_name, method, request_id, to_char(created_at, 
    'HH24:MI:SS') || ' ' || to_char(created_at, 'FMMonth DD, YYYY') as created_at FROM request r
    JOIN request_bin b ON b.id = r.requestbin_id
    WHERE b.bin_id = $1;
    `;

    const result = await pool.query(query, [binId]);
    console.log(result.rows);
    return result.rows.map((obj: any) => {
      const { path_name, method, request_id, created_at } = obj;
      return { path: path_name, method, id: request_id, time: created_at };
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

// CREATE DATABASE cpt_webhook_psql OWNER dev_user;
// GRANT ALL PRIVILEGES ON DATABASE
// cpt_webhook_psql TO dev_user;
// Path: http://localhost:3000/bin/XyZ123Abc4567

// app.get('/api/:bin_id', (_, res) => {
//   // logic to get all requests for a specific binId
//   // interacting with postgres to select all requests from request where requestbin_id == binId
//   console.log('path is /api/:bin_id');
//   const requests =
//   // res.json([
//   //   { path: 'google.com', method: 'POST', time: '3:00PM', id: requestId },
//   //   { path: 'stuff.com', method: 'GET', time: '12:00PM', id: requestId },
//   //   { path: 'not.com', method: 'POST', time: '5:00AM', id: requestId },
//   // ]);
// });
