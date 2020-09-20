const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    // ^ will raise an error if you try to add a user with an already existing email
    date_added_into_database: {
      type: Date,
      default: Date.now,
      alias: "date"
      // ^ 'date_added_into_database' has now been virtually tied to 'date' and can be get/set by referring to 'date'
    }
  },
  {
    // schema options
    /*
     Mongoose virtually sets 'id' as 
     a virtual getter of its '_id' property, to disable this, set 
      id: false
    in the schema options
    */
  }
);

// a virtual property in your schema
UserSchema.virtual("firstname").get(function() {
  // since virtuals arent actually stored in the database, you cannot query with them
  return this.name.split(/[^A-Za-z]/g)[0];
});

// a setter
UserSchema.path("name").set(function(val) {
  // capitalize and add an exclamation mark to each user's name, before creating/updating
  return val.charAt(0).toUpperCase() + val.substr(1) + "!";
});

// middleware
UserSchema.pre("save", function(next) {
  console.log(`New User saved.`);
  // ^ logged whenever a new user is saved
  // welcome emails can be sent when this is triggered
  next();
});

//a method of the schema instance
UserSchema.methods.introduce = function() {
  let introduction = `Hi! I am ${this.firstname}, and my email is '${this.email}'.`;
  console.log(introduction);
};
// a method of the schema itself
UserSchema.statics.findUsersByName = function(name) {
  return this.find({ name: new RegExp("(.*)" + name + "(.*)", "ig") });
  // ^ find all users whose name contains [var name]
};
module.exports = mongoose.model("User", UserSchema);
