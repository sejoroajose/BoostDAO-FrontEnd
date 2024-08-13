import { useState } from 'react';
import { parseEther } from 'ethers';
import { ethers } from 'ethers';
import * as web3Service from '../components/web3Service';
import styles from './CreateCampaignForm.module.css';

interface CreateCampaignFormProps {
  address: string | undefined;
  chainId: number | undefined;
}

const CreateCampaignForm = ({ address, chainId }: CreateCampaignFormProps) => {
  const [description, setDescription] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [beneficiary, setBeneficiary] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !chainId) {
      console.error('No wallet connected or network not selected');
      return;
    }

    try {
      const beneficiaryAddress = ethers.getAddress(beneficiary);
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);
      const goalInWei = parseEther(fundingGoal);

      const signer = await web3Service.getSigner(address);

      const txHash = await web3Service.createCampaign(
        signer,
        description,
        goalInWei,
        deadlineTimestamp,
        beneficiaryAddress
      );

      console.log('Campaign created. Transaction hash:', txHash);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error creating campaign:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.input}
          required
        />
      </div>

      <div>
        <label htmlFor="fundingGoal" className={styles.label}>
          Funding Goal (in ETH)
        </label>
        <input
          id="fundingGoal"
          type="text"
          placeholder="Type here"
          value={fundingGoal}
          onChange={(e) => setFundingGoal(e.target.value)}
          className={styles.input}
          required
        />
      </div>

      <div>
        <label htmlFor="deadline" className={styles.label}>
          Deadline
        </label>
        <input
          id="deadline"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={styles.input}
          required
        />
      </div>

      <div>
        <label htmlFor="beneficiary" className={styles.label}>
          Beneficiary Address
        </label>
        <input
          id="beneficiary"
          type="text"
          value={beneficiary}
          onChange={(e) => setBeneficiary(e.target.value)}
          className={styles.input}
          required
        />
      </div>

      <button type="submit" className={styles.button}>
        Create Campaign
      </button>
    </form>
  );
};

export default CreateCampaignForm;
