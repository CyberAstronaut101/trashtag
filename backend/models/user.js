const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");




var userSchema = mongoose.Schema({
        firstname: String,
        lastname: String,
        studentID: String,
        phone: String,
        email: { type: String, require: true, unique: true},
        password: String,
        userLevel: String,
        laserInUse: Boolean,
        history: [
            {
                type: { type: String },
                dates: String,
                fileName: String,
                machineID: String,
                price: Number,
                created_at: {type: Date, required: true, default: Date}
            }
        ],
        laserLab01: Boolean,
        woodShop01: Boolean,
        woodShop02: Boolean,
        woodShop03: Boolean
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);