import { writeFile } from "fs/promises"
import crypto from 'node:crypto'

function generateRandomString(length: number) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

export const prerender = false

export async function GET() {
    await writeFile('src/rld.ts', `export const rld = '${generateRandomString(16)}'`)
    return new Response('ok')
  }
