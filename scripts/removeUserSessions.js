const mongoose = require('mongoose');

module.exports = async userId => {
  const sessionCollection = mongoose.connection.collection('sessions');

  await sessionCollection.find().forEach(doc => {
    if (doc.session.includes(`"userId":"${userId}"`)) {
      sessionCollection.deleteOne({ _id: doc._id });
    }
  });
};
