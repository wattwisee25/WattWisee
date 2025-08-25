import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = 'https://api.deepseek.ai';

export async function processFile(filePath) {
  let fileStream;
  try {
    fileStream = fs.createReadStream(filePath);

    const formData = new FormData();
    formData.append('file', fileStream);

    const response = await axios.post(
      `${DEEPSEEK_BASE_URL}/extract`, // endpoint da confermare
      formData,
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Errore Deepseek:', error.response?.data || error.message);
    throw error;
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}
