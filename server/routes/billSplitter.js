const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Calculate bill split
router.post('/calculate', [
  body('totalAmount').isFloat({ min: 0.01 }).withMessage('Total amount must be greater than 0'),
  body('personCount').isInt({ min: 1 }).withMessage('Person count must be at least 1'),
  body('tipPercentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Tip percentage must be between 0 and 100'),
  body('taxPercentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Tax percentage must be between 0 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      totalAmount, 
      personCount, 
      tipPercentage = 0, 
      taxPercentage = 0,
      customAmounts = null 
    } = req.body;

    // Calculate tip and tax
    const tipAmount = (totalAmount * tipPercentage) / 100;
    const taxAmount = (totalAmount * taxPercentage) / 100;
    const subtotal = totalAmount - tipAmount - taxAmount;

    let result;

    if (customAmounts && Array.isArray(customAmounts) && customAmounts.length === personCount) {
      // Custom amounts provided
      const totalCustomAmount = customAmounts.reduce((sum, amount) => sum + amount, 0);
      const difference = totalAmount - totalCustomAmount;
      
      result = {
        type: 'custom',
        totalAmount,
        subtotal,
        tipAmount,
        taxAmount,
        personCount,
        customAmounts: customAmounts.map((amount, index) => ({
          person: index + 1,
          amount: parseFloat(amount.toFixed(2)),
          percentage: parseFloat(((amount / totalAmount) * 100).toFixed(2))
        })),
        difference: parseFloat(difference.toFixed(2)),
        isBalanced: Math.abs(difference) < 0.01
      };
    } else {
      // Equal split
      const amountPerPerson = totalAmount / personCount;
      
      result = {
        type: 'equal',
        totalAmount,
        subtotal,
        tipAmount,
        taxAmount,
        personCount,
        amountPerPerson: parseFloat(amountPerPerson.toFixed(2)),
        splitDetails: Array.from({ length: personCount }, (_, index) => ({
          person: index + 1,
          amount: parseFloat(amountPerPerson.toFixed(2))
        }))
      };
    }

    res.json({
      success: true,
      data: result,
      calculatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Bill splitter calculation error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Get calculation history (mock data for now)
router.get('/history', async (req, res) => {
  try {
    // In a real app, you'd fetch from database
    const history = [
      {
        id: '1',
        totalAmount: 120.50,
        personCount: 4,
        amountPerPerson: 30.13,
        calculatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '2',
        totalAmount: 85.75,
        personCount: 3,
        amountPerPerson: 28.58,
        calculatedAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    res.json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Save calculation (mock for now)
router.post('/save', [
  body('totalAmount').isFloat({ min: 0.01 }).withMessage('Total amount must be greater than 0'),
  body('personCount').isInt({ min: 1 }).withMessage('Person count must be at least 1'),
  body('amountPerPerson').isFloat({ min: 0 }).withMessage('Amount per person must be positive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { totalAmount, personCount, amountPerPerson, notes } = req.body;

    // In a real app, you'd save to database
    const savedCalculation = {
      id: Date.now().toString(),
      userId: req.user._id,
      totalAmount,
      personCount,
      amountPerPerson,
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Calculation saved successfully',
      data: savedCalculation
    });

  } catch (error) {
    console.error('Save calculation error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = router;
