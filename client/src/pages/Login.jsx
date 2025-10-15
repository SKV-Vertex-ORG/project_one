import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const Login = () => {
  const [step, setStep] = useState('email') // 'email' or 'otp'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { sendOtp, login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const otpValue = watch('otp')

  const handleSendOtp = async (data) => {
    setLoading(true)
    setEmail(data.email)
    
    const result = await sendOtp(data.email)
    
    if (result.success) {
      setStep('otp')
      toast.success('OTP sent to your email!')
    } else {
      toast.error(result.error)
    }
    
    setLoading(false)
  }

  const handleVerifyOtp = async (data) => {
    setLoading(true)
    
    const result = await login(email, data.otp)
    
    if (result.success) {
      toast.success('Welcome to Vertex!')
      navigate('/dashboard')
    } else {
      toast.error(result.error)
    }
    
    setLoading(false)
  }

  const handleBackToEmail = () => {
    setStep('email')
    setEmail('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {step === 'email' ? 'Welcome Back' : 'Verify Your Email'}
            </h1>
            <p className="text-white/70">
              {step === 'email' 
                ? 'Enter your email to receive a verification code'
                : `We sent a 6-digit code to ${email}`
              }
            </p>
          </div>

          {/* Email Step */}
          {step === 'email' && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit(handleSendOtp)}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="input-field pl-10 bg-dark-800 text-white border-white/20"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    Send OTP
                    <Lock className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit(handleVerifyOtp)}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Enter 6-digit code
                </label>
                <input
                  {...register('otp', {
                    required: 'OTP is required',
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'OTP must be 6 digits'
                    }
                    })}
                  type="text"
                  maxLength="6"
                  className="input-field text-center text-2xl tracking-widest font-mono bg-dark-800 text-white border-white/20"
                  placeholder="000000"
                />
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-400">{errors.otp.message}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="btn-ghost flex-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !otpValue || otpValue.length !== 6}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                      Verify
                      <CheckCircle className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    handleSendOtp({ email })
                  }}
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </motion.form>
          )}

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-white/60">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Secure OTP
              </div>
              <div className="flex items-center text-white/60">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                No Password
              </div>
              <div className="flex items-center text-white/60">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Fast Login
              </div>
              <div className="flex items-center text-white/60">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Privacy First
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
