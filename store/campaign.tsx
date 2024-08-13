import { useState, useEffect } from 'react';
import { useMetamask } from '../world-id-nextauth-template/components/useMetamask';
import CreateCampaignForm from './create-campaign';

export default function ProtectedPage() {
    const {
        isInstalled,
        isConnected,
        account,
        chainId,
        connectToMetamask,
        switchNetwork,
        switchAccount
    } = useMetamask();

    const [content, setContent] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/examples/protected");
                const json = await res.json();
                if (json.content) {
                    setContent(json.content);
                }
            } catch (error) {
                setError('Failed to load content');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Convert account and chainId to string if necessary
    const accountString = account ? (account as { address: string}).address : 'N/A';
    const chainIdString = chainId ? chainId.toString() : 'N/A';

    console.log('MetaMask State:', {
        isInstalled,
        isConnected,
        account: accountString,
        chainId: chainIdString
    });

    return (
        <>
            <p>Welcome to BoostDAO campaign page</p>
            {isInstalled ? (
                <>
                    <p>MetaMask is installed.</p>
                    {isConnected ? (
                        <>
                            <p>Connected account: {accountString}</p>
                            <p>Chain ID: {chainIdString}</p>
                            <button onClick={switchAccount}>Switch Account</button>
                        </>
                    ) : (
                        <button onClick={connectToMetamask}>Connect to MetaMask</button>
                    )}
                </>
            ) : (
                <p>MetaMask is not installed. Please install MetaMask.</p>
            )}
            <CreateCampaignForm address={accountString} chainId={chainId} />
        </>
    );
}
