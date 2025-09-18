import express from 'express';
import cors from 'cors';
import Replicate from 'replicate';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Transform image endpoint
app.post('/api/transform-image', async (req, res) => {
  try {
    const { image, prompt } = req.body;

    if (!image || !prompt) {
      return res.status(400).json({ error: 'Image and prompt are required' });
    }

    console.log('Starting image transformation...');

    // Use a better model for face transformation
    const output = await replicate.run(
      "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
      {
        input: {
          image: image,
          prompt: prompt,
          num_steps: 30,
          style_strength_ratio: 25,
          num_outputs: 1
        }
      }
    );

    console.log('Transformation completed successfully');
    
    if (output && output.length > 0) {
      res.json({ success: true, imageUrl: output[0] });
    } else {
      res.status(500).json({ error: 'No output generated' });
    }

  } catch (error) {
    console.error('Error transforming image:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to transform image' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});