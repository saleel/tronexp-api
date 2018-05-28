import mongoose from 'mongoose';

function setupMongoose(app) {
  mongoose.Promise = global.Promise;
  mongoose.connect(app.get('MONGO_URL'));

  app.set('mongoose', mongoose);
}

export default setupMongoose;
