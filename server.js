const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db.js');
const app = express();
const port = 9000;  

const authRoute = require('./routes/auth_route.js');
const userRoute = require('./routes/user_route.js');
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});