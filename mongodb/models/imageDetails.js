import mongoose from "mongoose";
const userImageDetails = new mongoose.Schema(
  {
   image:String
  },
  {
    collection: "userImageDetails",
  }
);

const userImageDetailsSchema = mongoose.model("userImageDetails", userImageDetails);
// mongoose.model('Images',Image)
export default userImageDetailsSchema;