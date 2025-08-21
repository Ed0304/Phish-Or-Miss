import dotenv from 'dotenv';
import { SogniClient } from '@sogni-ai/sogni-client';

dotenv.config();

const prompt = process.argv[2];

(async () => {
  try {
    const client = await SogniClient.createInstance({
      appId: process.env.SOGNI_APP_ID,
      network: 'fast',
    });

    await client.account.login(
        process.env.SOGNI_USERNAME,
        process.env.SOGNI_PASSWORD
    );
    

    const models = await client.projects.waitForModels();
    const bestModel = models.reduce((a, b) => (a.workerCount > b.workerCount ? a : b));


    const project = await client.projects.create({
      modelId: bestModel.id,
      positivePrompt: prompt,
      negativePrompt: 'blurry, low quality, distorted',
      stylePrompt: 'cartoon, clean background, close-up face, soft lighting, portrait orientation',
      steps: 25,
      guidance: 7.5,
      numberOfImages: 1,
      tokenType : 'spark'
    });

    // ✅ Track progress (optional)
    project.on('progress', (progress) => {
      console.log(`Progress: ${progress}%`);
    });

    // ✅ Wait for result
    const imageUrls = await project.waitForCompletion();

    // ✅ Output JSON to Flask
    console.log(JSON.stringify({ images: imageUrls }));
    process.exit(0);

  } catch (err) {
    console.error("Sogni error:", err.message || err);
    process.exit(1);
  }
})();
