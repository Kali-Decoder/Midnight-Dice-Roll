const API_URL = "http://localhost:3001/api";

export interface RollResponse {
  rollId: number;
  dieOne: number;
  dieTwo: number;
  total: number;
  txId: string;
}

export async function rollDice(): Promise<RollResponse> {
  const res = await fetch(`${API_URL}/roll`, { method: "POST" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Roll failed");
  }
  return res.json();
}
