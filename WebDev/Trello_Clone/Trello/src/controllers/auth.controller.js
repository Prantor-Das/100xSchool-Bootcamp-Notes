const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

let USERS_ID = 1;
const users = [];
const secret = process.env.JWT_SECRET || "asdfghjkl"

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = users.find(u => u.username === username);
    
    if (existingUser) {
      return res.status(409).json({
        message: "User with this username already exists"
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    users.push({
      username,
      password: hashedPassword,
      id: USERS_ID++
    });
    
    console.log(users);
    
    res.json({
      message: "You have signed up successfully",
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    // let checkUser = null; 
    // for (const u of users) { 
    //    if (u.username === username && await bcrypt.compare(password, u.password)) { 
    //      checkUser = u; 
    //      break; 
    //    } 
    // }
    
    const user = users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(403).json({
        message: "Incorrect credentials"
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      secret,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Signed In successfully",
      token,
    });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  signup,
  signin
};