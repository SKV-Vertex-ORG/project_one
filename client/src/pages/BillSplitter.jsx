import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { billSplitterAPI } from '../services/api'
import { 
  Calculator, 
  Users, 
  DollarSign, 
  Percent, 
  Receipt,
  Copy,
  Check,
  RotateCcw,
  Save
} from 'lucide-react'
import toast from 'react-hot-toast'

const BillSplitter = () => {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [splitType, setSplitType] = useState('equal') // 'equal' or 'custom'
  const [customAmounts, setCustomAmounts] = useState([])
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      totalAmount: '',
      personCount: '',
      tipPercentage: '',
      taxPercentage: ''
    }
  })

  const watchedPersonCount = watch('personCount')

  // Update custom amounts when person count changes
  React.useEffect(() => {
    if (splitType === 'custom' && watchedPersonCount) {
      const count = parseInt(watchedPersonCount)
      if (count > 0) {
        setCustomAmounts(new Array(count).fill(0))
      }
    }
  }, [watchedPersonCount, splitType])

  const calculateBill = async (data) => {
    setLoading(true)
    try {
      const payload = {
        totalAmount: parseFloat(data.totalAmount),
        personCount: parseInt(data.personCount),
        tipPercentage: parseFloat(data.tipPercentage) || 0,
        taxPercentage: parseFloat(data.taxPercentage) || 0,
        ...(splitType === 'custom' && customAmounts.length > 0 && {
          customAmounts: customAmounts
        })
      }

      const response = await billSplitterAPI.calculate(payload)
      setResult(response.data.data)
      toast.success('Bill calculated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCustomAmountChange = (index, value) => {
    const newAmounts = [...customAmounts]
    newAmounts[index] = parseFloat(value) || 0
    setCustomAmounts(newAmounts)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const resetForm = () => {
    reset()
    setResult(null)
    setCustomAmounts([])
    setSplitType('equal')
  }

  const saveCalculation = async () => {
    if (!result) return

    try {
      await billSplitterAPI.save({
        totalAmount: result.totalAmount,
        personCount: result.personCount,
        amountPerPerson: result.amountPerPerson || result.splitDetails?.[0]?.amount || 0,
        notes: `Split type: ${result.type}`
      })
      toast.success('Calculation saved!')
    } catch (error) {
      toast.error('Failed to save calculation')
    }
  }

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
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Bill Splitter
          </h1>
          <p className="text-xl text-white/70">
            Split bills effortlessly with friends and family
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Bill Details</h2>
              <button
                onClick={resetForm}
                className="btn-ghost text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>

            <form onSubmit={handleSubmit(calculateBill)} className="space-y-6">
              {/* Total Amount */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Total Amount (₹)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    {...register('totalAmount', {
                      required: 'Total amount is required',
                      min: { value: 0.01, message: 'Amount must be greater than 0' }
                    })}
                    type="number"
                    step="0.01"
                    className="input-field pl-10 bg-dark-800 text-white border-white/20"
                    placeholder="0.00"
                  />
                </div>
                {errors.totalAmount && (
                  <p className="mt-1 text-sm text-red-400">{errors.totalAmount.message}</p>
                )}
              </div>

              {/* Person Count */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Number of People
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    {...register('personCount', {
                      required: 'Number of people is required',
                      min: { value: 1, message: 'Must be at least 1 person' }
                    })}
                    type="number"
                    min="1"
                    className="input-field pl-10 bg-dark-800 text-white border-white/20"
                    placeholder="2"
                  />
                </div>
                {errors.personCount && (
                  <p className="mt-1 text-sm text-red-400">{errors.personCount.message}</p>
                )}
              </div>

              {/* Split Type */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Split Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSplitType('equal')}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      splitType === 'equal'
                        ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                        : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    Equal Split
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitType('custom')}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      splitType === 'custom'
                        ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                        : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    Custom Amounts
                  </button>
                </div>
              </div>

              {/* Custom Amounts */}
              {splitType === 'custom' && watchedPersonCount && (
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Individual Amounts ($)
                  </label>
                  <div className="space-y-2">
                    {customAmounts.map((amount, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-white/60 w-8">Person {index + 1}:</span>
                        <input
                          type="number"
                          step="0.01"
                          value={amount}
                          onChange={(e) => handleCustomAmountChange(index, e.target.value)}
                          className="input-field flex-1 bg-dark-800 text-white border-white/20"
                          placeholder="0.00"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Tip (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      {...register('tipPercentage')}
                      type="number"
                      step="0.1"
                      className="input-field pl-8 bg-dark-800 text-white border-white/20"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Tax (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      {...register('taxPercentage')}
                      type="number"
                      step="0.1"
                      className="input-field pl-8 bg-dark-800 text-white border-white/20"
                      placeholder="0"
                    />
                  </div>
                </div>
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
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Split
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {result && (
              <>
                {/* Summary Card */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Split Summary</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={saveCalculation}
                        className="btn-ghost text-sm"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                        className="btn-ghost text-sm"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 mr-1" />
                        ) : (
                          <Copy className="w-4 h-4 mr-1" />
                        )}
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Total Amount:</span>
                      <span className="text-2xl font-bold text-white">
                        ₹{result.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    {result.tipAmount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Tip:</span>
                        <span className="text-white">₹{result.tipAmount.toFixed(2)}</span>
                      </div>
                    )}

                    {result.taxAmount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Tax:</span>
                        <span className="text-white">₹{result.taxAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Subtotal:</span>
                        <span className="text-white">₹{result.subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Split Details */}
                <div className="card">
                  <h3 className="text-xl font-bold text-white mb-4">Split Details</h3>
                  
                  {result.type === 'equal' ? (
                    <div className="space-y-3">
                      <div className="text-center py-4">
                        <p className="text-3xl font-bold gradient-text">
                          ₹{result.amountPerPerson.toFixed(2)}
                        </p>
                        <p className="text-white/70">per person</p>
                      </div>
                      
                      <div className="space-y-2">
                        {result.splitDetails.map((person, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 rounded-lg bg-white/5"
                          >
                            <span className="text-white/70">Person {person.person}:</span>
                            <span className="text-white font-medium">
                              ₹{person.amount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {result.customAmounts.map((person, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 rounded-lg bg-white/5"
                        >
                          <span className="text-white/70">Person {person.person}:</span>
                          <div className="text-right">
                            <span className="text-white font-medium">
                              ₹{person.amount.toFixed(2)}
                            </span>
                            <p className="text-xs text-white/50">
                              {person.percentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {!result.isBalanced && (
                        <div className="p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                        <p className="text-yellow-400 text-sm">
                          ⚠️ Difference: ₹{result.difference.toFixed(2)}
                        </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Empty State */}
            {!result && (
              <div className="card text-center py-12">
                <Receipt className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Calculation Yet</h3>
                <p className="text-white/70">
                  Enter bill details and click calculate to see the split
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default BillSplitter
