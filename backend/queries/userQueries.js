import User from "../models/User.js";

export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserById = async (id) => {
  return await User.findById(id);
};
