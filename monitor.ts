import { config } from 'dotenv';
import { ethers } from 'ethers';
import axios from 'axios';

// Load environment variables from .env file
config();

// Destructure environment variables
const { RPC_URL, MONITORED_ADDRESS, SLACK_WEBHOOK_URL } = process.env;

if (!RPC_URL || !MONITORED_ADDRESS || !SLACK_WEBHOOK_URL) {
  console.error('Please set RPC_URL, MONITORED_ADDRESS, and SLACK_WEBHOOK_URL in your .env file.');
  process.exit(1);
}

// Initialize provider
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// Normalize the monitored address
const monitoredAddress = MONITORED_ADDRESS.toLowerCase();

// Function to send Slack notification
const sendSlackNotification = async (tx: ethers.providers.TransactionResponse) => {
  const message = {
    text: `🚀 *New Transaction Detected*\n*From:* ${tx.from}\n*To:* ${tx.to}\n*Hash:* <https://explorer.url/tx/${tx.hash}|View Transaction>\n*Value:* ${ethers.utils.formatEther(tx.value)} ETH`,
  };

  try {
    await axios.post(SLACK_WEBHOOK_URL!, message);
    console.log(`Notification sent for transaction: ${tx.hash}`);
  } catch (error) {
    console.error('Error sending Slack notification:', error);
  }
};

// Listen for new transactions
provider.on('pending', async (txHash) => {
  try {
    const tx = await provider.getTransaction(txHash);
    if (tx && tx.from && tx.from.toLowerCase() === monitoredAddress) {
      await sendSlackNotification(tx);
    }
  } catch (error) {
    console.error(`Error processing transaction ${txHash}:`, error);
  }
});

console.log(`Monitoring transactions from address: ${MONITORED_ADDRESS} on ${RPC_URL}`);
