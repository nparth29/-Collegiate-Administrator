// document.addEventListener('DOMContentLoaded', function () {
//     let originalData = [];
//     let defaulterData = [];

//     const subjectCode = sessionStorage.getItem('selectedSubjectCode');
//     const semester = sessionStorage.getItem('selectedSemester');
//     const subjectName = sessionStorage.getItem('selectedSubjectName'); // Fetch the subject name from session

//     if (!subjectCode || !semester || !subjectName) {
//         alert('Subject or semester information is missing. Please go back and select the subject again.');
//         window.location.href = '../html/teacher-page.html';
//         return;
//     }

//     // Display the subject name on the page
//     document.getElementById('subject-name').textContent = subjectName;

//     // Fetch attendance data from the server based on the selected subject and semester
//     fetch(`http://localhost:5000/view-attendance/${semester}/${subjectCode}`)
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 originalData = data.attendanceRecords;
//                 displayAttendanceRecords(originalData);
//                 calculateAttendancePercentage(originalData); // Calculate percentage initially
//             } else {
//                 displayNoRecordsMessage();
//                 console.error('Failed to fetch attendance records:', data.message);
//             }
//         })
//         .catch(error => {
//             displayNoRecordsMessage();
//             console.error('Error fetching attendance records:', error);
//         });

//     // Function to display attendance records in a table format
//     function displayAttendanceRecords(records) {
//         const container = document.getElementById('attendanceResultsContainer');
//         const tableHead = document.getElementById('attendanceTableHead');
//         container.innerHTML = ''; // Clear previous content
//         tableHead.innerHTML = ''; // Clear the existing header content

//         if (!records || records.length === 0) {
//             displayNoRecordsMessage();
//             return;
//         }

//         // Create the header with dates as columns
//         const headerRow = document.createElement('tr');
//         headerRow.innerHTML = `<th class="fixed-column">Roll No</th><th class="fixed-column">Name</th>`;
//         const uniqueDates = [...new Set(records.map(record => new Date(record.date).toLocaleDateString()))]; // Extract unique dates

//         uniqueDates.forEach(date => {
//             const dateHeader = document.createElement('th');
//             dateHeader.textContent = date; // Add each date as a column header
//             headerRow.appendChild(dateHeader);
//         });
//         headerRow.innerHTML += `<th class="fixed-column">Attendance Percentage</th>`; // Add Percentage column
//         tableHead.appendChild(headerRow);

//         // Group records by student
//         const groupedRecords = groupRecordsByStudent(records);

//         Object.keys(groupedRecords).forEach(rollNo => {
//             const student = groupedRecords[rollNo];
//             const row = document.createElement('tr');
//             row.classList.add('student-row');

//             // Create a cell for Roll No and Name
//             row.innerHTML = `
//                 <td class="fixed-column">${rollNo}</td>
//                 <td class="fixed-column">${student.name}</td>
//             `;

//             // Create cells for each date (mark Present/Absent)
//             uniqueDates.forEach(date => {
//                 const attendanceRecord = student.attendance.find(att => att.date === date);
//                 const statusCell = document.createElement('td');
//                 statusCell.textContent = attendanceRecord ? attendanceRecord.status : "Absent";
//                 row.appendChild(statusCell);
//             });

//             // Add attendance percentage cell
//             const percentageCell = document.createElement('td');
//             percentageCell.classList.add('fixed-column');
//             percentageCell.textContent = student.percentage ? student.percentage.toFixed(2) + "%" : "N/A";
//             percentageCell.style.color = student.percentage < 75 ? 'red' : 'black';
//             row.appendChild(percentageCell);

//             // Highlight defaulter students with background color
//             if (student.percentage < 75) {
//                 row.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'; // Light red background for defaulters
//                 defaulterData.push({ rollNo, ...student }); // Add to defaulters list if below 75%
//             }

//             container.appendChild(row);
//         });
//     }

//     // Function to group records by student and calculate attendance percentage
//     function groupRecordsByStudent(records) {
//         const totalDays = [...new Set(records.map(record => record.date))].length; // Calculate total unique days
//         const grouped = records.reduce((acc, record) => {
//             record.attendance.forEach(studentRecord => {
//                 const rollNo = studentRecord.rollno;
//                 if (!acc[rollNo]) {
//                     acc[rollNo] = { name: studentRecord.name, attendance: [], presentDays: 0 };
//                 }
//                 acc[rollNo].attendance.push({
//                     date: new Date(record.date).toLocaleDateString(),
//                     status: studentRecord.present || "Absent"
//                 });
//                 if (studentRecord.present === "Present") {
//                     acc[rollNo].presentDays++;
//                 }
//             });
//             return acc;
//         }, {});

//         Object.keys(grouped).forEach(rollNo => {
//             grouped[rollNo].percentage = (grouped[rollNo].presentDays / totalDays) * 100;
//         });
//         return grouped;
//     }

//     // Function to calculate attendance percentage (ensures correct display)
//     function calculateAttendancePercentage(records) {
//         defaulterData = []; // Reset defaulter data
//         const grouped = groupRecordsByStudent(records);
//         const rows = document.querySelectorAll('.student-row');
//         rows.forEach(row => {
//             const rollNo = row.children[0].innerText.trim();
//             const student = grouped[rollNo];
//             if (student && student.percentage < 75) {
//                 row.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'; // Light red background for defaulters
//                 defaulterData.push({ rollNo, ...student });
//             } else {
//                 row.style.backgroundColor = ''; // Reset background color if not a defaulter
//             }
//         });
//     }

//     // Display a message when no records are found
//     function displayNoRecordsMessage() {
//         const container = document.getElementById('attendanceResultsContainer');
//         container.innerHTML = '<tr><td colspan="5" class="text-center text-danger">No attendance records found for this subject and semester.</td></tr>';
//     }

//     // Search by Roll No (on input change)
//     document.getElementById('searchRollNo').addEventListener('input', function () {
//         const searchValue = document.getElementById('searchRollNo').value.trim().toLowerCase();

//         // Filter the original data based on the roll number search
//         const filteredRecords = originalData
//             .map(record => ({
//                 date: record.date,
//                 attendance: record.attendance.filter(student => student.rollno.toLowerCase() === searchValue)
//             }))
//             .filter(record => record.attendance.length > 0);

//         displayAttendanceRecords(filteredRecords);
//     });

//     // Handle date selection
//     document.getElementById('specificDate').addEventListener('change', function () {
//         const selectedDate = document.getElementById('specificDate').value;
//         if (!selectedDate) return; // Exit if no date is selected

//         const formattedDate = new Date(selectedDate).toLocaleDateString();

//         // Filter the original data based on the selected date
//         const filteredRecords = originalData
//             .map(record => ({
//                 date: record.date,
//                 attendance: record.attendance.filter(student => new Date(record.date).toLocaleDateString() === formattedDate)
//             }))
//             .filter(record => record.attendance.length > 0);

//         displayAttendanceRecords(filteredRecords); // Display the filtered records based on date
//     });

//     // View Defaulter List
//     document.getElementById('viewDefaulterButton').addEventListener('click', function () {
//         calculateAttendancePercentage(originalData); // Recalculate percentage for accurate results
//         const defaultersOnly = originalData
//             .map(record => ({
//                 date: record.date,
//                 attendance: record.attendance.filter(student => {
//                     const rollNo = student.rollno;
//                     const percentage = defaulterData.find(def => def.rollNo === rollNo)?.percentage;
//                     return percentage < 75;
//                 })
//             }))
//             .filter(record => record.attendance.length > 0);

//         displayAttendanceRecords(defaultersOnly); // Show only defaulters
//     });

//     // Export table data to Excel
//     document.getElementById('exportButton').addEventListener('click', function () {
//         const table = document.querySelector('table');
//         const wb = XLSX.utils.table_to_book(table, { sheet: "Attendance Data" });
//         XLSX.writeFile(wb, 'AttendanceData.xlsx');
//     });

//     // Export Defaulter List to Excel
//     document.getElementById('exportDefaulterButton').addEventListener('click', function () {
//         const container = document.createElement('table');
//         container.innerHTML = `
//             <tr>
//                 <th>Roll No</th>
//                 <th>Name</th>
//                 <th>Attendance Percentage</th>
//             </tr>
//         `;

//         defaulterData.forEach(defaulter => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${defaulter.rollNo}</td>
//                 <td>${defaulter.name}</td>
//                 <td>${defaulter.percentage.toFixed(2)}%</td>
//             `;
//             container.appendChild(row);
//         });

//         const wb = XLSX.utils.table_to_book(container, { sheet: "Defaulter List" });
//         XLSX.writeFile(wb, 'DefaulterList.xlsx');
//     });

//     // Refresh button to reload the page
//     document.getElementById('refreshButton').addEventListener('click', function () {
//         location.reload();
//     });
// });

















// document.addEventListener('DOMContentLoaded', function () {
//     let originalData = [];
//     let defaulterData = [];

//     const subjectCode = sessionStorage.getItem('selectedSubjectCode');
//     const semester = sessionStorage.getItem('selectedSemester');
//     const subjectName = sessionStorage.getItem('selectedSubjectName'); // Fetch the subject name from session

//     if (!subjectCode || !semester || !subjectName) {
//         alert('Subject or semester information is missing. Please go back and select the subject again.');
//         window.location.href = '../html/teacher-page.html';
//         return;
//     }

//     // Display the subject name on the page
//     document.getElementById('subject-name').textContent = subjectName;

//     // Fetch attendance data from the server based on the selected subject and semester
//     fetch(`http://localhost:5000/view-attendance/${semester}/${subjectCode}`)
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 originalData = data.attendanceRecords;
//                 displayAttendanceRecords(originalData);
//             } else {
//                 displayNoRecordsMessage();
//                 console.error('Failed to fetch attendance records:', data.message);
//             }
//         })
//         .catch(error => {
//             displayNoRecordsMessage();
//             console.error('Error fetching attendance records:', error);
//         });

//     // Function to display attendance records in a table format
//     function displayAttendanceRecords(records) {
//         const container = document.getElementById('attendanceResultsContainer');
//         const tableHead = document.getElementById('attendanceTableHead');
//         container.innerHTML = ''; // Clear previous content
//         tableHead.innerHTML = ''; // Clear the existing header content

//         if (!records || records.length === 0) {
//             displayNoRecordsMessage();
//             return;
//         }

//         // Create the header with dates as columns
//         const headerRow = document.createElement('tr');
//         headerRow.innerHTML = `<th class="fixed-column">Roll No</th><th class="fixed-column">Name</th>`;
//         const uniqueDates = [...new Set(records.map(record => new Date(record.date).toLocaleDateString()))]; // Extract unique dates

//         uniqueDates.forEach(date => {
//             const dateHeader = document.createElement('th');
//             dateHeader.textContent = date; // Add each date as a column header
//             headerRow.appendChild(dateHeader);
//         });
//         headerRow.innerHTML += `<th class="fixed-column">Comments</th><th class="fixed-column">Attendance Percentage</th>`; // Add Comments and Percentage column
//         tableHead.appendChild(headerRow);

//         // Group records by student
//         const groupedRecords = groupRecordsByStudent(records);

//         Object.keys(groupedRecords).forEach(rollNo => {
//             const student = groupedRecords[rollNo];
//             const row = document.createElement('tr');
//             row.classList.add('student-row');

//             // Create a cell for Roll No and Name
//             row.innerHTML = `
//                 <td class="fixed-column">${rollNo}</td>
//                 <td class="fixed-column">${student.name}</td>
//             `;

//             // Create cells for each date (mark Present/Absent)
//             uniqueDates.forEach(date => {
//                 const attendanceRecord = student.attendance.find(att => att.date === date);
//                 const statusCell = document.createElement('td');
//                 statusCell.textContent = attendanceRecord ? attendanceRecord.status : "Absent";
//                 row.appendChild(statusCell);
//             });

//             // Add the Comments cell
//             const commentCell = document.createElement('td');
//             commentCell.classList.add('fixed-column');
//             commentCell.textContent = student.comment || "No Comment"; // Display the comment if available
//             row.appendChild(commentCell);

//             // Add attendance percentage cell
//             const percentageCell = document.createElement('td');
//             percentageCell.classList.add('fixed-column');
//             percentageCell.textContent = student.percentage ? student.percentage.toFixed(2) + "%" : "N/A";
//             percentageCell.style.color = student.percentage < 75 ? 'red' : 'black';
//             row.appendChild(percentageCell);

//             // Highlight defaulter students with background color
//             if (student.percentage < 75) {
//                 row.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'; // Light red background for defaulters
//                 defaulterData.push({ rollNo, ...student }); // Add to defaulters list if below 75%
//             }

//             container.appendChild(row);
//         });
//     }

//     // Function to group records by student and calculate attendance percentage
//     function groupRecordsByStudent(records) {
//         const totalDays = [...new Set(records.map(record => record.date))].length; // Calculate total unique days
//         const grouped = records.reduce((acc, record) => {
//             record.attendance.forEach(studentRecord => {
//                 const rollNo = studentRecord.rollno;
//                 if (!acc[rollNo]) {
//                     acc[rollNo] = { name: studentRecord.name, attendance: [], presentDays: 0, comment: studentRecord.comment };
//                 }
//                 acc[rollNo].attendance.push({
//                     date: new Date(record.date).toLocaleDateString(),
//                     status: studentRecord.present || "Absent"
//                 });
//                 if (studentRecord.present === "Present") {
//                     acc[rollNo].presentDays++;
//                 }
//             });
//             return acc;
//         }, {});

//         Object.keys(grouped).forEach(rollNo => {
//             grouped[rollNo].percentage = (grouped[rollNo].presentDays / totalDays) * 100;
//         });
//         return grouped;
//     }

//     // Display a message when no records are found
//     function displayNoRecordsMessage() {
//         const container = document.getElementById('attendanceResultsContainer');
//         container.innerHTML = '<tr><td colspan="6" class="text-center text-danger">No attendance records found for this subject and semester.</td></tr>';
//     }

//     // Search by Roll No (on input change)
//     document.getElementById('searchRollNo').addEventListener('input', function () {
//         const searchValue = document.getElementById('searchRollNo').value.trim().toLowerCase();

//         // Filter the original data based on the roll number search
//         const filteredRecords = originalData
//             .map(record => ({
//                 date: record.date,
//                 attendance: record.attendance.filter(student => student.rollno.toLowerCase() === searchValue)
//             }))
//             .filter(record => record.attendance.length > 0);

//         displayAttendanceRecords(filteredRecords);
//     });

//     // Handle date selection
//     document.getElementById('specificDate').addEventListener('change', function () {
//         const selectedDate = document.getElementById('specificDate').value;
//         if (!selectedDate) return; // Exit if no date is selected

//         const formattedDate = new Date(selectedDate).toLocaleDateString();

//         // Filter the original data based on the selected date
//         const filteredRecords = originalData
//             .map(record => ({
//                 date: record.date,
//                 attendance: record.attendance.filter(student => new Date(record.date).toLocaleDateString() === formattedDate)
//             }))
//             .filter(record => record.attendance.length > 0);

//         displayAttendanceRecords(filteredRecords); // Display the filtered records based on date
//     });

//     // View Defaulter List
//     document.getElementById('viewDefaulterButton').addEventListener('click', function () {
//         const defaultersOnly = originalData
//             .map(record => ({
//                 date: record.date,
//                 attendance: record.attendance.filter(student => {
//                     const rollNo = student.rollno;
//                     const percentage = defaulterData.find(def => def.rollNo === rollNo)?.percentage;
//                     return percentage < 75;
//                 })
//             }))
//             .filter(record => record.attendance.length > 0);

//         displayAttendanceRecords(defaultersOnly); // Show only defaulters
//     });

//     // Export table data to Excel
//     document.getElementById('exportButton').addEventListener('click', function () {
//         const table = document.querySelector('table');
//         const wb = XLSX.utils.table_to_book(table, { sheet: "Attendance Data" });
//         XLSX.writeFile(wb, 'AttendanceData.xlsx');
//     });

//     // Export Defaulter List to Excel
//     document.getElementById('exportDefaulterButton').addEventListener('click', function () {
//         const container = document.createElement('table');
//         container.innerHTML = `
//             <tr>
//                 <th>Roll No</th>
//                 <th>Name</th>
//                 <th>Attendance Percentage</th>
//             </tr>
//         `;

//         defaulterData.forEach(defaulter => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${defaulter.rollNo}</td>
//                 <td>${defaulter.name}</td>
//                 <td>${defaulter.percentage.toFixed(2)}%</td>
//             `;
//             container.appendChild(row);
//         });

//         const wb = XLSX.utils.table_to_book(container, { sheet: "Defaulter List" });
//         XLSX.writeFile(wb, 'DefaulterList.xlsx');
//     });

//     // Refresh button to reload the page
//     document.getElementById('refreshButton').addEventListener('click', function () {
//         location.reload();
//     });
// });














document.addEventListener('DOMContentLoaded', function () {
    let originalData = [];
    let defaulterData = [];
    let showComments = false; // Initially set to false to hide comments

    const subjectCode = sessionStorage.getItem('selectedSubjectCode');
    const semester = sessionStorage.getItem('selectedSemester');
    const subjectName = sessionStorage.getItem('selectedSubjectName'); // Fetch the subject name from session

    if (!subjectCode || !semester || !subjectName) {
        alert('Subject or semester information is missing. Please go back and select the subject again.');
        window.location.href = '../html/teacher-page.html';
        return;
    }

    // Display the subject name on the page
    document.getElementById('subject-name').textContent = subjectName;

    // Fetch attendance data from the server based on the selected subject and semester
    fetch(`http://localhost:5000/view-attendance/${semester}/${subjectCode}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                originalData = data.attendanceRecords;
                displayAttendanceRecords(originalData);
            } else {
                displayNoRecordsMessage();
                console.error('Failed to fetch attendance records:', data.message);
            }
        })
        .catch(error => {
            displayNoRecordsMessage();
            console.error('Error fetching attendance records:', error);
        });

    // Function to display attendance records in a table format
    function displayAttendanceRecords(records) {
        const container = document.getElementById('attendanceResultsContainer');
        const tableHead = document.getElementById('attendanceTableHead');
        container.innerHTML = ''; // Clear previous content
        tableHead.innerHTML = ''; // Clear the existing header content

        if (!records || records.length === 0) {
            displayNoRecordsMessage();
            return;
        }

        // Create the header with dates as columns
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<th class="fixed-column">Roll No</th><th class="fixed-column">Name</th>`;
        const uniqueDates = [...new Set(records.map(record => new Date(record.date).toLocaleDateString()))]; // Extract unique dates

        uniqueDates.forEach(date => {
            const dateHeader = document.createElement('th');
            dateHeader.textContent = date; // Add each date as a column header
            headerRow.appendChild(dateHeader);
        });

        // Add Comments column only if showing comments
        if (showComments) {
            headerRow.innerHTML += `<th class="fixed-column">Comments</th>`;
        }
        
        headerRow.innerHTML += `<th class="fixed-column">Attendance Percentage</th>`; // Add Percentage column
        tableHead.appendChild(headerRow);

        // Group records by student
        const groupedRecords = groupRecordsByStudent(records);

        Object.keys(groupedRecords).forEach(rollNo => {
            const student = groupedRecords[rollNo];
            const row = document.createElement('tr');
            row.classList.add('student-row');

            // Create a cell for Roll No and Name
            row.innerHTML = `
                <td class="fixed-column">${rollNo}</td>
                <td class="fixed-column">${student.name}</td>
            `;

            // Create cells for each date (mark Present/Absent)
            uniqueDates.forEach(date => {
                const attendanceRecord = student.attendance.find(att => att.date === date);
                const statusCell = document.createElement('td');
                statusCell.textContent = attendanceRecord ? attendanceRecord.status : "Absent";
                row.appendChild(statusCell);
            });

            // Add the Comments cell only if showing comments
            if (showComments) {
                const commentCell = document.createElement('td');
                commentCell.classList.add('fixed-column');
                commentCell.textContent = student.comment || "No Comment"; // Display the comment if available
                row.appendChild(commentCell);
            }

            // Add attendance percentage cell
            const percentageCell = document.createElement('td');
            percentageCell.classList.add('fixed-column');
            percentageCell.textContent = student.percentage ? student.percentage.toFixed(2) + "%" : "N/A";
            percentageCell.style.color = student.percentage < 75 ? 'red' : 'black';
            row.appendChild(percentageCell);

            // Highlight defaulter students with background color
            if (student.percentage < 75) {
                row.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'; // Light red background for defaulters
                defaulterData.push({ rollNo, ...student }); // Add to defaulters list if below 75%
            }

            container.appendChild(row);
        });
    }

    // Function to group records by student and calculate attendance percentage
    function groupRecordsByStudent(records) {
        const totalDays = [...new Set(records.map(record => record.date))].length; // Calculate total unique days
        const grouped = records.reduce((acc, record) => {
            record.attendance.forEach(studentRecord => {
                const rollNo = studentRecord.rollno;
                if (!acc[rollNo]) {
                    acc[rollNo] = { name: studentRecord.name, attendance: [], presentDays: 0, comment: studentRecord.comment };
                }
                acc[rollNo].attendance.push({
                    date: new Date(record.date).toLocaleDateString(),
                    status: studentRecord.present || "Absent"
                });
                if (studentRecord.present === "Present") {
                    acc[rollNo].presentDays++;
                }
            });
            return acc;
        }, {});

        Object.keys(grouped).forEach(rollNo => {
            grouped[rollNo].percentage = (grouped[rollNo].presentDays / totalDays) * 100;
        });
        return grouped;
    }

    // Display a message when no records are found
    function displayNoRecordsMessage() {
        const container = document.getElementById('attendanceResultsContainer');
        container.innerHTML = '<tr><td colspan="6" class="text-center text-danger">No attendance records found for this subject and semester.</td></tr>';
    }

    // Search by Roll No (on input change)
    document.getElementById('searchRollNo').addEventListener('input', function () {
        const searchValue = document.getElementById('searchRollNo').value.trim().toLowerCase();

        // Filter the original data based on the roll number search
        const filteredRecords = originalData
            .map(record => ({
                date: record.date,
                attendance: record.attendance.filter(student => student.rollno.toLowerCase() === searchValue)
            }))
            .filter(record => record.attendance.length > 0);

        // Hide comments when searching by Roll No
        showComments = false;
        displayAttendanceRecords(filteredRecords);
    });

    // Handle date selection
    document.getElementById('specificDate').addEventListener('change', function () {
        const selectedDate = document.getElementById('specificDate').value;
        if (!selectedDate) return; // Exit if no date is selected

        const formattedDate = new Date(selectedDate).toLocaleDateString();

        // Filter the original data based on the selected date
        const filteredRecords = originalData
            .map(record => ({
                date: record.date,
                attendance: record.attendance.filter(student => new Date(record.date).toLocaleDateString() === formattedDate)
            }))
            .filter(record => record.attendance.length > 0);

        // Show comments when filtering by date
        showComments = true;
        displayAttendanceRecords(filteredRecords); // Display the filtered records based on date
    });

    // View Defaulter List
    document.getElementById('viewDefaulterButton').addEventListener('click', function () {
        const defaultersOnly = originalData
            .map(record => ({
                date: record.date,
                attendance: record.attendance.filter(student => {
                    const rollNo = student.rollno;
                    const percentage = defaulterData.find(def => def.rollNo === rollNo)?.percentage;
                    return percentage < 75;
                })
            }))
            .filter(record => record.attendance.length > 0);

        displayAttendanceRecords(defaultersOnly); // Show only defaulters
    });

    // Export table data to Excel
    document.getElementById('exportButton').addEventListener('click', function () {
        const table = document.querySelector('table');
        const wb = XLSX.utils.table_to_book(table, { sheet: "Attendance Data" });
        XLSX.writeFile(wb, 'AttendanceData.xlsx');
    });

    // Export Defaulter List to Excel
    document.getElementById('exportDefaulterButton').addEventListener('click', function () {
        const container = document.createElement('table');
        container.innerHTML = `
            <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Attendance Percentage</th>
            </tr>
        `;

        defaulterData.forEach(defaulter => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${defaulter.rollNo}</td>
                <td>${defaulter.name}</td>
                <td>${defaulter.percentage.toFixed(2)}%</td>
            `;
            container.appendChild(row);
        });

        const wb = XLSX.utils.table_to_book(container, { sheet: "Defaulter List" });
        XLSX.writeFile(wb, 'DefaulterList.xlsx');
    });

    // Refresh button to reload the page
    document.getElementById('refreshButton').addEventListener('click', function () {
        location.reload();
    });
});
