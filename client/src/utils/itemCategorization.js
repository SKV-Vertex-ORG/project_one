// Smart categorization based on item names
export const categorizeItem = (itemName) => {
  const name = itemName.toLowerCase()
  
  // Fruits
  const fruits = ['apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'mango', 'pineapple', 'watermelon', 'kiwi', 'peach', 'pear', 'cherry', 'lemon', 'lime', 'avocado', 'papaya', 'coconut', 'pomegranate', 'fig', 'date', 'cranberry', 'raspberry', 'blackberry', 'plum', 'apricot', 'nectarine', 'guava', 'passion fruit', 'dragon fruit']
  
  // Vegetables
  const vegetables = ['carrot', 'potato', 'onion', 'tomato', 'cucumber', 'lettuce', 'spinach', 'broccoli', 'cauliflower', 'cabbage', 'pepper', 'bell pepper', 'chili', 'garlic', 'ginger', 'celery', 'radish', 'beetroot', 'corn', 'peas', 'beans', 'mushroom', 'eggplant', 'zucchini', 'squash', 'pumpkin', 'sweet potato', 'turnip', 'leek', 'asparagus', 'artichoke', 'okra', 'brussels sprouts', 'kale', 'arugula', 'bok choy', 'cabbage', 'cauliflower']
  
  // Dairy
  const dairy = ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'sour cream', 'cottage cheese', 'mozzarella', 'cheddar', 'parmesan', 'feta', 'ricotta', 'gouda', 'swiss', 'brie', 'camembert', 'cream cheese', 'mascarpone', 'buttermilk', 'kefir', 'greek yogurt', 'ice cream', 'frozen yogurt']
  
  // Meat
  const meat = ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'fish', 'salmon', 'tuna', 'shrimp', 'crab', 'lobster', 'sausage', 'bacon', 'ham', 'steak', 'chops', 'ground beef', 'ground turkey', 'ground chicken', 'ribs', 'wings', 'drumsticks', 'thighs', 'breast', 'fillet', 'cutlet', 'meatball', 'patty', 'burger', 'hot dog', 'salami', 'pepperoni', 'prosciutto', 'chorizo', 'bratwurst', 'kielbasa']
  
  // Bakery
  const bakery = ['bread', 'bagel', 'croissant', 'muffin', 'donut', 'cake', 'pie', 'cookie', 'biscuit', 'cracker', 'pretzel', 'roll', 'bun', 'pita', 'tortilla', 'waffle', 'pancake', 'french toast', 'scone', 'pastry', 'tart', 'brownie', 'cupcake', 'muffin', 'baguette', 'sourdough', 'rye bread', 'whole wheat', 'white bread', 'pita bread', 'naan', 'flatbread']
  
  // Beverages
  const beverages = ['water', 'juice', 'soda', 'coffee', 'tea', 'beer', 'wine', 'whiskey', 'vodka', 'rum', 'gin', 'brandy', 'cognac', 'champagne', 'prosecco', 'cider', 'lemonade', 'iced tea', 'energy drink', 'sports drink', 'coconut water', 'almond milk', 'soy milk', 'oat milk', 'rice milk', 'coconut milk', 'kombucha', 'smoothie', 'shake', 'frappuccino', 'latte', 'cappuccino', 'espresso', 'americano', 'mocha', 'hot chocolate', 'cocoa']
  
  // Snacks
  const snacks = ['chips', 'crackers', 'nuts', 'almonds', 'walnuts', 'cashews', 'pistachios', 'peanuts', 'popcorn', 'pretzels', 'trail mix', 'granola', 'cereal', 'candy', 'chocolate', 'gummy', 'lollipop', 'gum', 'mints', 'jerky', 'beef jerky', 'turkey jerky', 'dried fruit', 'raisins', 'dates', 'figs', 'apricots', 'cranberries', 'banana chips', 'apple chips', 'veggie chips', 'pita chips', 'tortilla chips', 'cheese puffs', 'cheetos', 'doritos', 'lays', 'pringles']
  
  // Frozen
  const frozen = ['frozen', 'ice cream', 'frozen yogurt', 'frozen fruit', 'frozen vegetables', 'frozen pizza', 'frozen meal', 'frozen dinner', 'frozen breakfast', 'frozen waffle', 'frozen pancake', 'frozen burrito', 'frozen lasagna', 'frozen soup', 'frozen smoothie', 'frozen juice', 'frozen yogurt', 'sorbet', 'gelato', 'frozen berries', 'frozen peas', 'frozen corn', 'frozen spinach', 'frozen broccoli', 'frozen cauliflower', 'frozen mixed vegetables']
  
  // Pantry
  const pantry = ['rice', 'pasta', 'noodles', 'flour', 'sugar', 'salt', 'pepper', 'spices', 'herbs', 'oil', 'vinegar', 'sauce', 'ketchup', 'mustard', 'mayo', 'mayonnaise', 'relish', 'pickles', 'olives', 'capers', 'anchovies', 'tuna', 'sardines', 'beans', 'lentils', 'chickpeas', 'quinoa', 'oats', 'cereal', 'granola', 'honey', 'syrup', 'jam', 'jelly', 'preserves', 'marmalade', 'peanut butter', 'almond butter', 'cashew butter', 'sunflower butter', 'tahini', 'hummus', 'salsa', 'pesto', 'marinara', 'alfredo', 'teriyaki', 'soy sauce', 'worcestershire', 'hot sauce', 'sriracha', 'tabasco', 'barbecue sauce', 'ranch', 'italian dressing', 'caesar dressing', 'vinaigrette', 'balsamic', 'olive oil', 'coconut oil', 'vegetable oil', 'canola oil', 'sesame oil', 'truffle oil']
  
  // Health & Beauty
  const healthBeauty = ['shampoo', 'conditioner', 'soap', 'body wash', 'lotion', 'cream', 'moisturizer', 'sunscreen', 'deodorant', 'antiperspirant', 'toothpaste', 'toothbrush', 'floss', 'mouthwash', 'vitamins', 'supplements', 'medicine', 'bandage', 'bandaid', 'cotton', 'cotton swab', 'q-tip', 'tissue', 'toilet paper', 'paper towel', 'napkin', 'diaper', 'baby wipes', 'makeup', 'cosmetics', 'perfume', 'cologne', 'aftershave', 'razor', 'blade', 'tampon', 'pad', 'condom', 'lubricant', 'massage oil', 'essential oil', 'candle', 'incense', 'air freshener', 'fabric softener', 'detergent', 'bleach', 'disinfectant', 'hand sanitizer', 'alcohol', 'hydrogen peroxide', 'rubbing alcohol', 'iodine', 'betadine', 'neosporin', 'vaseline', 'petroleum jelly', 'chapstick', 'lip balm', 'nail polish', 'nail polish remover', 'nail file', 'tweezers', 'scissors', 'comb', 'brush', 'hair tie', 'bobby pin', 'barrette', 'headband', 'scrunchy']

  if (fruits.some(fruit => name.includes(fruit))) return 'Fruits'
  if (vegetables.some(veg => name.includes(veg))) return 'Vegetables'
  if (dairy.some(d => name.includes(d))) return 'Dairy'
  if (meat.some(m => name.includes(m))) return 'Meat'
  if (bakery.some(b => name.includes(b))) return 'Bakery'
  if (beverages.some(bev => name.includes(bev))) return 'Beverages'
  if (snacks.some(s => name.includes(s))) return 'Snacks'
  if (frozen.some(f => name.includes(f))) return 'Frozen'
  if (pantry.some(p => name.includes(p))) return 'Pantry'
  if (healthBeauty.some(h => name.includes(h))) return 'Health & Beauty'
  
  return 'General'
}

// Smart unit suggestions based on category
export const getSuggestedUnit = (category, itemName) => {
  const name = itemName.toLowerCase()
  
  if (category === 'Fruits' || category === 'Vegetables') {
    if (name.includes('juice') || name.includes('smoothie')) return 'ml'
    if (name.includes('small') || name.includes('individual')) return 'pcs'
    return 'kg'
  }
  
  if (category === 'Dairy') {
    if (name.includes('milk') || name.includes('juice') || name.includes('cream')) return 'ml'
    if (name.includes('cheese') || name.includes('butter')) return 'g'
    return 'pcs'
  }
  
  if (category === 'Meat') {
    return 'kg'
  }
  
  if (category === 'Bakery') {
    if (name.includes('bread') || name.includes('roll') || name.includes('bagel')) return 'pcs'
    return 'g'
  }
  
  if (category === 'Beverages') {
    return 'ml'
  }
  
  if (category === 'Snacks') {
    if (name.includes('nuts') || name.includes('chips') || name.includes('crackers')) return 'g'
    return 'pcs'
  }
  
  if (category === 'Pantry') {
    if (name.includes('oil') || name.includes('vinegar') || name.includes('sauce')) return 'ml'
    if (name.includes('rice') || name.includes('pasta') || name.includes('flour')) return 'kg'
    return 'g'
  }
  
  return 'g'
}

// Price suggestions based on category and item
export const getSuggestedPrice = (category, itemName) => {
  const name = itemName.toLowerCase()
  
  // Basic price ranges by category (in rupees)
  const priceRanges = {
    'Fruits': { min: 20, max: 200 },
    'Vegetables': { min: 15, max: 150 },
    'Dairy': { min: 30, max: 300 },
    'Meat': { min: 200, max: 800 },
    'Bakery': { min: 10, max: 100 },
    'Beverages': { min: 20, max: 150 },
    'Snacks': { min: 20, max: 200 },
    'Frozen': { min: 50, max: 400 },
    'Pantry': { min: 30, max: 300 },
    'Health & Beauty': { min: 50, max: 500 },
    'General': { min: 20, max: 200 }
  }
  
  const range = priceRanges[category] || priceRanges['General']
  return Math.round((range.min + range.max) / 2)
}

// Popular item suggestions
export const popularItems = [
  'Apple', 'Banana', 'Milk', 'Bread', 'Eggs', 'Rice', 'Chicken', 'Onion', 'Tomato', 'Potato',
  'Cheese', 'Yogurt', 'Orange', 'Carrot', 'Spinach', 'Broccoli', 'Chicken Breast', 'Ground Beef',
  'Salmon', 'Pasta', 'Olive Oil', 'Butter', 'Sugar', 'Salt', 'Coffee', 'Tea', 'Water',
  'Chips', 'Cookies', 'Cereal', 'Oats', 'Honey', 'Garlic', 'Ginger', 'Lemon', 'Cucumber',
  'Lettuce', 'Bell Pepper', 'Mushroom', 'Eggplant', 'Zucchini', 'Corn', 'Peas', 'Beans'
]

// Categories list
export const categories = [
  'All', 'General', 'Vegetables', 'Fruits', 'Dairy', 'Meat', 
  'Snacks', 'Beverages', 'Bakery', 'Frozen', 'Pantry', 
  'Health & Beauty', 'Other'
]

// Units list
export const units = ['g', 'kg', 'ml', 'l', 'pcs', 'pkg']
