import mongoose from 'mongoose';

const Image = new mongoose.Schema(
    {
    photo : {type:String,required : true },
    username :  {type:String,required : true },
    userId :  {type:Object,required : true }

    },
    {
        collection : "Images",
    }
)

const ImageSchema = mongoose.model('Images',Image)
// mongoose.model('Images',Image)
export default ImageSchema;
