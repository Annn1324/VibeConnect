const mongoose = require('mongoose');

// Schema lưu thông tin tài khoản người dùng.
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fullname: {
    type: String,
    required: true,
  },
    password: { type: String, required: true }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
