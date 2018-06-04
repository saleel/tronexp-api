import mongoose from 'mongoose';

const TransactionSchema = mongoose.Schema({
  owner: String,
  contractType: String,
  hash: {
    type: String,
    index: { unique: true }
  },
  blockNumber: { type: Number, index: true },
  timestamp: {
    type: Number,
    set: function(v) {
      return Math.round(v);
    }
  },
  // data: {
  //   asset: String,
  //   from: String,
  //   to: String,
  //   amount: Number,
  //   owner: String,
  //   votes: { type: Array, default: void 0 },
  //   voteAddresses: { type: [String], default: void 0 },
  //   support: Boolean,
  //   count: Number,
  //   type: String,
  //   owner: String,
  //   name: String,
  // },
  data: Object,
  createdOn: { type: Date, default: Date.now }
});

TransactionSchema.index({ blockNumber: 1 });
TransactionSchema.index({ 'data.from': 1 });
TransactionSchema.index({ 'data.to': 1 });

const Transaction = mongoose.model('transactions', TransactionSchema);

export default Transaction;
