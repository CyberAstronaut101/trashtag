const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");


const deptInfoSchema = mongoose.Schema({
    deptName: {type: String, required: true, unique: true },  // digitallab, woodshop
    buisnessHours: [
        {
            daysOfWeek: { type: String, value: [String]},
            startTime: { type: Date, required: true},
            endTime: { type: Date, required: true }
        }
    ]
});

deptInfoSchema.plugin(uniqueValidator);
module.exports = mongoose.model('DeptInfo', deptInfoSchema);