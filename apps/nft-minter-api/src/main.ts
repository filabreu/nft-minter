/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import dotenv from "dotenv"
import { Readable } from 'stream';
import cors from 'cors';
import Multer from 'multer';
import PinataClient from '@pinata/sdk';

dotenv.config();

const upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/healthcheck', (_, res) => {
  res.send('ok');
});

app.post('/file', upload.single('file'), async (req, res) => {
  const fileStream = Readable.from(req.file.buffer);
  const pinata = new PinataClient({ pinataJWTKey: process.env.PINATA_JWT_KEY });

  const pinataResult = await pinata.pinFileToIPFS(fileStream, {
    pinataMetadata: {
      name: req.file.originalname,
    },
  });

  res.json({
    fileUrl: `https://gateway.pinata.cloud/ipfs/${pinataResult.IpfsHash}`,
  });
})

app.post('/token-uri', async (req, res) => {
  const pinata = new PinataClient({ pinataJWTKey: process.env.PINATA_JWT_KEY });

  const pinataResult = await pinata.pinJSONToIPFS({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
  });

  res.json({
    tokenURI: `https://gateway.pinata.cloud/ipfs/${pinataResult.IpfsHash}`,
  });
})

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
