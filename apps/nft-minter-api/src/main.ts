/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import dotenv from "dotenv"
import { Readable } from 'stream';
import cors from 'cors';
import axios from 'axios';
import Multer from 'multer';
import PinataClient from '@pinata/sdk';
import { ethers, EventLog} from 'ethers';
import ERC721AbiJSON from './abis/ERC721.abi.json';

const startBlock = 6144338;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC721AbiJSON, provider);
const eventFilter = contract.filters.Transfer;

const ownersTokensMap = {};

const moveToken = (from: string, to: string, tokenId: number) => {
  if (from !== ethers.ZeroAddress) {
    ownersTokensMap[from] = ownersTokensMap[from].filter((id: number) => id !== Number(tokenId));
  }

  ownersTokensMap[to] = ownersTokensMap[to] ? [...ownersTokensMap[to], Number(tokenId)] : [Number(tokenId)];
}

contract.queryFilter(eventFilter, startBlock).then(
  (events) => {
    events.forEach((event: EventLog) => {
      const { from, to, tokenId } = event.args;

      moveToken(from, to, tokenId);
      console.log(ownersTokensMap);
    });
  }
);

contract.on(eventFilter, (from, to, tokenId) => {
  console.log(`${ from } => ${ to }: ${ tokenId }`);

  moveToken(from, to, tokenId);

  console.log(ownersTokensMap);
});

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

app.get('/owners/:address/tokens/metadata', async (req, res) => {
  const { address } = req.params;

  const tokensIds = ownersTokensMap[address] || [];

  const tokensUris = await Promise.all(tokensIds.map((id: number) => contract.tokenURI(id)));

  const responses = await Promise.allSettled(tokensUris.map(async (uri: string) => axios.get(uri)));

  const tokens = responses
    .map((response, i) => (
      response.status === 'fulfilled'
        ? { id: tokensIds[i], metadata: response.value.data }
        : null
      )
    )
    .filter((data) => data !== null);

  res.json({ tokens });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
