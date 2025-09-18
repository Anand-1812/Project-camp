import { ApiResponse } from "../utils/api_response.js";
import { asyncHandler } from "../utils/async_handler.js";

/*
const healthCheck = (req, res, next) => {
  try {
    res.status(200).json(new ApiResponse(200, { message: "Server is runnig" }));
  } catch (error) {
    console.error(`Error = ${error}`);
    next(err);
  }
};
*/

const healthCheck = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, { message: "Server is running crazy" }));
});

export { healthCheck };
