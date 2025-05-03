import React, { useEffect, useState } from 'react';
import api from '../Services/api';
import Layout from './Layout';
import Spinner from '../components/Spinner';

export default function Wallet() {
    const [wallet, setWallet] = useState(null);
    const [loading, setIsLoading] = useState(true);

    const getWallet = async () => {
        try {
            const response = await api.get(`/v1/wallet/transactions`);
            setWallet(response.data.wallet);
        } catch (error) {
            console.error('Error fetching wallet', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getWallet();
    }, []);

    if (loading) return (
        <Layout>
            <Spinner />
        </Layout>
    );

    const getTransactionColor = (type) => {
        switch (type) {
            case 'ride_payment':
                return 'text-red-500';  // Red for payments (debits)
            case 'ride_income':
                return 'text-green-500';  // Green for ride income (credits)
            case 'platform_commission':
                return 'text-blue-500';  // Blue for platform commissions
            default:
                return 'text-gray-500';  // Default color for unknown types
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8">
                {/* Wallet Info Section */}
                <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mb-6">
                    <h2 className="text-2xl text-white font-semibold mb-4">Wallet</h2>
                    <div className="flex justify-between items-center">
                        <div className="text-white">
                            <p className="text-xl">Balance</p>
                            <p className="text-3xl font-semibold">{wallet.balance} USD</p>
                        </div>
                    </div>
                </div>

                {/* Transactions List Section */}
                <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl text-white font-semibold mb-4">Transactions</h3>

                    {wallet.transactions.length === 0 ? (
                        <p className="text-gray-400">No transactions yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {wallet.transactions.map((transaction) => (
                                <div key={transaction.id} className="bg-zinc-700 p-4 rounded-lg flex justify-between items-center">
                                    <div className="text-white">
                                        <div className="font-semibold">{transaction.description}</div>
                                        <div className="text-sm text-gray-400">{new Date(transaction.created_at).toLocaleString()}</div>
                                    </div>
                                    <div className={`text-sm font-semibold ${getTransactionColor(transaction.type)}`}>
                                        {transaction.amount < 0 ? `- ${Math.abs(transaction.amount)}` : `+ ${transaction.amount}`} USD
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}