import mongoose from 'mongoose';

const TransactionSchema = mongoose.Schema({
  asset: String,
  hash: {
    type: String,
    index: { unique: true }
  },
  from: String,
  to: String,
  amount: Number,
  blockNumber: { type: Number, index: true },
  timestamp: {
    type: Number,
    set: function(v) {
      return Math.round(v);
    }
  },
  createdOn: { type: Date, default: Date.now }
});

TransactionSchema.index({ blockNumber: 1 });
TransactionSchema.index({ from: 1 });
TransactionSchema.index({ to: 1 });

const Transaction = mongoose.model('transactions', TransactionSchema);

export default Transaction;
