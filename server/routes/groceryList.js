const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const GroceryList = require('../models/GroceryList')

// Test endpoint to check database connection
router.get('/test', auth, async (req, res) => {
  try {
    const count = await GroceryList.countDocuments()
    res.json({
      success: true,
      message: 'Database connection working',
      count: count
    })
  } catch (error) {
    console.error('Database test failed:', error)
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    })
  }
})

// Get grocery list for a specific date
router.get('/:date', auth, async (req, res) => {
  try {
    const { date } = req.params
    const userId = req.user.id
    
    const groceryList = await GroceryList.findOne({ 
      userId, 
      date 
    }).populate('userId', 'email profile')
    
    if (!groceryList) {
      return res.json({
        success: true,
        data: {
          items: []
        }
      })
    }
    
    res.json({
      success: true,
      data: {
        items: groceryList.items
      }
    })
  } catch (error) {
    console.error('Error fetching grocery list:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grocery list'
    })
  }
})

// Add item to grocery list
router.post('/:date/items', auth, async (req, res) => {
  try {
    const { date } = req.params
    const { name, quantity, unit, estimatedPrice, category, bought, actualPrice, boughtDate } = req.body
    const userId = req.user.id
    
    if (!name || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Name and quantity are required'
      })
    }
    
    const newItem = {
      name,
      quantity: parseFloat(quantity),
      unit: unit || 'g',
      estimatedPrice: parseFloat(estimatedPrice) || 0,
      actualPrice: actualPrice ? parseFloat(actualPrice) : null,
      category: category || 'General',
      bought: bought || false,
      boughtDate: boughtDate ? new Date(boughtDate) : null,
      addedDate: new Date()
    }
    
    // Find or create grocery list for this date
    let groceryList = await GroceryList.findOne({ userId, date })
    
    if (!groceryList) {
      groceryList = new GroceryList({
        userId,
        date,
        items: [newItem]
      })
    } else {
      groceryList.items.push(newItem)
    }
    
    await groceryList.save()
    
    res.json({
      success: true,
      data: newItem,
      message: 'Item added successfully'
    })
  } catch (error) {
    console.error('Error adding item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add item'
    })
  }
})

// Update item (mark as bought, update price, etc.)
router.put('/:date/items/:itemId', auth, async (req, res) => {
  try {
    const { date, itemId } = req.params
    const { bought, actualPrice, name, quantity, unit, estimatedPrice, category, boughtDate } = req.body
    const userId = req.user.id
    
    const groceryList = await GroceryList.findOne({ userId, date })
    if (!groceryList) {
      return res.status(404).json({
        success: false,
        message: 'Grocery list not found'
      })
    }
    
    const item = groceryList.items.id(itemId)
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      })
    }
    
    // Update item fields
    if (bought !== undefined) {
      item.bought = bought
      item.boughtDate = bought ? (boughtDate ? new Date(boughtDate) : new Date()) : null
    }
    if (actualPrice !== undefined) {
      item.actualPrice = actualPrice ? parseFloat(actualPrice) : null
    }
    if (name) item.name = name
    if (quantity !== undefined) item.quantity = parseFloat(quantity)
    if (unit) item.unit = unit
    if (estimatedPrice !== undefined) item.estimatedPrice = parseFloat(estimatedPrice)
    if (category) item.category = category
    
    await groceryList.save()
    
    res.json({
      success: true,
      data: item,
      message: 'Item updated successfully'
    })
  } catch (error) {
    console.error('Error updating item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update item'
    })
  }
})

// Delete item
router.delete('/:date/items/:itemId', auth, async (req, res) => {
  try {
    const { date, itemId } = req.params
    const userId = req.user.id
    
    const groceryList = await GroceryList.findOne({ userId, date })
    if (!groceryList) {
      return res.status(404).json({
        success: false,
        message: 'Grocery list not found'
      })
    }
    
    const item = groceryList.items.id(itemId)
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      })
    }
    
    item.remove()
    await groceryList.save()
    
    res.json({
      success: true,
      message: 'Item deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete item'
    })
  }
})

// Get monthly summary
router.get('/summary/:year/:month', auth, async (req, res) => {
  try {
    const { year, month } = req.params
    const userId = req.user.id
    
    // Create date range for the month
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]
    
    // Find all grocery lists for the user in the specified month
    const groceryLists = await GroceryList.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    })
    
    let totalSpent = 0
    let totalItems = 0
    const dailyData = {}
    
    groceryLists.forEach(groceryList => {
      const boughtItems = groceryList.items.filter(item => item.bought && item.actualPrice)
      const dayTotal = boughtItems.reduce((sum, item) => sum + (item.actualPrice * item.quantity), 0)
      
      totalSpent += dayTotal
      totalItems += groceryList.items.filter(item => item.bought).length
      dailyData[groceryList.date] = dayTotal
    })
    
    res.json({
      success: true,
      data: {
        totalSpent,
        totalItems,
        dailyData
      }
    })
  } catch (error) {
    console.error('Error fetching monthly summary:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly summary'
    })
  }
})

// Duplicate last week's list
router.post('/:date/duplicate-last-week', auth, async (req, res) => {
  try {
    const { date } = req.params
    const userId = req.user.id
    
    const lastWeek = new Date(date)
    lastWeek.setDate(lastWeek.getDate() - 7)
    const lastWeekDate = lastWeek.toISOString().split('T')[0]
    
    // Find last week's grocery list
    const lastWeekList = await GroceryList.findOne({ userId, date: lastWeekDate })
    if (!lastWeekList || lastWeekList.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No items found from last week'
      })
    }
    
    // Create new items based on last week's items
    const newItems = lastWeekList.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit || 'g',
      estimatedPrice: item.estimatedPrice,
      actualPrice: null,
      category: item.category,
      bought: false,
      boughtDate: null,
      addedDate: new Date()
    }))
    
    // Find or create current date's grocery list
    let currentList = await GroceryList.findOne({ userId, date })
    if (!currentList) {
      currentList = new GroceryList({
        userId,
        date,
        items: newItems
      })
    } else {
      currentList.items.push(...newItems)
    }
    
    await currentList.save()
    
    res.json({
      success: true,
      data: {
        items: newItems
      },
      message: 'Last week\'s items duplicated successfully'
    })
  } catch (error) {
    console.error('Error duplicating last week:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate last week\'s items'
    })
  }
})

// Bulk save/update grocery list (for the Save button functionality)
router.post('/:date/save', auth, async (req, res) => {
  try {
    const { date } = req.params
    const { items } = req.body
    const userId = req.user.id
    
    console.log('Bulk save request:', { date, userId, itemsCount: items?.length })
    
    if (!Array.isArray(items)) {
      console.error('Invalid items format:', typeof items)
      return res.status(400).json({
        success: false,
        message: 'Items must be an array'
      })
    }
    
    // Find or create grocery list for this date
    let groceryList = await GroceryList.findOne({ userId, date })
    
    if (!groceryList) {
      // Create new grocery list
      groceryList = new GroceryList({
        userId,
        date,
        items: items.map(item => ({
          name: item.name,
          quantity: parseFloat(item.quantity),
          unit: item.unit || 'g',
          estimatedPrice: parseFloat(item.estimatedPrice) || 0,
          actualPrice: item.actualPrice ? parseFloat(item.actualPrice) : null,
          category: item.category || 'General',
          bought: item.bought || false,
          boughtDate: item.boughtDate ? new Date(item.boughtDate) : null,
          addedDate: item.addedDate ? new Date(item.addedDate) : new Date()
        }))
      })
    } else {
      // Replace all items with the new ones
      groceryList.items = items.map(item => ({
        name: item.name,
        quantity: parseFloat(item.quantity),
        unit: item.unit || 'g',
        estimatedPrice: parseFloat(item.estimatedPrice) || 0,
        actualPrice: item.actualPrice ? parseFloat(item.actualPrice) : null,
        category: item.category || 'General',
        bought: item.bought || false,
        boughtDate: item.boughtDate ? new Date(item.boughtDate) : null,
        addedDate: item.addedDate ? new Date(item.addedDate) : new Date()
      }))
    }
    
    await groceryList.save()
    console.log('Grocery list saved successfully:', { 
      id: groceryList._id, 
      itemsCount: groceryList.items.length 
    })
    
    res.json({
      success: true,
      data: {
        items: groceryList.items
      },
      message: 'Grocery list saved successfully'
    })
  } catch (error) {
    console.error('Error saving grocery list:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    res.status(500).json({
      success: false,
      message: 'Failed to save grocery list',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
})

module.exports = router
