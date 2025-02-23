import React, { useEffect, useState } from 'react'
import Sidebar from "../../Componnets/Slidebar"
import {
    CircleUserRound, Home, ChevronRight,
    Menu
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner } from '@/Componnets/loading/Loading';

function Transitions() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [useCurrent, setCurrent] = useState("")
    const [useTransation, setTranation] = useState([])
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    useEffect(() => {
        async function currentUser() {
            try {
                let res = await axios.get("http://localhost:8080/currentuser", { withCredentials: true })
                if (res.data) {
                    setCurrent(res.data.currentUser)

                }
            }
            catch (err) {
                if (err?.response?.data?.message === 'Unauthorized access') {
                    navigate("/login")
                }
                else if (err?.response?.data?.message === "Invalid token credentials.") {
                    navigate("/login")
                }
                else {
                    console.log(err)
                }
            }
        }
        currentUser()
    }, [navigate])
    useEffect(() => {
        if (!useCurrent.referralCode) return;
        async function getTranasation() {
            setLoading(true);
            let data = {
                referralCode: useCurrent.referralCode
            }
            try {
                let res = await axios.post("http://localhost:8080/findTrnasation", data)
                setTranation(res.data.Tranasation)
            }
            catch (err) {
                console.log(err)
            }
            finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1500)
            }
        }
        getTranasation()

    }, [useCurrent])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size={40} className="mx-auto mb-4" />
                    <p className="text-gray-600">Loading transactions...</p>
                </div>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div>
                <header className="bg-white shadow-sm sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <Menu size={24} />
                            </button>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 font-medium">{useCurrent.name}</span>

                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                    <CircleUserRound className="text-white" size={24} />

                                </div>

                            </div>
                        </div>

                        {/* Breadcrumbs */}
                        <div className="py-2 flex items-center text-sm text-gray-500">
                            <Home size={16} className="mr-1" />
                            <span>Home</span>
                            <ChevronRight size={16} className="mx-1" />
                            <Link to={"/dashboard"} className="text-gray-900">Dashboard</Link>
                            <ChevronRight size={16} className="mx-1" />
                            <Link to={"/transactions"} className="text-gray-900">Transactions</Link>

                        </div>
                    </div>
                </header>
                <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h1>

                        {/* Table container with horizontal scroll for small screens */}
                        <div className="overflow-x-auto rounded-lg shadow">
                            <table className="min-w-full divide-y divide-gray-200 bg-white">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Transaction ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {useTransation.map((transaction, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {transaction.razorpay_order_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile view - Card layout */}
                        <div className="sm:hidden space-y-4 mt-4">
                            {useTransation.map((transaction, index) => (
                                <div key={index} className="bg-white rounded-lg shadow p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">#{index + 1}</span>
                                        <span className="text-gray-500">{new Date(transaction.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-xs text-gray-500">Name</label>
                                            <p className="font-medium">{transaction.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Amount</label>
                                            <p className="font-medium">{transaction.amount}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Transaction ID</label>
                                            <p className="font-mono text-sm">{transaction.razorpay_order_id}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Transitions