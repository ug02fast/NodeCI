jest.setTimeout(30000);

const user = require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

// useMongoClient to get rid of depcrecation warning.
mongoose.Promise = global.Promise; // record keeping adminsitration 
mongoose.connect(keys.mongoURI, { useMongoClient: true });