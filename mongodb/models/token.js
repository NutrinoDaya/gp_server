import  mongoose  from 'mongoose';

const tokenSchema = new mongoose.Schema({
  email: String,
  token: String,
});

const Token = mongoose.model('Token', tokenSchema);

export default Token