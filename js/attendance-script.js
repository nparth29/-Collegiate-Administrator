document.addEventListener('DOMContentLoaded', function () {
    // Retrieve subject and semester data from sessionStorage
    const subjectCode = sessionStorage.getItem('selectedSubjectCode');
    const semester = sessionStorage.getItem('selectedSemester');
    const subjectName = sessionStorage.getItem('selectedSubjectName');
    let studentsData = [];  // To store students data globally

    // Check if all required data is available
    if (!subjectCode || !semester || !subjectName) {
        alert('Subject name or code or semester is missing. Please go back and select the subject again.');
        window.location.href = '../html/teacher-page.html'; // Changed redirect path here
        return;
    }

    // Display the subject name on the page
    document.getElementById('subject-name').textContent = subjectName;

    // Function to populate the student list table with default state (Absent)
    function populateStudentTable(students) {
        const tableBody = document.getElementById('students-table-body');
        tableBody.innerHTML = ''; // Clear any existing rows

        students.forEach(student => {
            const row = document.createElement('tr');

            const rollNoCell = document.createElement('td');
            rollNoCell.textContent = student.rollno;
            row.appendChild(rollNoCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = student.fullname;
            row.appendChild(nameCell);

            // Create 'Present' radio button
            const presentCell = document.createElement('td');
            const presentInput = document.createElement('input');
            presentInput.type = 'radio';
            presentInput.name = `attendance-${student.rollno}`;
            presentInput.value = 'Present';
            if (student.present === 'Present') presentInput.checked = true; // Update with saved state
            presentInput.addEventListener('change', () => {
                student.present = 'Present'; // Update the state when Present is selected
                populateStudentTable(studentsData);  // Re-populate the full list to reflect changes
            });
            presentCell.appendChild(presentInput);
            row.appendChild(presentCell);

            // Create 'Absent' radio button and set it checked by default
            const absentCell = document.createElement('td');
            const absentInput = document.createElement('input');
            absentInput.type = 'radio';
            absentInput.name = `attendance-${student.rollno}`;
            absentInput.value = 'Absent';
            if (student.present === 'Absent') absentInput.checked = true; // Update with saved state
            absentInput.addEventListener('change', () => {
                student.present = 'Absent'; // Update the state when Absent is selected
                populateStudentTable(studentsData);  // Re-populate the full list to reflect changes
            });
            absentCell.appendChild(absentInput);
            row.appendChild(absentCell);

            const commentCell = document.createElement('td');
            const commentInput = document.createElement('input');
            commentInput.type = 'text';
            commentInput.name = `comment-${student.rollno}`;
            commentInput.value = student.comment || ''; // Update with saved comment
            commentInput.addEventListener('change', () => {
                student.comment = commentInput.value; // Update the state when comment is changed
            });
            commentCell.appendChild(commentInput);
            row.appendChild(commentCell);

            // Store college ID in a hidden field
            const collegeIdInput = document.createElement('input');
            collegeIdInput.type = 'hidden';
            collegeIdInput.name = `collegeid-${student.rollno}`;
            collegeIdInput.value = student.collegeid;
            row.appendChild(collegeIdInput);

            tableBody.appendChild(row);
        });
    }

    // Fetch students for the selected subject and semester
    fetch(`http://localhost:5000/get-students/${semester}/${subjectCode}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                studentsData = data.students.map(student => ({
                    ...student,
                    present: 'Absent'  // Mark all students as Absent by default
                }));
                populateStudentTable(studentsData);
            } else {
                alert('Failed to fetch students for the selected subject.');
            }
        })
        .catch(error => console.error('Error fetching students:', error));

    // Handle attendance submission
    const attendanceForm = document.getElementById('attendance-form');
    attendanceForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const date = document.getElementById('attendance-date').value;
        const attendanceData = [];

        studentsData.forEach(student => {
            attendanceData.push({
                rollno: student.rollno,
                name: student.fullname,
                collegeid: student.collegeid,  // Add college ID to the attendance object
                present: student.present,      // Use updated present/absent state
                comment: student.comment || ''
            });
        });

        // Submit attendance
        fetch('http://localhost:5000/submit-attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date,
                subjectCode,
                semester,
                attendance: attendanceData
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Attendance saved successfully!');
                // Redirect back to the teacher-page.html after successful submission
                window.location.href = '../html/teacher-page.html'; // Changed redirect path here
            } else {
                alert('Failed to save attendance. Please try again.');
            }
        })
        .catch(error => console.error('Error saving attendance:', error));
    });

    // Handle student search by roll number
    document.getElementById('rollno-search').addEventListener('input', function () {
        const rollNoSearch = this.value.trim();
        
        // Find the student by roll number
        const foundStudent = studentsData.find(student => student.rollno === rollNoSearch);

        if (foundStudent) {
            // Display only the found student for marking attendance
            populateStudentTable([foundStudent]);
        } else if (rollNoSearch === '') {
            // If search bar is empty, re-populate full list
            populateStudentTable(studentsData);
        }
    });
});


