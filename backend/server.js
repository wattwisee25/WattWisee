const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/wattWisee', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error(err));

const UserSchema = new mongoose.Schema({
  contact_name: String,
  company_name: String,
  register_as: String,
  SEAI_number: String,
  phone: String,
  email: String,
  password: String,
  permission_contact: Boolean
});
const User = mongoose.model('User', UserSchema);

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));
