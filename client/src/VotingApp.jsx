import { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotingABI from "./artifacts/contracts/Voting.sol/Voting.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace after deploy

export default function VotingApp() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const connect = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());
        const voting = new ethers.Contract(CONTRACT_ADDRESS, VotingABI.abi, signer);
        setContract(voting);
        const fetched = await voting.getCandidates();
        setCandidates(fetched);
      }
    };
    connect();
  }, []);

  const vote = async (index) => {
    await contract.vote(index);
    alert("Vote submitted!");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Blockchain Voting</h1>
      <p>Connected: {account}</p>
      <ul className="mt-4">
        {candidates.map((c, i) => (
          <li key={i} className="mb-2">
            {c.name} — Votes: {c.voteCount.toString()} <button className="ml-2 px-2 py-1 bg-blue-500 text-white rounded" onClick={() => vote(i)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
}