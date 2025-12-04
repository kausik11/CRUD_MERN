const Product = require('../models/product');
// const allowedcategory = ['Electronics', 'Clothing', 'Home', 'Beauty'];

// Create product
const createProduct = async (req, res) => {
  const { name, description, price, category, inStock } = req.body || {};

  // Basic validation for expected fields and types
  if (!name || typeof name !== 'string') {
    if(name.trim().length === 0) {
        return res.status(400).json({ message: 'name cannot be empty' });
    }
    return res.status(400).json({ message: 'name is required and must be a string' });
  }
  if (price === undefined || typeof price !== 'number') {
    return res.status(400).json({ message: 'price is required and must be a number' });
  }
  if (description !== undefined) {
    if (typeof description !== 'string') {
      return res.status(400).json({ message: 'description must be a string if provided' });
    }
    if (description.trim().length === 0) {
      return res.status(400).json({ message: 'description cannot be empty' });
    }
  }
  if (category !== undefined) {
     if(typeof category !== 'string'){
       return res.status(400).json({ message: 'category must be a string if provided' });
    }
    // if(!allowedcategory.includes(category)) {
    //   return res.status(400).json({ message: `category must be one of ${allowedcategory.join(', ')}` });
    // }
  }
  if (inStock !== undefined && typeof inStock !== 'boolean') {
    return res.status(400).json({ message: 'inStock must be a boolean if provided' });
  }

  try {
    const product = await Product.create({ name, description, price, category, inStock });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products
const getProducts = async (_req, res) => {
  // if (!_req.dbconnect) {
  //   return res.status(503).json({
  //     message: "server is down, wait until it is fixed.",
  //   });
  // }
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Get single product by id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Invalid product ID' });
    // this will pass the error to the global error handling middleware
      //  next(error);
  }
};

// Update product
//for better practices we try to validate the data within the model (for reference use createProduct function)
const updateProduct = async (req, res) => {
  try {
    //this oeration will update the product instantly without check the logic
    // const product = await Product.findByIdAndUpdate(req.params.id, req.body, { 
    //   new: true, //By default, Mongoose returns old document before update. but we define new: true to “Return the updated document instead of the old one.”
    //   runValidators: true //This ensures the update obeys the model schema validation.
    // });

    // search the product first
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.body.price < product.price && req.body.price !== undefined) {
      return res.status(404).json({ message: 'product price cannot be lower than before, contact the admin' });
    } 

    // the model validator only works only when a create an entry not while updating the entry
    if( req.body.description !== undefined && req.body.description.trim().length === 0) {
      return res.status(400).json({ message: 'description cannot be empty' });

    }
    await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //By default, Mongoose returns old document before update. but we define new: true to “Return the updated document instead of the old one.”
      runValidators: true //This ensures the update obeys the model schema validation.
    })
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     if(product.inStock) {
//       return res.status(400).json({ message: 'Cannot delete a product that is in stock' });
//     }else{
//       res.json({ message: 'Product deleted' });
//     }
   
//   } catch (error) {
//     res.status(400).json({ message: 'Invalid product ID' });
//   }
// };


const deleteProduct = async (req,res)=>{
try {
  // find the id first
  const product = await Product.findById(req.params.id);
  if(!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  //check the product is in stock or not 
  if(product.inStock){
    return res.status(400).json({ message: 'Cannot delete a product that is in stock' });
  }else{
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  }
  
} catch (error) {
  res.status(400).json({ message: 'Invalid product ID' });
}
}


module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
