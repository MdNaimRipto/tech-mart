import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import {
  IAuthenticatedUser,
  IForgotPasswordValidator,
  ILoginUser,
  IUpdatePassword,
  IUser,
} from "./user.interface";
import { Users } from "./user.schema";
import bcrypt from "bcrypt";
import { generateUID } from "./user.utils";
import config from "../../../config/config";
import { omit } from "lodash";

//* User Register
const userRegister = async (payload: IUser): Promise<IAuthenticatedUser> => {
  const { email, contactNumber } = payload;
  // Check if the email or contact already exists
  const isExistsUser = await Users.findOne({
    $or: [{ email }, { contactNumber }],
  });
  if (isExistsUser) {
    throw new ApiError(httpStatus.CONFLICT, "Email or Contact Already Exists");
  }

  // Generate UID
  const uid = generateUID();

  // Check UID Exists or Not
  const isUIDExists = await Users.findOne({ uid: uid });
  if (isUIDExists) {
    throw new ApiError(httpStatus.CONFLICT, "User Already Exists");
  }

  // Save UID
  payload.uid = uid;

  // Create User
  const user = await Users.create(payload);

  const authenticatedUser = omit(user.toObject(), ["password"]);
  return authenticatedUser as unknown as IAuthenticatedUser;
};

//* User Login
const userLogin = async (
  payload: ILoginUser
): Promise<IAuthenticatedUser | null> => {
  const { email, password } = payload;
  const isExists = await Users.findOne({ email: email });

  if (!isExists) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Email Or Password");
  }

  const checkPassword = await bcrypt.compare(password, isExists.password);

  if (!checkPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Email Or Password");
  }

  // Use lodash to omit the password field
  const authenticatedUser = omit(isExists.toObject(), ["password"]);
  return authenticatedUser as unknown as IAuthenticatedUser;
};

//* Get All User Api [Admin Api]
const getAllUser = async (): Promise<IUser[]> => {
  const users = await Users.find(
    {},
    {
      _id: 0,
      firstName: 1,
      lastName: 1,
      email: 1,
      contactNumber: 1,
      userProfile: 1,
    }
  ).lean();
  if (users.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Users Found to Show!");
  }
  return users;
};

//* User Update
const updateUser = async (
  userID: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExistsUser = await Users.findById({ _id: userID });
  if (!isExistsUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const { userRole, uid, ...updatePayload } = payload;

  if (userRole !== undefined || uid !== undefined) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Permission Denied! Please Try Again."
    );
  }

  if (payload.email) {
    const isExists = await Users.findOne({ email: payload.email });
    if (isExists) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Email Already Exists! Try Another One."
      );
    }
    updatePayload.email = payload.email;
  }

  if (payload.password) {
    const isPreviousPass = await bcrypt.compare(
      payload.password,
      isExistsUser.password as string
    );

    if (isPreviousPass) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "New Password Cannot be The Previous Password"
      );
    }
    const newPassword = await bcrypt.hash(
      payload.password,
      Number(config.salt_round)
    );
    updatePayload.password = newPassword;
  }

  const result = await Users.findOneAndUpdate({ _id: userID }, updatePayload, {
    new: true,
  });

  return result;
};

// Forgot Password Part-1 Find user via email
const findUserForForgotPassword = async (
  email: string
): Promise<IForgotPasswordValidator> => {
  const user = await Users.findOne(
    { email: email },
    {
      _id: 0,
      email: 1,
    }
  ).lean();
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  return user;
};

// Forgot Password Part-2
const forgotPassword = async (
  payload: IUpdatePassword
): Promise<IUser | null> => {
  const { email, password } = payload;
  const isExistsUser = await Users.findOne({ email: email });
  if (!isExistsUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (!password || !email) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Password Update Failed!. Try Again."
    );
  }

  const isPreviousPass = await bcrypt.compare(
    password,
    isExistsUser.password as string
  );

  if (isPreviousPass) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "New Password Cannot be The Previous Password"
    );
  }
  const newPass = await bcrypt.hash(password, Number(config.salt_round));
  payload.password = newPass;

  const result = await Users.findOneAndUpdate({ email: email }, payload, {
    new: true,
  });

  return result;
};

// Delete User
const deleteUser = async (userID: string): Promise<IUser | null> => {
  const isExists = await Users.findById({ _id: userID });
  if (!isExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found");
  }

  const deleteUser = await Users.findOneAndDelete(
    { _id: userID },
    {
      new: true,
    }
  );

  return deleteUser;
};

export const UserService = {
  userRegister,
  userLogin,
  getAllUser,
  updateUser,
  findUserForForgotPassword,
  forgotPassword,
  deleteUser,
};
