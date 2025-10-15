const mongoose = require('mongoose')

const groceryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0.1
  },
  unit: {
    type: String,
    required: true,
    default: 'g',
    enum: ['g', 'kg', 'ml', 'l', 'pcs', 'pkg']
  },
  estimatedPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  actualPrice: {
    type: Number,
    default: null,
    min: 0
  },
  category: {
    type: String,
    required: true,
    default: 'General',
    enum: ['General', 'Vegetables', 'Fruits', 'Dairy', 'Meat', 'Snacks', 
           'Beverages', 'Bakery', 'Frozen', 'Pantry', 'Health & Beauty', 'Other']
  },
  bought: {
    type: Boolean,
    default: false
  },
  boughtDate: {
    type: Date,
    default: null
  },
  addedDate: {
    type: Date,
    default: Date.now
  }
})

const groceryListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  items: [groceryItemSchema]
}, {
  timestamps: true
})

// Compound index to ensure one list per user per date
groceryListSchema.index({ userId: 1, date: 1 }, { unique: true })

// Index for efficient querying by user and date range
groceryListSchema.index({ userId: 1, date: 1 })

module.exports = mongoose.model('GroceryList', groceryListSchema)

