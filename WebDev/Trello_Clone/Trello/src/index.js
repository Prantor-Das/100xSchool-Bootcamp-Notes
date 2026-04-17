const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { authRouter } = require("./routes/auth.route.js");

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})