import mongoose from 'mongoose';

const AccountSchema = mongoose.Schema({
  address: {
    type: String,
    index: { unique: true }
  },
  blocks: [String],
  createdOn: { type: Date, default: Date.now }
});

const Account = mongoose.model('accounts', AccountSchema);

export default Account;
