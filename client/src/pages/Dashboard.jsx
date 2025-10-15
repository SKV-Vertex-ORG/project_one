import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { 
  Calculator, 
  TrendingUp, 
  Clock, 
  Star,
  ArrowRight,
  Plus,
  History,
  ShoppingCart
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()

  const services = [
    {
      title: 'Bill Splitter',
      description: 'Split bills with friends and family',
      icon: Calculator,
      href: '/bill-splitter',
      color: 'from-blue-500 to-cyan-500',
      stats: '12 calculations this month'
    },
    {
      title: 'Grocery List',
      description: 'Manage your daily grocery shopping',
      icon: ShoppingCart,
      href: '/grocery-list',
      color: 'from-green-500 to-emerald-500',
      stats: 'Track your shopping expenses'
    },
    {
      title: 'Coming Soon',
      description: 'More services on the way',
      icon: Star,
      href: '#',
      color: 'from-purple-500 to-pink-500',
      stats: 'Stay tuned!'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'bill_split',
      title: 'Dinner with Friends',
      amount: '₹450.50',
      date: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'bill_split',
      title: 'Coffee Meeting',
      amount: '₹127.50',
      date: '1 day ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'bill_split',
      title: 'Grocery Shopping',
      amount: '₹892.00',
      date: '3 days ago',
      status: 'completed'
    }
  ]

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, <span className="gradient-text">
              {user?.profile?.name || 'User'}
            </span>! 👋
          </h1>
          <p className="text-xl text-white/70">
            Here's what's happening with your account today.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Calculations</p>
                <p className="text-3xl font-bold text-white">24</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12% from last month
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Money Saved</p>
                <p className="text-3xl font-bold text-white">₹1,275.00</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8% from last month
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Active Services</p>
                <p className="text-3xl font-bold text-white">1</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-blue-400 text-sm">
              <Plus className="w-4 h-4 mr-1" />
              More coming soon
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Services</h2>
                <Link
                  to="/bill-splitter"
                  className="text-primary-400 hover:text-primary-300 transition-colors flex items-center"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service, index) => {
                  const Icon = service.icon
                  return (
                    <Link
                      key={index}
                      to={service.href}
                      className="group block"
                    >
                      <div className="card-hover p-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-white/70 mb-3">
                          {service.description}
                        </p>
                        <p className="text-sm text-white/50">
                          {service.stats}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                <Link
                  to="/bill-splitter"
                  className="text-primary-400 hover:text-primary-300 transition-colors flex items-center"
                >
                  <History className="w-4 h-4 mr-1" />
                  History
                </Link>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Calculator className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{activity.title}</p>
                        <p className="text-white/60 text-sm flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{activity.amount}</p>
                      <p className="text-green-400 text-xs">Completed</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <Link
                  to="/bill-splitter"
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Calculation
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
