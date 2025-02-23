import React, { useEffect, useState } from 'react'
import { Receipt, PlayCircle, HelpCircle, GraduationCap, Award, MessageSquare, X, Home, Heart, CircleUserRound } from 'lucide-react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Sidebar({ isOpen, onClose }) {
  const [useCurrent, setCurrent] = useState("")
  const navigate = useNavigate()


  useEffect(() => {
    async function currentUser() {
      try {
        let res = await axios.get("https://ngo-assesment-1.onrender.com/currentuser", { withCredentials: true })
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
  }, [])

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Receipt, label: 'Transactions', path: '/transactions' },
    { icon: PlayCircle, label: 'Start Here', path: '#' },
    { icon: HelpCircle, label: 'FAQ', path: '#' },
    { icon: GraduationCap, label: 'Learning Modules', path: '#' },
    { icon: Award, label: 'Rewards', path: '#' },
    { icon: MessageSquare, label: 'Feedback', path: '#' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30`}>
      <div className="flex flex-col h-full w-64 bg-white border-r shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <Heart className="text-red-500" size={32} />
            <span className="text-xl font-bold text-gray-900">Hope Foundation</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.path}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <CircleUserRound className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{useCurrent.name}</p>
              <p className="text-xs text-gray-500">{useCurrent.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar