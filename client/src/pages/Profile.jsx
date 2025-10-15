import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { 
  User, 
  Mail, 
  Palette, 
  DollarSign, 
  Save,
  Check,
  Edit3
} from 'lucide-react'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: user?.profile?.name || '',
      theme: user?.preferences?.theme || 'auto',
      currency: user?.preferences?.currency || 'INR'
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const result = await updateProfile(data)
      if (result.success) {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const currencies = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
  ]

  const themes = [
    { value: 'light', name: 'Light', description: 'Clean and bright' },
    { value: 'dark', name: 'Dark', description: 'Easy on the eyes' },
    { value: 'auto', name: 'Auto', description: 'Follow system preference' }
  ]

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Profile Settings
          </h1>
          <p className="text-xl text-white/70">
            Manage your account preferences and settings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-ghost text-sm"
                >
                  {isEditing ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Done
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  )}
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="input-field pl-10 bg-dark-800 text-white/60 cursor-not-allowed border-white/20"
                    />
                  </div>
                  <p className="mt-1 text-xs text-white/50">
                    Email cannot be changed
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      {...register('name', {
                        minLength: { value: 2, message: 'Name must be at least 2 characters' },
                        maxLength: { value: 50, message: 'Name must be less than 50 characters' }
                      })}
                      type="text"
                      disabled={!isEditing}
                      className={`input-field pl-10 bg-dark-800 text-white border-white/20 ${!isEditing ? 'text-white/60 cursor-not-allowed' : ''}`}
                      placeholder="Enter your display name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                {/* Theme Preference */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Theme Preference
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {themes.map((themeOption) => (
                      <label
                        key={themeOption.value}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                          !isEditing
                            ? 'border-white/20 bg-white/5 cursor-not-allowed'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <input
                          {...register('theme')}
                          type="radio"
                          value={themeOption.value}
                          disabled={!isEditing}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${
                            themeOption.value === 'light' ? 'bg-yellow-400' :
                            themeOption.value === 'dark' ? 'bg-gray-800' :
                            'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}></div>
                          <p className="text-white font-medium">{themeOption.name}</p>
                          <p className="text-white/60 text-sm">{themeOption.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Currency Preference */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Currency
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <select
                      {...register('currency')}
                      disabled={!isEditing}
                      className={`input-field pl-10 bg-dark-800 text-white border-white/20 ${!isEditing ? 'text-white/60 cursor-not-allowed' : ''}`}
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code} className="bg-dark-800 text-white">
                          {currency.symbol} {currency.name} ({currency.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="spinner"></div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn-ghost flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Account Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Account Status */}
            <div className="card">
              <h3 className="text-xl font-bold text-white mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Email Verified</span>
                  <span className="flex items-center text-green-400">
                    <Check className="w-4 h-4 mr-1" />
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Member Since</span>
                  <span className="text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Last Login</span>
                  <span className="text-white">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center">
                    <Palette className="w-5 h-5 mr-3 text-primary-400" />
                    <span className="text-white">Toggle Theme</span>
                  </div>
                  <span className="text-white/60 capitalize">{theme}</span>
                </button>
                
                <button
                  onClick={() => window.location.href = '/bill-splitter'}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-3 text-accent-400" />
                    <span className="text-white">Bill Splitter</span>
                  </div>
                  <span className="text-white/60">→</span>
                </button>
              </div>
            </div>

            {/* App Info */}
            <div className="card">
              <h3 className="text-xl font-bold text-white mb-4">About Vertex</h3>
              <div className="space-y-2 text-sm text-white/70">
                <p>Version 1.0.0</p>
                <p>Built with React & Node.js</p>
                <p>Secure OTP Authentication</p>
                <p>Responsive Design</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile
