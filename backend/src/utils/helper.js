import User from '../models/user.models.js';
import ApiError from './ApiError.js';

export const requiredField = (requiredField = []) => {
   try {
         requiredField.some((field) => String(field).trim === "" || field === undefined)
   } catch (error) {
       throw new ApiError(404, "all fields are required")
   }
}

export const removeRefreshTokenAndPassword = async(userId) => {
    await User.findById(userId).select("-password -refreshToken")
}
