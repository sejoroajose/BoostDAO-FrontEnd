import { useState, useEffect } from 'react';
import { ethers, BrowserProvider } from 'ethers';

declare global {
    interface Window {
        ethereum: any;
    }
}

interface MetamaskState {
    isInstalled: boolean;
    isConnected: boolean;
    account: string | any;
    chainId: number | any;
    provider: BrowserProvider | null;
    signer: BrowserProvider | any;
}

export function useMetamask() {
    const [metamaskState, setMetamaskState] = useState<MetamaskState>({
        isInstalled: false,
        isConnected: false,
        account: null,
        chainId: null,
        provider: null,
        signer: null,
    });

    useEffect(() => {
        const checkMetamaskInstallation = async () => {
            if (typeof window.ethereum !== 'undefined') {
                setMetamaskState(prev => ({ ...prev, isInstalled: true }));
                await updateMetamaskState();
            }
        };

        checkMetamaskInstallation();

        if (window.ethereum) {
            const handleAccountsChanged = async () => {
                await updateMetamaskState();
            };

            const handleChainChanged = async () => {
                await updateMetamaskState();
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, []);

    const updateMetamaskState = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.BrowserProvider(window.ethereum as any);
            const signer = provider.getSigner();

            try {
                const accounts = await provider.listAccounts();
                const network = await provider.getNetwork();

                setMetamaskState({
                    isInstalled: true,
                    isConnected: accounts.length > 0,
                    account: accounts[0] || null,
                    chainId: network.chainId,
                    provider,
                    signer,
                });
            } catch (error) {
                console.error('Error updating MetaMask state:', error);
            }
        }
    };

    const connectToMetamask = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                await updateMetamaskState();
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
            }
        } else {
            console.error('MetaMask is not installed');
        }
    };

    const switchNetwork = async (chainId: number) => {
        if (!metamaskState.provider) return;

        try {
            await metamaskState.provider.send('wallet_switchEthereumChain', [{ chainId: `0x${chainId.toString(16)}` }]);
        } catch (error: any) {
            if (error.code === 4902) {
                console.error('This network is not available in your MetaMask, please add it manually');
            } else {
                console.error('Failed to switch network:', error);
            }
        }
    };

    const switchAccount = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                await updateMetamaskState();
            } catch (error) {
                console.error('Error switching account in MetaMask:', error);
            }
        }
    };

    return {
        ...metamaskState,
        connectToMetamask,
        switchNetwork,
        switchAccount,
    };
}
