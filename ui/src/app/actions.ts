"use server";

import { exec } from "child_process";
import { promisify } from "util";
import * as path from "path";

const execAsync = promisify(exec);

// Path to the workspace root
const ROOT_DIR = path.resolve(process.cwd(), "..");

async function runCliAction(command: string, args: string = "") {
  try {
    const { stdout } = await execAsync(`npx tsx src/cli-action.ts ${command} ${args}`, {
      cwd: ROOT_DIR,
      timeout: 60000, // 60s timeout to prevent infinite hanging
    });
    
    // Parse the last line of stdout as JSON (in case there are other logs)
    const lines = stdout.trim().split("\n");
    const jsonStr = lines[lines.length - 1];
    
    return JSON.parse(jsonStr);
  } catch (err: any) {
    console.error("CLI Action failed:", err);
    throw new Error("Backend connection failed");
  }
}

export async function backendRoll() {
  const res = await runCliAction("roll");
  if (res.error) throw new Error(res.error);
  return res;
}
