import axios from "axios";
import dotenv from "dotenv";
dotenv.config(); // 👈 wajib untuk load .env

export async function getSensorsFromPRTG() {
  const { PRTG_HOST, PRTG_USERNAME, PRTG_PASSHASH } = process.env;

  if (!PRTG_HOST || !PRTG_USERNAME || !PRTG_PASSHASH) {
    throw new Error("❌ PRTG config is missing. Pastikan PRTG_HOST, PRTG_USERNAME, dan PRTG_PASSHASH ada di .env");
  }

  const url = `${PRTG_HOST}/api/table.json?content=sensors&columns=device,sensor,status,lastvalue,lastcheck,message&username=${PRTG_USERNAME}&passhash=${PRTG_PASSHASH}`;

  const response = await axios.get(url);
  return response.data.sensors;
}
