import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  ShoppingCart, 
  Check, 
  Edit3, 
  Trash2, 
  Calendar,
  DollarSign,
  Package,
  Filter,
  Search,
  RotateCcw,
  TrendingUp,
  Clock
} from 'lucide-react'
import { groceryListAPI } from '../services/api'
import toast from 'react-hot-toast'
import { 
  categorizeItem, 
  getSuggestedUnit, 
  getSuggestedPrice, 
  popularItems, 
  categories, 
  units 
} from '../utils/itemCategorization'

const GroceryList = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [showBoughtOnly, setShowBoughtOnly] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)


  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    unit: 'g',
    estimatedPrice: 0,
    category: 'General',
    bought: false
  })


  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])

  useEffect(() => {
    loadGroceryList()
  }, [selectedDate])


  // Filter suggestions based on input and auto-update category
  useEffect(() => {
    if (newItem.name.length > 0) {
      const filtered = popularItems.filter(item => 
        item.toLowerCase().includes(newItem.name.toLowerCase())
      ).slice(0, 8)
      setFilteredSuggestions(filtered)
      setShowSuggestions(true)
      
      // Auto-update category based on smart detection
      const detectedCategory = categorizeItem(newItem.name)
      const suggestedUnit = getSuggestedUnit(detectedCategory, newItem.name)
      
      setNewItem(prev => ({
        ...prev,
        category: detectedCategory,
        unit: suggestedUnit
        // Price is not auto-suggested - user enters their own
      }))
    } else {
      setShowSuggestions(false)
    }
  }, [newItem.name])

  const loadGroceryList = async () => {
    try {
      setLoading(true)
      
      // Ensure date is in YYYY-MM-DD format
      const formattedDate = selectedDate || new Date().toISOString().split('T')[0]
      
      const response = await groceryListAPI.getList(formattedDate)
      
      if (response.data?.data?.items) {
        setItems(response.data.data.items)
        console.log(`Loaded ${response.data.data.items.length} items for ${formattedDate}`)
      } else {
        setItems([])
        console.log(`No items found for date: ${formattedDate}`)
      }
    } catch (error) {
      console.error('Error loading grocery list:', error)
      toast.error('Failed to load grocery list')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const autoSaveGroceryList = async (itemsToSave) => {
    try {
      setAutoSaving(true)
      const formattedDate = selectedDate || new Date().toISOString().split('T')[0]
      await groceryListAPI.saveList(formattedDate, itemsToSave)
      // Don't show toast for auto-save to avoid spam
    } catch (error) {
      console.error('Error auto-saving grocery list:', error)
      toast.error('Failed to save changes')
    } finally {
      setAutoSaving(false)
    }
  }

  const addItem = async () => {
    if (!newItem.name.trim()) {
      toast.error('Please enter item name')
      return
    }

    // Smart categorization and suggestions
    const detectedCategory = categorizeItem(newItem.name)
    const suggestedUnit = getSuggestedUnit(detectedCategory, newItem.name)

    const item = {
      ...newItem,
      category: detectedCategory,
      unit: suggestedUnit,
      // Use the price entered by the user, not auto-suggested
      id: Date.now().toString(),
      addedDate: new Date().toISOString()
    }

    const updatedItems = [...items, item]
    setItems(updatedItems)
    setNewItem({
      name: '',
      quantity: 1,
      unit: 'g',
      estimatedPrice: 0,
      category: 'General',
      bought: false
    })
    setShowAddForm(false)
    toast.success(`Item added successfully! Auto-categorized as ${detectedCategory}`)
    
    // Auto-save to database
    await autoSaveGroceryList(updatedItems)
  }

  const updateItem = async (itemId, updates) => {
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    )
    setItems(updatedItems)
    
    // Auto-save to database
    await autoSaveGroceryList(updatedItems)
  }

  const deleteItem = async (itemId) => {
    const updatedItems = items.filter(item => item.id !== itemId)
    setItems(updatedItems)
    toast.success('Item deleted successfully!')
    
    // Auto-save to database
    await autoSaveGroceryList(updatedItems)
  }

  const toggleBought = async (itemId) => {
    const item = items.find(item => item.id === itemId)
    await updateItem(itemId, {
      bought: !item.bought,
      boughtDate: !item.bought ? new Date().toISOString() : null
    })
  }

  const duplicateLastWeek = async () => {
    try {
      const formattedDate = selectedDate || new Date().toISOString().split('T')[0]
      const response = await groceryListAPI.duplicateLastWeek(formattedDate)
      if (response.data?.data?.items) {
        setItems(response.data.data.items)
        toast.success('Last week\'s items duplicated successfully!')
        
        // Auto-save the duplicated items
        await autoSaveGroceryList(response.data.data.items)
      }
    } catch (error) {
      console.error('Error duplicating last week:', error)
      toast.error('Failed to duplicate last week\'s items')
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory
    const matchesBoughtFilter = !showBoughtOnly || item.bought
    return matchesSearch && matchesCategory && matchesBoughtFilter
  })

  const totalEstimated = items.reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0)
  const totalActual = items.reduce((sum, item) => sum + (item.actualPrice * item.quantity || 0), 0)
  const boughtItems = items.filter(item => item.bought).length
  const totalItems = items.length

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading grocery list...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="gradient-text">Grocery List</span>
              </h1>
              <p className="text-xl text-white/70">
                Manage your daily grocery shopping with smart tracking
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <button
                onClick={duplicateLastWeek}
                className="btn-ghost flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Duplicate Last Week</span>
              </button>
              {autoSaving && (
                <div className="flex items-center space-x-2 text-white/70">
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Auto-saving...</span>
                </div>
              )}
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex items-center space-x-4 mb-6">
            <Calendar className="w-5 h-5 text-primary-400" />
            <input
              type="date"
              value={selectedDate}
              max={new Date().toISOString().split('T')[0]} // Only allow today and past dates
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="btn-ghost text-sm"
            >
              Today
            </button>
          </div>


          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Total Items</p>
                  <p className="text-2xl font-bold text-white">{totalItems}</p>
                </div>
                <Package className="w-8 h-8 text-primary-400" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Bought</p>
                  <p className="text-2xl font-bold text-white">{boughtItems}</p>
                </div>
                <Check className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Estimated</p>
                  <p className="text-2xl font-bold text-white">₹{totalEstimated.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Actual</p>
                  <p className="text-2xl font-bold text-white">₹{totalActual.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search by name, category, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-dark-800">
                    {category}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowBoughtOnly(!showBoughtOnly)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  showBoughtOnly 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Bought Only</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Add Item Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card mb-6 relative z-20"
            >
              <h3 className="text-xl font-bold text-white mb-4">Add New Item</h3>
              {newItem.name && (
                <div className="mb-4 p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-white/70">Smart Detection:</span>
                    <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs">
                      {newItem.category}
                    </span>
                    <span className="text-white/70">Unit:</span>
                    <span className="text-white font-medium">
                      {newItem.unit}
                    </span>
                    <span className="text-green-400 text-xs">✓ Auto-filled</span>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {/* Item Name */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Item Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g., Apple, Milk, Bread, Chicken..."
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-white/20 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                        {filteredSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setNewItem({...newItem, name: suggestion})
                              setShowSuggestions(false)
                            }}
                            className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity, Unit, and Price Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Quantity</label>
                    <input
                      type="number"
                      placeholder="1"
                      min="0.1"
                      step="0.1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: parseFloat(e.target.value) || 0})}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Unit</label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      title="Unit will be auto-suggested based on item name"
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit} className="bg-dark-800">{unit}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Estimated Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={newItem.estimatedPrice}
                      onChange={(e) => setNewItem({...newItem, estimatedPrice: parseFloat(e.target.value) || 0})}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      title="Enter the estimated price for this item"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    title="Category will be auto-detected based on item name"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category} className="bg-dark-800">{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={addItem}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Item Button */}
        {!showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Item</span>
            </button>
          </motion.div>
        )}

        {/* Items List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card text-center py-12 relative z-10"
              >
                <ShoppingCart className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
                <p className="text-white/70 mb-6">
                  {searchTerm || filterCategory !== 'All' || showBoughtOnly
                    ? 'Try adjusting your filters or search terms'
                    : 'Start by adding your first grocery item'
                  }
                </p>
                {!searchTerm && filterCategory === 'All' && !showBoughtOnly && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="btn-primary"
                  >
                    Add Your First Item
                  </button>
                )}
              </motion.div>
            ) : (
              filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  className={`card ${item.bought ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <button
                        onClick={() => toggleBought(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          item.bought
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-white/30 hover:border-green-500'
                        }`}
                      >
                        {item.bought && <Check className="w-4 h-4" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className={`text-lg font-semibold ${item.bought ? 'line-through text-white/50' : 'text-white'}`}>
                            {item.name}
                          </h3>
                          <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-white/70">
                          <span>{item.quantity} {item.unit}</span>
                          <span>Est: ₹{item.estimatedPrice.toFixed(2)}</span>
                          {item.actualPrice && (
                            <span>Actual: ₹{item.actualPrice.toFixed(2)}</span>
                          )}
                          {item.bought && item.boughtDate && (
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(item.boughtDate).toLocaleDateString()}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!item.bought && (
                        <input
                          type="number"
                          placeholder="Actual price"
                          value={item.actualPrice || ''}
                          onChange={(e) => updateItem(item.id, { actualPrice: parseFloat(e.target.value) || null })}
                          className="w-24 bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      )}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default GroceryList
