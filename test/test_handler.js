const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const mongod = new MongoMemoryServer();

//connect to the in-memory database
module.exports.connect = async () => {
  const uri = await mongod.getConnectionString();

  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  };

  await mongoose.connect(uri, mongooseOpts);
};

// drop the database, close the connection and stop mongod.
module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

// remove all data for all db connections.
module.exports.clearDatabase = async () => {
  const collections = await mongoose.connection.db.collections();
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteOne();
  }
};

module.exports.getObjectId = (id) => {
  return mongoose.Types.ObjectId(id);
};
