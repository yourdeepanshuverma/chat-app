import asyncHandler from "express-async-handler";

const deleteFromCloudinary = asyncHandler(async () => {
  console.log("deleted");
});

export default deleteFromCloudinary;
