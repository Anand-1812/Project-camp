import { User } from "../models/user.model.js"; // fixed path
import { ApiResponse } from "../utils/api_response.js";
import { ApiError } from "../utils/api_error.js";
import { asyncHandler } from "../utils/async_handler.js";
import { sendEmail } from "../utils/mails.js";
import { emailVerificationMailgenContent } from "../utils/mailgen_content.js"; // ensure this exists

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found while generating token");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token",
    );
  }
};

// Register user
export const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  // check for existing user
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists, try another one");
  }

  // create new user
  const user = await User.create({
    email,
    password,
    username,
    role,
    isEmailVerified: false,
  });

  // generate temporary token for email verification
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificaionToken = hashedToken;
  user.emailVerificaionExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  // send verification email
  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`, // fixed URL
    ),
  });

  // fetch the created user without sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificaionToken -emailVerificaionExpiry",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User registered successfully and verification email has been sent to your email",
      ),
    );
});
