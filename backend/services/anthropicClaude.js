import fs from 'fs';
import { Anthropic } from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function queryClaudeWithImage(imgPath, prompt) {
  if (!fs.existsSync(imgPath)) throw new Error(`File not found: ${imgPath}`);
  const imageData = fs.readFileSync(imgPath, { encoding: 'base64' });

  const response = await client.completions.create({
    model: 'claude-v1',
    prompt: `${prompt}\n[IMAGE_BASE64]:${imageData}`,
    max_tokens_to_sample: 1000,
    temperature: 0.3,
  });

  return response.completion || '';
}
