module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const userSchema = new Schema({
    __v: {
      type: Number,
      select: false,
    },
    email: {
      type: String,
      require: true,
    },
    nickname: {
      type: String,
      require: true,
    },
    passwd: {
      type: String,
      require: true,
      select: false,
    },
    avatar: {
      type: String,
      require: false,
    },
  });
  return mongoose.model("User", userSchema);
};
