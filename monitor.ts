import { Alchemy, Network, AlchemySubscription } from "alchemy-sdk";
import dotenv from "dotenv";
import axios from 'axios';

dotenv.config();

const networkEnv = process.env.NETWORK;
let network: Network;
switch (networkEnv) {
  case 'zksync':
      network = Network.ZKSYNC_MAINNET;
      break;
  case 'base':
      network = Network.BASE_MAINNET;
      break;
  default:
      console.error("Invalid NETWORK. Please check the .env file.");
      process.exit(1);
}

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY || "", // Retrieve API key from .env
  network: network,
};

const alchemy = new Alchemy(settings);

// Define the addresses to be monitored
const monitoredAddresses = process.env.MONITORED_ADDRESS;
if(!monitoredAddresses){
  console.error("MONITORED_ADDRESS environment variable is not set");
  process.exit(1);
}

async function sendSlackNotification(tx: any) {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!slackWebhookUrl) {
    console.error("SLACK_WEBHOOK_URL environment variable is not set");
    return;
  }

  try {
    await axios.post(slackWebhookUrl, {
      text: `New Transaction on ${networkEnv}: ${JSON.stringify(tx.hash)}`,
    });
    console.log("Slack notification sent successfully.");
  } catch (error) {
    console.error("Failed to send Slack notification:", error);
  }
}

// Subscribe to mined transactions in Alchemy
alchemy.ws.on(
  {
    method: AlchemySubscription.MINED_TRANSACTIONS,
    addresses: [{from: monitoredAddresses}],
    includeRemoved: true,
    hashesOnly: false,
  },
  async (tx) => {
    console.log("New Transaction:", tx);
    await sendSlackNotification(tx);
  }
);