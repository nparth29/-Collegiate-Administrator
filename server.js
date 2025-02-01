
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the app
const app = express();
const port = 5000;

// Middleware to parse JSON and enable CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB (IT-Students database for storing student information)
mongoose.connect('mongodb://127.0.0.1:27017/IT-Students')
    .then(() => {
        console.log('Connected to MongoDB IT-Students');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB IT-Students:', error);
    });

// Connect to MongoDB (Teacher-Details database for storing teacher information)
const teacherConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/Teacher-Details');

teacherConnection.on('connected', () => {
    console.log('Connected to MongoDB Teacher-Details');
});

teacherConnection.on('error', (error) => {
    console.error('Error connecting to Teacher-Details database:', error);
});

// Connect to MongoDB (Attendance database for storing attendance information)
const attendanceConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/attendance');

attendanceConnection.on('connected', () => {
    console.log('Connected to MongoDB Attendance');
});

attendanceConnection.on('error', (error) => {
    console.error('Error connecting to Attendance database:', error);
});

// Connect to MongoDB (Marks database for storing marks information)
const marksConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/Marks');

marksConnection.on('connected', () => {
    console.log('Connected to MongoDB Marks');
});

marksConnection.on('error', (error) => {
    console.error('Error connecting to Marks database:', error);
});

// Connect to MongoDB (History database for storing student history)
const historyConnection = mongoose.createConnection('mongodb://127.0.0.1:27017/history');

historyConnection.on('connected', () => {
    console.log('Connected to MongoDB History');
});

historyConnection.on('error', (error) => {
    console.error('Error connecting to MongoDB History:', error);
});

// Schema for teacher registration
const teacherSchema = new mongoose.Schema({
    username: String,
    fullname: String,
    employeeid: String,
    phoneno: String,
    address: String,
    subjects: Object, // Store { "III": { "code": "subject_code", "name": "subject_name" }, ... }
    password: String
});

// Schema for student registration
const studentSchema = new mongoose.Schema({
    username: String,
    fullname: String,
    collegeid: String,
    phoneno: String,
    address: String,
    rollno: String,
    semester: String,
    subjects: Array,
    password: String
});

// Schema for Attendance
const attendanceSchema = new mongoose.Schema({
    date: String,
    subjectCode: String,
    semester: String,
    attendance: Array  // Store attendance records as an array of objects
});

// Schema for Marks
const marksSchema = new mongoose.Schema({
    rollno: String,
    studentName: String,
    collegeID: String,
    ia1: Number,
    ia2: Number,
    semester: String,
    subjectCode: String
});

// Pre-existing collection names for each semester (students)
const semesterCollections = {
    "III": "IT-Semester-III",
    "IV": "IT-Semester-IV",
    "V": "IT-Semester-V",
    "VI": "IT-Semester-VI",
    "VII": "IT-Semester-VII",
    "VIII": "IT-Semester-VIII"
};

// Helper function to get the collection name based on the selected semester (for students)
function getCollectionForSemester(semester) {
    return semesterCollections[semester];
}

// Student registration endpoint with uniqueness checks for username, rollno, and collegeid
app.post('/register-student', async (req, res) => {
    try {
        const { username, fullname, collegeid, phoneno, address, rollno, sem, password } = req.body;
        let selectedSubjects = req.body.subjects || {};  // Default to an empty object if no subjects

        console.log('Received Student Data:', req.body);

        // Validate required fields
        if (!username || !fullname || !collegeid || !phoneno || !address || !rollno || !sem || !password) {
            console.log('Missing required fields:', req.body);
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Ensure subjects is in object format
        if (typeof selectedSubjects === 'string') {
            selectedSubjects = JSON.parse(selectedSubjects);
        }

        // Prepare student data with subjects as an object
        const studentData = {
            username,
            fullname,
            collegeid,
            phoneno,
            address,
            rollno,
            semester: sem,
            subjects: selectedSubjects,  // Now storing as object
            password
        };

        // Get the correct collection name based on the selected semester
        const collectionName = getCollectionForSemester(sem);

        // If the semester is invalid, return an error
        if (!collectionName) {
            console.error('Invalid semester selected:', sem);
            return res.status(400).json({ message: 'Invalid semester selected!' });
        }

        // Use the pre-existing collection based on the semester
        const StudentModel = mongoose.model(collectionName, studentSchema, collectionName);

        // Check for existing student with the same username, roll number, or college ID in the same semester
        const existingStudent = await StudentModel.findOne({
            $or: [
                { username: username },
                { rollno: rollno },
                { collegeid: collegeid }
            ]
        });

        if (existingStudent) {
            let errorMessage = 'The following attributes are already in use: ';
            if (existingStudent.username === username) errorMessage += 'Username, ';
            if (existingStudent.rollno === rollno) errorMessage += 'Roll No, ';
            if (existingStudent.collegeid === collegeid) errorMessage += 'College ID, ';

            // Remove the last comma and space
            errorMessage = errorMessage.slice(0, -2);
            return res.status(400).json({ message: `${errorMessage}. Please modify these fields to proceed.` });
        }

        // Save the student data in the appropriate collection
        const newStudent = new StudentModel(studentData);
        await newStudent.save();

        console.log(`Student registered successfully in ${collectionName}`);
        res.status(200).json({ message: `Student registered successfully in ${collectionName}` });
    } catch (error) {
        console.error('Error registering student:', error); // Log any errors
        res.status(500).json({ message: 'Error registering student', error: error.message });
    }
});

// Teacher registration endpoint
app.post('/register-teacher', async (req, res) => {
    try {
        const { username, fullname, employeeid, phoneno, address, password, subjects } = req.body;

        console.log('Received Teacher Data:', req.body);

        // Validate required fields
        if (!username || !fullname || !employeeid || !phoneno || !address || !password || !subjects) {
            console.log('Missing required fields:', req.body);
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Prepare teacher data
        const teacherData = {
            username,
            fullname,
            employeeid,
            phoneno,
            address,
            subjects: JSON.parse(subjects), // This will now handle both code and name for each semester
            password
        };

        // Use the connection to Teacher-Details database
        const TeacherModel = teacherConnection.model('Teachers', teacherSchema, 'teachers');

        // Save the teacher data in the 'teachers' collection in the 'Teacher-Details' database
        const newTeacher = new TeacherModel(teacherData);
        await newTeacher.save();

        console.log('Teacher registered successfully in Teacher-Details database');
        res.status(200).json({ message: 'Teacher registered successfully in Teacher-Details database' });
    } catch (error) {
        console.error('Error registering teacher:', error); // Log any errors
        res.status(500).json({ message: 'Error registering teacher', error: error.message });
    }
});

// Endpoint to get all existing teachers
app.get('/get-teachers', async (req, res) => {
    try {
        const TeacherModel = teacherConnection.model('Teachers', teacherSchema, 'teachers');
        const teachers = await TeacherModel.find({}); // Fetch all teachers

        res.status(200).json({ success: true, teachers });
    } catch (error) {
        console.error('Error fetching teacher data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch teacher data', error: error.message });
    }
});

// Student login endpoint
app.post('/login-student', async (req, res) => {
    const { semester, identifier, password } = req.body;

    try {
        // Get the correct collection name based on the selected semester
        const collectionName = getCollectionForSemester(semester);
        const StudentModel = mongoose.model(collectionName, studentSchema, collectionName);

        // Find the student by username or college ID
        const student = await StudentModel.findOne({
            $or: [{ username: identifier }, { collegeid: identifier }]
        });

        if (student) {
            if (student.password === password) {
                // Return success and student full name if the password matches
                res.json({ success: true, fullname: student.fullname });
            } else {
                res.json({ success: false });
            }
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error during student login:', error);
        res.status(500).json({ success: false });
    }
});

// Teacher login endpoint
app.post('/login-teacher', async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const TeacherModel = teacherConnection.model('Teachers', teacherSchema, 'teachers');
        const teacher = await TeacherModel.findOne({
            $or: [{ username: identifier }, { employeeid: identifier }]
        });

        if (teacher) {
            if (teacher.password === password) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error during teacher login:', error);
        res.status(500).json({ success: false });
    }
});

// Endpoint to get subjects for a student based on their username or college ID and semester
app.get('/get-student-subjects/:semester/:identifier', async (req, res) => {
    const { semester, identifier } = req.params;

    try {
        const collectionName = getCollectionForSemester(semester);
        const StudentModel = mongoose.model(collectionName, studentSchema, collectionName);

        // Find the student by username or college ID
        const student = await StudentModel.findOne({
            $or: [{ username: identifier }, { collegeid: identifier }]
        });

        if (student) {
            res.status(200).json({ success: true, subjects: student.subjects, fullname: student.fullname });
        } else {
            res.status(404).json({ success: false, message: 'Student not found.' });
        }
    } catch (error) {
        console.error('Error fetching student subjects:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch subjects', error: error.message });
    }
});

// Fetch teacher's subjects after login
app.get('/get-teacher-subjects/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const TeacherModel = teacherConnection.model('Teachers', teacherSchema, 'teachers');
        const teacher = await TeacherModel.findOne({
            $or: [
                { username: username },
                { employeeid: username }  // For employee ID login
            ]
        });

        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher not found' });
        }

        // Assuming teacher.subjects is an object with semester as the key
        // and the value as an object containing subject code, name, and category.
        // We need to ensure that category field is added to each subject.

        const subjectsWithCategory = {};

        Object.keys(teacher.subjects).forEach(sem => {
            const subject = teacher.subjects[sem];

            // Add category if it's not already present
            if (!subject.category) {
                if (sem === "III" || sem === "IV" || sem === "V" || sem === "VI") {
                    subject.category = "Compulsory";  // Example logic: all subjects for III to VI are compulsory
                } else if (sem === "VII") {
                    subject.category = "Department-Level";  // Example logic for semester VII
                } else if (sem === "VIII") {
                    subject.category = "Institute-Level";  // Example logic for semester VIII
                }
            }

            subjectsWithCategory[sem] = subject;
        });

        return res.json({ success: true, subjects: subjectsWithCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Route to get students based on the semester and subject
app.get('/get-students/:semester/:subjectCode', async (req, res) => {
    const { semester, subjectCode } = req.params;
    try {
        const collectionName = getCollectionForSemester(semester);
        const StudentModel = mongoose.model(collectionName, studentSchema, collectionName);

        const students = await StudentModel.find({ 'subjects.id': subjectCode });
        res.status(200).json({ success: true, students });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch students' });
    }
});

// New Route to get students based on the selected semester only
app.get('/get-students/:semester', async (req, res) => {
    const { semester } = req.params;

    try {
        const collectionName = getCollectionForSemester(semester);
        
        if (!collectionName) {
            return res.status(400).json({ success: false, message: 'Invalid semester provided' });
        }

        const StudentModel = mongoose.model(collectionName, studentSchema, collectionName);
        const students = await StudentModel.find({});
        res.status(200).json({ success: true, students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch students', error: error.message });
    }
});

// Route to get existing marks data for a subject and semester
app.get('/get-marks/:semester/:subjectCode', async (req, res) => {
    const { semester, subjectCode } = req.params;

    try {
        const collectionName = `marks_${semester.toUpperCase()}_${subjectCode.toUpperCase()}`;
        const MarksModel = marksConnection.model('Marks', marksSchema, collectionName);

        const marks = await MarksModel.find({});
        res.status(200).json({ success: true, marks });
    } catch (error) {
        console.error('Failed to fetch marks:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch marks', error: error.message });
    }
});

// Route to submit marks to the Marks database
app.post('/submit-marks', async (req, res) => {
    const { subjectCode, semester, marks } = req.body;

    console.log("Received marks submission:", req.body);

    try {
        if (!subjectCode || !semester || !Array.isArray(marks)) {
            console.error("Invalid data structure received for marks submission");
            return res.status(400).json({ success: false, message: 'Invalid data structure' });
        }

        const collectionName = `marks_${semester.toUpperCase()}_${subjectCode.toUpperCase()}`;
        console.log(`Using collection: ${collectionName}`);

        const MarksModel = marksConnection.model('Marks', marksSchema, collectionName);

        const updatePromises = marks.map(mark => {
            const query = { rollno: mark.rollno };
            const update = {
                studentName: mark.studentName,
                collegeID: mark.collegeID,
                ia1: mark.ia1 !== undefined ? mark.ia1 : null,
                ia2: mark.ia2 !== undefined ? mark.ia2 : null,
                semester: semester.toUpperCase(),
                subjectCode: subjectCode.toUpperCase()
            };
            return MarksModel.updateOne(query, update, { upsert: true });
        });

        await Promise.all(updatePromises);
        res.status(200).json({ success: true, message: 'Marks saved successfully' });
    } catch (error) {
        console.error("Error saving marks:", error);
        res.status(500).json({ success: false, message: 'Failed to save marks', error: error.message });
    }
});


// Route to submit attendance to the attendance database
app.post('/submit-attendance', async (req, res) => {
    const { date, subjectCode, semester, attendance } = req.body;
    try {
        const collectionName = `attendance_${semester}_${subjectCode}`;
        const AttendanceModel = attendanceConnection.model('Attendance', attendanceSchema, collectionName);

        // Check if attendance already exists for the given date
        const existingRecord = await AttendanceModel.findOne({ date });

        if (existingRecord) {
            // Update the existing attendance record for that date
            existingRecord.attendance = attendance;
            await existingRecord.save();
            res.status(200).json({ success: true, message: 'Attendance updated successfully' });
        } else {
            // Create a new attendance record if it doesn't exist
            const newAttendance = new AttendanceModel({
                date,
                subjectCode,
                semester,
                attendance
            });

            await newAttendance.save();
            res.status(200).json({ success: true, message: 'Attendance saved successfully' });
        }
    } catch (error) {
        console.error('Failed to save or update attendance:', error);
        res.status(500).json({ success: false, message: 'Failed to save attendance' });
    }
});


// Route to get attendance records for a specific subject and semester
app.get('/view-attendance/:semester/:subjectCode', async (req, res) => {
    const { semester, subjectCode } = req.params;

    try {
        const collectionName = `attendance_${semester}_${subjectCode}`;
        const AttendanceModel = attendanceConnection.model('Attendance', attendanceSchema, collectionName);

        const attendanceRecords = await AttendanceModel.find({});
        res.status(200).json({ success: true, attendanceRecords });
    } catch (error) {
        console.error('Failed to fetch attendance records:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance records', error: error.message });
    }
});

// Route to get marks for a specific student based on their identifier, semester, and subject code
app.get('/get-student-marks/:semester/:subjectCode/:identifier', async (req, res) => {
    const { semester, subjectCode, identifier } = req.params;

    try {
        const collectionName = `marks_${semester.toUpperCase()}_${subjectCode.toUpperCase()}`;
        const MarksModel = marksConnection.model('Marks', marksSchema, collectionName);

        const studentMarks = await MarksModel.findOne({ collegeID: identifier });

        if (studentMarks) {
            res.status(200).json({ success: true, marks: [studentMarks] });
        } else {
            res.status(404).json({ success: false, message: 'Marks not found for the specified student.' });
        }
    } catch (error) {
        console.error('Failed to fetch marks for student:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch marks for student', error: error.message });
    }
});

// Sample Route to Fetch Student Attendance
app.get('/view-student-attendance/:semester/:subjectCode/:identifier', async (req, res) => {
    const { semester, subjectCode, identifier } = req.params;
    try {
        const collectionName = `attendance_${semester}_${subjectCode}`;
        const AttendanceModel = attendanceConnection.model('Attendance', attendanceSchema, collectionName);

        const attendanceRecords = await AttendanceModel.find({ 'attendance.collegeid': identifier });

        if (attendanceRecords.length > 0) {
            res.status(200).json({ success: true, attendanceRecords });
        } else {
            res.status(404).json({ success: false, message: 'No attendance records found for this student.' });
        }
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance records', error: error.message });
    }
});

// // Schema for student history
// const studentHistorySchema = new mongoose.Schema({
//     username: String,
//     fullname: String,
//     collegeid: String,
//     phoneno: String,
//     address: String,
//     rollno: String,
//     history: [
//         {
//             semester: String,
//             subjects: Array,
//             attendance: Array,  // All attendance records for the student
//             marks: Array         // All marks records for the student
//         }
//     ]
// });
const studentHistorySchema = new mongoose.Schema({
    username: String,
    fullname: String,
    collegeid: String,
    phoneno: String,
    address: String,
    rollno: String,
    semester: String, // Store current semester outside
    history: [
        {
            subjects: [
                {
                    code: String,
                    name: String,
                    attendance: [
                        {
                            date: String,
                            status: String
                        }
                    ],
                    marks: {
                        ia1: Number,
                        ia2: Number
                    }
                }
            ]
        }
    ]
});



// Updated Helper function to move all student data to the history database
async function moveAllStudentsToHistory(semester, year) {
    try {
        const currentSemesterCollection = getCollectionForSemester(semester);
        const StudentModel = mongoose.model(currentSemesterCollection, studentSchema, currentSemesterCollection);

        // Fetch all students from the current semester
        const students = await StudentModel.find({});

        // Loop through each student
        for (let student of students) {
            let historySubjects = [];

            // Iterate through each subject to fetch attendance and marks for that subject
            for (let subject of student.subjects) {
                const subjectCode = subject.id;
                const subjectName = subject.name;

                // Attendance
                const attendanceCollectionName = `attendance_${semester}_${subjectCode}`;
                const AttendanceModel = attendanceConnection.model('Attendance', attendanceSchema, attendanceCollectionName);
                
                // Fetch attendance records for the specific student and subject
                const attendanceRecords = await AttendanceModel.find({
                    'attendance.collegeid': student.collegeid
                });

                // Filter and structure the attendance data for the subject
                let attendance = [];
                attendanceRecords.forEach(record => {
                    const studentAttendance = record.attendance.find(a => a.collegeid === student.collegeid);
                    if (studentAttendance) {
                        attendance.push({
                            date: record.date,
                            status: studentAttendance.present ? "Present" : "Absent"
                        });
                    }
                });

                // Marks
                const marksCollectionName = `marks_${semester}_${subjectCode}`;
                const MarksModel = marksConnection.model('Marks', marksSchema, marksCollectionName);

                // Fetch marks for the specific student and subject
                const marksRecord = await MarksModel.findOne({ collegeID: student.collegeid });

                // Structure marks data for the subject
                let marks = {};
                if (marksRecord) {
                    marks = {
                        ia1: marksRecord.ia1,
                        ia2: marksRecord.ia2
                    };
                }

                // Compile subject information
                historySubjects.push({
                    code: subjectCode,
                    name: subjectName,
                    attendance: attendance,
                    marks: marks
                });

                // Clean up attendance and marks data for the student in the current collections
                await AttendanceModel.updateMany(
                    { 'attendance.collegeid': student.collegeid },
                    { $pull: { attendance: { collegeid: student.collegeid } } }
                );
                await AttendanceModel.deleteMany({ attendance: { $size: 0 } }); // Remove empty records
                await MarksModel.deleteOne({ collegeID: student.collegeid });
            }

            // Move student data to the history database
            const historyCollectionName = `std-history-${semester}-${year}`;
            const StudentHistoryModel = historyConnection.model(historyCollectionName, studentHistorySchema, historyCollectionName);

            // Create a new document for each student in the history collection
            const studentHistory = new StudentHistoryModel({
                username: student.username,
                fullname: student.fullname,
                collegeid: student.collegeid,
                phoneno: student.phoneno,
                address: student.address,
                rollno: student.rollno,
                semester: semester, // Store current semester outside the history array
                history: [
                    {
                        subjects: historySubjects // Store all subject data
                    }
                ]
            });

            // Save the updated history document
            await studentHistory.save();

            // Remove the student's data from the current semester collection
            await StudentModel.deleteOne({ _id: student._id });
        }

        console.log(`All students' data moved from semester ${semester} to history for the year ${year}.`);
    } catch (error) {
        console.error('Error moving students to history:', error);
    }
}

// New route to upgrade all students for a semester
app.post('/upgrade-all-students-semester', async (req, res) => {
    const { semester, year } = req.body; // Get year from request

    try {
        await moveAllStudentsToHistory(semester, year);
        res.status(200).json({ success: true, message: `All students in semester ${semester} moved to history for year ${year}.` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to upgrade students and move to history.', error: error.message });
    }
});

// Route to handle teacher semester upgrade
app.post('/upgrade-teacher-semester', async (req, res) => {
    const { semester, year } = req.body;

    try {
        console.log(`Upgrading students to ${semester} for year ${year}`);

        // Call the function to upgrade students
        await moveAllStudentsToHistory(semester, year);

        // Respond with success
        res.status(200).json({ success: true, message: 'Semester upgraded successfully!' });
    } catch (error) {
        console.error('Error upgrading semester:', error);
        res.status(500).json({ success: false, message: 'Error upgrading semester.' });
    }
});










// Route to fetch past attendance records for a specific semester and subject
app.get('/view-past-attendance/:semesterYear/:subjectCode', async (req, res) => {
    const { semesterYear, subjectCode } = req.params;

    try {
        // Define the collection name for the history collection based on semester-year
        const historyCollection = `std-history-${semesterYear}`;
        const StudentHistoryModel = historyConnection.model(historyCollection, studentHistorySchema, historyCollection);

        // Find all students with attendance records for the specific subjectCode
        const attendanceRecords = await StudentHistoryModel.find(
            { 'history.subjects.code': subjectCode },
            { 'history.$': 1, fullname: 1, rollno: 1, collegeid: 1 }
        );

        // Process the data to extract attendance information
        const attendanceData = attendanceRecords.map(record => {
            const historyEntry = record.history[0];
            const subjectEntry = historyEntry.subjects.find(sub => sub.code === subjectCode);
            const attendanceDates = subjectEntry?.attendance.map(a => `${a.date} (${a.status})`) || [];

            return {
                rollno: record.rollno,
                studentName: record.fullname,
                collegeID: record.collegeid,
                attendanceDates
            };
        });

        res.status(200).json({ success: true, attendanceRecords: attendanceData });
    } catch (error) {
        console.error('Error fetching past attendance:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance records.' });
    }
});

// Route to fetch past marks records for a specific semester and subject
app.get('/view-past-marks/:semesterYear/:subjectCode', async (req, res) => {
    const { semesterYear, subjectCode } = req.params;

    try {
        // Define the collection name for the history collection based on semester-year
        const historyCollection = `std-history-${semesterYear}`;
        const StudentHistoryModel = historyConnection.model(historyCollection, studentHistorySchema, historyCollection);

        // Find students with marks records for the subjectCode
        const marksRecords = await StudentHistoryModel.find(
            { 'history.subjects.code': subjectCode },
            { 'history.$': 1, fullname: 1, rollno: 1, collegeid: 1 }
        );

        // Process the data to extract marks information
        const marksData = marksRecords.map(record => {
            const subject = record.history[0].subjects.find(sub => sub.code === subjectCode);
            return {
                rollno: record.rollno,
                studentName: record.fullname,
                collegeID: record.collegeid,
                ia1: subject?.marks?.ia1 ?? 'N/A',
                ia2: subject?.marks?.ia2 ?? 'N/A'
            };
        });

        res.status(200).json({ success: true, marksRecords: marksData });
    } catch (error) {
        console.error('Error fetching past marks:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch marks records.' });
    }
});









// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
