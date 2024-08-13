import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout';
import AccessDenied from '../components/access-denied';
import { useMetamask } from '../components/useMetamask';
import CreateCampaignForm from '../components/create-campaign';


export default function ProtectedPage() {
    const { data: session } = useSession();
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
    }, [session]);

    if (!session) {
        return (
            <Layout>
                <AccessDenied />
            </Layout>
        );
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Convert account and chainId to string if necessary
    const accountString = account ? (account as { address: string }).address : 'N/A';
    const chainIdString = chainId ? chainId.toString() : 'N/A';

    console.log('MetaMask State:', {
        isInstalled,
        isConnected,
        account: accountString,
        chainId: chainIdString
    });

    return (
      <Layout>
        {isInstalled ? (
            <>
                {isConnected ? (
                    <div className="space-y-4">
                        <p className="text-green-600 font-medium">Connected account: {accountString}</p>
                        <p className="text-blue-600 font-medium">Chain ID: {chainIdString}</p>
                        <button
                            onClick={switchAccount}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Switch Account
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={connectToMetamask}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Connect to MetaMask
                    </button>
                )}
            </>
        ) : (
            <p className="text-red-600 font-bold">MetaMask is not installed. Please install MetaMask.</p>
        )}
    
        <p className="mt-8 text-2xl font-semibold text-center">Welcome to BoostDAO Campaign Page</p>
        
        <div className="mt-6">
            <CreateCampaignForm address={accountString} chainId={chainId} />
        </div>
    </Layout>
  
    );
}
