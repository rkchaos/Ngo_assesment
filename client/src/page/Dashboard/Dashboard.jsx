import React, { useEffect, useState } from 'react';
import {
  CircleUserRound, Home, Share2, Star, Copy, ChevronRight, Heart, Users, Trophy, Target,
  Menu, LogOut
} from 'lucide-react';
import Sidebar from "../../Componnets/Slidebar"
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import { LoadingSpinner } from '@/Componnets/loading/Loading';

function CircularProgress({ value, size = 240, strokeWidth = 12, totalAmountReceived }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="stroke-gray-100"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          className="stroke-green-500"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-green-600">{totalAmountReceived}</span>
        <span className="text-sm text-gray-500 mt-2">Towards Our Goal</span>
        <span className="text-2xl font-bold text-gray-800 mt-1">₹1,00,000</span>
      </div>
    </div>
  );
}

function ImpactCard({ icon: Icon, title, value, color }) {
  return (
    <div className={`bg-${color}-50 p-4 rounded-xl border border-${color}-100`}>
      <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center mb-3`}>
        <Icon className={`text-${color}-600`} size={24} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
    </div>
  );
}



function Dashboard() {
  const [progress, setProgress] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [useCurrent, setCurrent] = useState("")
  const [copied, setCopied] = useState(false);
  const [allTranstion, setTranstion] = useState("")
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function currentUser() {
      try {
        let res = await axios.get("https://ngo-assesment-1.onrender.com/currentuser", { withCredentials: true })
        console.log(res.data)
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
  function handlecopy() {
    let donationLink = `https://ngo-assesment.vercel.app/donation/${useCurrent.referralCode}`
    navigator.clipboard.writeText(donationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copy to clipboard ')
  }
  useEffect(() => {
    if (!useCurrent.referralCode) return;
    async function data() {
      setLoading(true);
      try {
        let data = {
          referralCode: useCurrent.referralCode
        }
        let res = await axios.post("https://ngo-assesment-1.onrender.com/calculatePercentage", data)
        setTranstion(res.data)
        setProgress(res.data.percentage)
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
    data()

  }, [useCurrent])

  const handleLogout = async () => {
    try {
      await axios.delete("https://ngo-assesment-1.onrender.com/logout",{ withCredentials: true });
      toast.success('Logged out successfully');
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error('Failed to logout');
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size={40} className="mx-auto mb-4" />
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div>
        {/* Header */}
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
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
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
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="relative rounded-2xl overflow-hidden mb-12 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80"
              alt="Children smiling"
              className="w-full h-80 sm:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8 text-white max-w-3xl">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Making a Difference in Every Child's Life</h2>
                <p className="text-lg text-gray-200">Join us in our mission to provide education and support to underprivileged children across India.</p>
              </div>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <ImpactCard icon={Heart} title="Lives Impacted" value="10,000+" color="red" />
            <ImpactCard icon={Users} title="Active Donors" value="2,500" color="blue" />
            <ImpactCard icon={Trophy} title="Projects Completed" value="150" color="yellow" />
            <ImpactCard icon={Target} title="Success Rate" value="95%" color="green" />
          </div>

          {/* Progress and Level Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Progress */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Goal Achieved</h2>
              <div className="flex flex-col items-center space-y-8">
                <CircularProgress value={progress} totalAmountReceived={allTranstion.totalAmountReceived} />

                <button
                  className="w-full sm:w-auto bg-green-500 text-white px-8 py-4 rounded-xl flex items-center justify-center space-x-3 hover:bg-green-600 transition-all transform hover:scale-105 font-medium text-lg shadow-md"
                  onClick={() => {
                    const donationLink = `https://ngo-assesment.vercel.app/donation/${useCurrent.referralCode}`;
                    const message = `Hi, I am raising funds for ngo. Please support me by donating through this link ${donationLink}and make a difference!`;
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                >
                  <Share2 size={24} />
                  <span>Share on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Right Column - Level */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center space-x-3">
                  <span>Level Achieved:</span>
                  <Star className="text-yellow-400 fill-current" size={28} />
                  <span className="text-yellow-600">Star</span>
                </h2>
              </div>

              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-purple-600 text-white px-6 py-4 rounded-xl flex items-center justify-center space-x-3 hover:bg-purple-700 transition-all transform hover:scale-105 font-medium shadow-md">
                  <Trophy size={24} />
                  <span>View Rewards</span>
                </button>
                <button className="flex-1 border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all transform hover:scale-105 font-medium"
                  onClick={handlecopy}
                >
                  <Copy size={24} />
                  <span>{copied ? "Copied!" : "Copy donation link"}</span>
                </button>
              </div>

              <div className="text-center space-y-6 bg-gradient-to-b from-purple-50 to-transparent p-6 rounded-xl">
                <div>
                  <h3 className="text-xl font-bold text-purple-900">Next Milestone</h3>
                  <p className="text-2xl font-bold text-purple-600 mt-2">₹5,000</p>
                  <p className="text-gray-600 mt-1">to reach Guardian Level</p>
                </div>

                <div className="h-3 bg-purple-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }} />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg inline-block">
                  <p className="text-gray-600">
                    Reference Code: <span className="font-mono font-bold text-black-700">{useCurrent.referralCode}</span>
                  </p>
                </div>

                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 text-lg font-semibold shadow-lg">
                  Start Here
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </div>
  );
}

export default Dashboard;