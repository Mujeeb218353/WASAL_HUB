import jwt from "jsonwebtoken";
import asyncHandler from "../utils/async.handler.util.js";
import apiResponse from "../utils/api.response.util.js";
import apiError from "../utils/api.error.util.js";
import { WASAL_BACKEND_BASE_URL, JWT_ACCESS_KEY } from "../constant.js";
import axios from "axios";
import fs from "fs";


const verifyUserJWT = asyncHandler(async (req, _, next) => {

  try {

    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new apiError(401, "Unauthorized request");
    }

    let decodedToken;

    try {

      decodedToken = jwt.verify(token, JWT_ACCESS_KEY);

    } catch (error) {

      console.error("Middleware Error 1:", error)

      fs.unlinkSync(req.file?.path || req.files?.[0]?.path || "");

      throw new apiError(401, "Invalid access token");

    }

    // const res = await axios.get(`${WASAL_BACKEND_BASE_URL}/Auth/IUserManagementFeature/GetUser/${decodedToken.UserId}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // });
    
    // const user = res.data.data;

    // console.log(user)

    // if(user && user.userId === decodedToken.UserId) {
    //   req.user = user;
    // } else {
    //   throw new apiError(user?.statusCode || 401, user?.message || "Unauthorized request");
    // }

    req.user = decodedToken;

    next();

  } catch (error) {

    if(req.file?.path || req.files?.[0]?.path) {
      fs.unlinkSync(req.file?.path || req.files?.[0]?.path || "");
    }

    console.error("Middleware Error 2:", error)

    throw new apiError(401, error?.message || "Invalid access token");
  }

});

export default verifyUserJWT;