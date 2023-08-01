const express = require('express');
const User = require('../models/User');
const router = express.Router();
const  bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
// const fetchuser = require('../middelware/fetchuser');
const fetchuser = require('../middelware/fetchuser')

const JWT_SECRET = "meharisagoodboy";

//  ROUTER 1 end poit create user 

router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Enter a valid password').isLength({ min: 5 }),
],  async (req, res) => {
  let success = false;

  // if tjere are any errors return a bad request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  let existingUser = await User.findOne({ email: req.body.email }); // Rename the variable to 'existingUser'
  if (existingUser) {
    return res.status(400).json({ success, error: "Sorry, a user with this email already exists" });
     
  }
  try {
    
 const salt = await bcrypt.genSalt(10);
 const secpass = await bcrypt.hash(req.body.password, salt)

  
  let newUser = await User.create({
    name: req.body.name,
    password: secpass,
    email: req.body.email,
  });
  const data ={
    User:{
      id :User.id
    }


  }


  const authtoken = jwt.sign(data, JWT_SECRET);
success = true;
  res.json({ success, authtoken });
} catch (error) {
 console.error(error.message);   
 res.status(500).send("some erro occur");
}
});


//  ROUTER # 2 login end point 
// ... (previous code)

// ROUTER # 2 login endpoint
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let foundUser = await User.findOne({ email });
    if (!foundUser) {
      success = false;
      return res.status(400).json({ error: "Sorry, user does not exist" });
    }

    // Use bcrypt.compare to compare passwords correctly
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      success = false;
      return res.status(400).json({  success ,error: "Invalid credentials" });
    }

    const data = {
      User: {
        id: foundUser.id
      }
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success, authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTER #3 Get login user details fetching data using Middleware
// ... (keep the rest of the code for the /getuser endpoint the same)

// Add more routes and middleware as needed
module.exports = router;


  //ROUTER #3 GEt login user details fetching data usind MIddelware 

  
// Route for fetching user details after login
// ... (previous code)

// Route for fetching user details after login
router.get('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming fetchuser middleware sets the user ID in req.user
    const user = await User.findOne({ _id: userId }).select('-password'); // Excluding the 'password' field from the response
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal server error');
  }
});

// Add more routes and middleware as needed
module.exports = router;



