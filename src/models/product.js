const mongoose = require('mongoose');

const allowedCategories = ['Electronics', 'Clothing', 'Home', 'Beauty'];

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim:true, validate:{
    validator: function(name){
      return name.length > 0;
    },
    message: 'name cannot be empty'   
  } 
},
  description: { type: String, validator: function(description){
    return description.length > 0;
  },
  message: 'description cannot be empty'
 },
  price: { type: Number, required: true },
  category: { type: String, required: true, 
    enum:{values: allowedCategories, message: `category must be one of ${allowedCategories.join(', ')}`} 
    // valiadte:{
    //   validator: function(arr){
    //     return arr.every(cat => allowedCategories.includes(cat));
    //   }
    // }
  },
    
  inStock: { type: Boolean, default: true, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
