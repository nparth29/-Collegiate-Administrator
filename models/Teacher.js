const mongoose = require('mongoose');

// Define the Teacher schema
const teacherSchema = new mongoose.Schema({
    username: String,
    fullname: String,
    employeeid: String,
    phoneno: String,
    address: String,
    subjects: Object,  // Store subjects in object format
    password: String
});

// Create and export the Teacher model
const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
