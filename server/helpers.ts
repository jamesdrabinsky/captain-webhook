import { v4 as uuidv4 } from 'uuid'
const { Pool } = require('pg')

// export function createNewBinId(): String {
//   const uuidTest = uuidv4()
//   return uuidTest.split('-').join('').slice(0, 13)
// }

export async function createNewBinId(): Promise<String> {
    while (true) {
        try {
            const uuidTest = uuidv4()
            const binId = uuidTest.split('-').join('').slice(0, 13)
            const query = 'INSERT INTO request_bin (bin_id) VALUES ($1)'
            await pool.query(query, [binId])
            return binId
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Duplicate bin_id', error.message)
              }
        }
    }
} 

export const pool = new Pool({
    user: 'dev_user',
    database: 'cpt_webhook_psql',
    password: 'password',
    port: 5432,
    host: 'localhost',
  });
