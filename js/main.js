import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const getBalanceButton = document.getElementById("getBalanceButton");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
getBalanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== undefined) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected";
  } else {
    connectButton.innerHTML = "Please install Metamask";
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount} !`);
  if (typeof window.ethereum !== undefined) {
    //provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //signer
    const signer = provider.getSigner();
    //contract  <-  abi + address
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done !");
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  //create a listener for the blockchain
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations.`
      );
      resolve();
    });
  });
}

async function getBalance() {
  if (typeof window.ethereum !== undefined) {
    //provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const balance = await provider.getBalance(contractAddress);
    document.getElementById("balance").innerHTML =
      ethers.utils.formatEther(balance);
  }
}

async function withdraw() {
  if (typeof window.ethereum !== undefined) {
    console.log("Withdrawing..");

    //provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //signer
    const signer = provider.getSigner();
    //contract  <-  abi + address
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done !");
    } catch (error) {
      console.log(error);
    }
  }
}
