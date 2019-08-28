import mongoose from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

import { config } from '../config/config';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmid: this.isAdmin }, config.jwtPrivateKey, {});
  return token;
}

const User = mongoose.model('User', userSchema);

const validateUser = (user) => {
  const validateSchema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
    isAdmin: Joi.boolean()
  }

  return Joi.validate(user, validateSchema)
}

const validateAuthUser = (user) => {
  const validateSchema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required()
  }


  return Joi.validate(user, validateSchema)
}

export { User, validateUser, validateAuthUser };
