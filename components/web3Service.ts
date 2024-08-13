import { ethers } from 'ethers';
import MyContractABI from '../store/abi';

const provider = new ethers.JsonRpcProvider('https://opt-sepolia.g.alchemy.com/v2/zW4qCrEs9oi0EQAZsh4JQ8AGp3U20IRi');



const DAO_CONTRACT_ADDRESS = '0xbC55d80915c8b22c48311Ded0944C67ee00c9849';

export const getSigner = async (address: string) => {
    const signer = await provider.getSigner(address);
    return signer;
};


export const getDAOContract = (signer: ethers.Signer) => {
  return new ethers.Contract(DAO_CONTRACT_ADDRESS, MyContractABI, signer);
};


export const createCampaign = async (
    signer: ethers.Signer,
    description: string,
    fundingGoal: bigint,
    deadline: number,
    beneficiary: string
) => {
    const contract = getDAOContract(signer);
    const tx = await contract.createCampaign(description, fundingGoal, deadline, beneficiary);
    await tx.wait();
    return tx.hash;
};

export const contributeToCampaign = async (
  signer: ethers.Signer,
  campaignId: number,
  amount: bigint
) => {
  const contract = getDAOContract(signer);
  const tx = await contract.contribute(campaignId, { value: amount });
  await tx.wait();
  return tx.hash;
};


export const voteOnCampaign = async (
  signer: ethers.Signer,
  campaignId: number,
  support: boolean
) => {
  const contract = getDAOContract(signer);
  const tx = await contract.vote(campaignId, support);
  await tx.wait();
  return tx.hash;
};


export const finalizeCampaign = async (
  signer: ethers.Signer,
  campaignId: number
) => {
  const contract = getDAOContract(signer);
  const tx = await contract.finalizeCampaign(campaignId);
  await tx.wait();
  return tx.hash;
};


export const withdrawContribution = async (
  signer: ethers.Signer,
  campaignId: number
) => {
  const contract = getDAOContract(signer);
  const tx = await contract.withdrawContribution(campaignId);
  await tx.wait();
  return tx.hash;
};


export const getCampaignDetails = async (
  campaignId: number
): Promise<any> => {
  const contract = new ethers.Contract(DAO_CONTRACT_ADDRESS, MyContractABI, provider);
  const campaign = await contract.campaigns(campaignId);
  return campaign;
};
