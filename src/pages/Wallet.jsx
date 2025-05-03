import React, { useEffect, useState } from 'react';
import api from '../Services/api';
import Layout from './Layout';
import Spinner from '../components/Spinner';

export default function Wallet() {
    const [wallet, setWallet] = useState(null);
    const [loading, setIsLoading] = useState(true);
    const [amountToAdd, setAmountToAdd] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const getWallet = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/v1/wallet/transactions`);
            setWallet(response.data.wallet);
        } catch (error) {
            console.error('Error fetching wallet', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAmount = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await api.post('/v1/wallet/add', { amount: parseFloat(amountToAdd) });
            setWallet(response.data.wallet);
            setSuccessMessage(`Successfully added ${amountToAdd} USD to your wallet.`);
            setAmountToAdd(0);
            getWallet();
        } catch (error) {
            setErrorMessage('Error adding money to the wallet.');
            console.error('Error adding amount:', error);
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

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8">
                {/* Wallet Info Section */}
                <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mb-6">
                    <h2 className="text-2xl text-white font-semibold mb-4">Wallet</h2>
                    <div className="flex justify-between items-center">
                        <div className="text-white">
                            <p className="text-xl">Balance</p>
                            <p className="text-3xl font-semibold">{wallet?.balance} USD</p>
                        </div>
                    </div>
                </div>

                {/* Add Amount Section */}
                <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mb-6">
                    <h3 className="text-xl text-white font-semibold mb-4">Add Money to Wallet</h3>
                    <form onSubmit={handleAddAmount}>
                        <div className="space-y-4">
                            {/* Amount Input */}
                            <div>
                                <label htmlFor="amount" className="text-white">Amount to Add</label>
                                <input
                                    type="number"
                                    id="amount"
                                    className="w-full mt-2 p-2 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={amountToAdd}
                                    onChange={(e) => setAmountToAdd(e.target.value)}
                                    placeholder="Enter amount"
                                />
                            </div>

                            {/* Error or Success Message */}
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                            {successMessage && <p className="text-green-500">{successMessage}</p>}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                                Add Money
                            </button>
                        </div>
                    </form>
                </div>

                {/* Transactions List Section */}
                <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl text-white font-semibold mb-4">Transactions</h3>

                    {wallet?.transactions.length === 0 ? (
                        <p className="text-gray-400">No transactions yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {wallet?.transactions.map((transaction) => (
                                <div key={transaction.id} className="bg-zinc-700 p-4 rounded-lg flex justify-between items-center">
                                    <div className="text-white">
                                        <div className="font-semibold">{transaction.description}</div>
                                        <div className="text-sm text-gray-400">{new Date(transaction.created_at).toLocaleString()}</div>
                                    </div>
                                    <div
                                        className={`text-sm font-semibold 
                                            ${transaction.type === 'ride_payment' ? 'text-red-500' : ''}
                                            ${transaction.type === 'ride_income' ? 'text-green-500' : ''}
                                            ${transaction.type === 'platform_commission' ? 'text-blue-500' : ''}
                                        `}>
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