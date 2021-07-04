const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  sslc: {
    type: Number,
    required: true
  },
  hsc: {
    type: Number,
    required: true
  },
  ug: {
    type: Number,
    required: true
  },
  pg: {
    type: Number,
    required: false
  },
  years: {
    type: String,
    required: true
  },
  exp: {
    type: String,
    required: true
  },
  skills: {
    type: String,
    required: true
  },
  jobprofile: {
    type: String,
    required: true
  },  
  about: {
    type: String,
    required: true
  },
  resume: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  portfolio:{
    type: String,
    required: false 
  }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;

//String,Integer,Double,Boolean,Null,ObjectId,Undefined,BinaryData,DateNumb