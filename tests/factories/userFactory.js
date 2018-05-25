const mongoose = require('mongoose');
const User = mongoose.model('User');

// auto save data for us, then return as resource.
module.exports = () => {
  return new User({}).save();
};