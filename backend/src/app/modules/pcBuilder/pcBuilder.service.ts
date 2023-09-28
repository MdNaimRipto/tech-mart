import httpStatus from "http-status";
import { Users } from "../user/user.schema";
import { IPcBuilder } from "./pcBuilder.interface";
import ApiError from "../../../errors/ApiError";
import { PcBuilder } from "./pcBuilder.schema";
import { pcBuilderPopulatePaths } from "./pcBuilder.populatePaths";

const buildPc = async (payload: IPcBuilder): Promise<IPcBuilder> => {
  const { userID } = payload;
  const isUserExists = await Users.findById({ _id: userID });
  if (!isUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Does Not Exist's!");
  }

  const pc = await PcBuilder.create(payload);
  return pc;
};

const getBuildPcByUserId = async (userID: string): Promise<IPcBuilder[]> => {
  const savedPCs = await PcBuilder.find({ userID }).populate(
    pcBuilderPopulatePaths
  );
  if (!savedPCs.length) {
    throw new ApiError(httpStatus.NOT_FOUND, "0 Build Found!");
  }

  return savedPCs;
};

const getBuildPcById = async (buildId: string): Promise<IPcBuilder | null> => {
  const savedPC = await PcBuilder.findById({ _id: buildId }).populate(
    pcBuilderPopulatePaths
  );
  if (!savedPC) {
    throw new ApiError(httpStatus.NOT_FOUND, "Build Does Not Exists!");
  }

  return savedPC;
};

const deleteBuild = async (
  buildId: string,
  userID: string
): Promise<IPcBuilder | null> => {
  const isUserExists = await Users.findById({ _id: userID });
  if (!isUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Does Not Exist's!");
  }

  const isBuildExists = await PcBuilder.findById({ _id: buildId });
  if (!isBuildExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Build Does Not Exist's!");
  }

  if (userID !== String(isBuildExists.userID)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Failed To Delete");
  }

  const result = await PcBuilder.findOneAndDelete(
    { _id: buildId },
    {
      new: true,
    }
  );
  return result;
};

export const PcBuilderService = {
  buildPc,
  getBuildPcByUserId,
  getBuildPcById,
  deleteBuild,
};