
document.addEventListener('DOMContentLoaded', function () {
    let originalMarksData = []; // Store the original fetched marks data for filtering
    let failedStudentsData = []; // Store failed students data separately

    const subjectCode = sessionStorage.getItem('selectedSubjectCode');
    const semester = sessionStorage.getItem('selectedSemester');

    if (!subjectCode || !semester) {
        alert('Subject or semester information is missing. Please go back and select the subject again.');
        window.location.href = '../html/teacher-page.html';
        return;
    }

    // Fetch marks data from the server based on the selected subject and semester
    fetch(`http://localhost:5000/get-marks/${semester}/${subjectCode}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                originalMarksData = data.marks; // Store the fetched data for filtering
                displayMarksRecords(originalMarksData); // Display data initially
            } else {
                displayNoRecordsMessage();
                console.error('Failed to fetch marks records:', data.message);
            }
        })
        .catch(error => {
            displayNoRecordsMessage();
            console.error('Error fetching marks records:', error);
        });

    // Function to display marks records in the table
    function displayMarksRecords(records) {
        const container = document.getElementById('marksResultsContainer');
        container.innerHTML = ''; // Clear previous content

        if (!records || records.length === 0) {
            displayNoRecordsMessage();
            return;
        }

        // Sort records by roll number
        records.sort((a, b) => a.rollno - b.rollno);

        // Clear the failed students data each time records are displayed
        failedStudentsData = [];

        records.forEach(student => {
            const row = document.createElement('tr');
            row.classList.add('student-row');

            // Calculate average
            const average = (student.ia1 !== null && student.ia2 !== null) ? (student.ia1 + student.ia2) / 2
                : (student.ia1 !== null ? student.ia1 : student.ia2);

            // Create a cell for each attribute
            row.innerHTML = `
                <td>${student.rollno}</td>
                <td>${student.studentName}</td>
                <td>${student.ia1 !== undefined ? student.ia1 : '-'}</td>
                <td>${student.ia2 !== undefined ? student.ia2 : '-'}</td>
                <td class="${average < 8 ? 'failed' : ''}">${average !== undefined ? average.toFixed(2) : '-'}</td>
            `;

            // If average is less than 8, highlight the row as failed
            if (average < 8) {
                row.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'; // Light red background
                failedStudentsData.push(student); // Add to failed students list
            }

            container.appendChild(row);
        });
    }

    // Display a message when no records are found
    function displayNoRecordsMessage() {
        const container = document.getElementById('marksResultsContainer');
        container.innerHTML = '<tr><td colspan="5" class="text-center text-danger">No marks records found for this subject and semester.</td></tr>';
    }

    // Search by Roll No
    document.getElementById('searchRollNo').addEventListener('input', function () {
        const searchValue = document.getElementById('searchRollNo').value.trim().toLowerCase();

        // Filter the original data based on the roll number search
        const filteredRecords = originalMarksData.filter(student => student.rollno.toLowerCase() === searchValue);

        displayMarksRecords(filteredRecords);
    });

    // Search by Marks
    document.getElementById('searchMarks').addEventListener('input', function () {
        const marksValue = parseFloat(document.getElementById('searchMarks').value.trim());

        if (isNaN(marksValue)) {
            return; // If no valid input, exit
        }

        // Filter students who have IA1 or IA2 marks matching the entered value
        const filteredRecords = originalMarksData.filter(student => student.ia1 === marksValue || student.ia2 === marksValue);

        displayMarksRecords(filteredRecords);
    });

    // Refresh button
    document.getElementById('refreshButton').addEventListener('click', function () {
        displayMarksRecords(originalMarksData); // Reset to original marks data
    });

    // View Failed Students List
    document.getElementById('viewFailedButton').addEventListener('click', function () {
        // Show only failed students; ensure no duplicate entries
        displayMarksRecords([...failedStudentsData]);
    });

    // Export table data to Excel
    document.getElementById('exportButton').addEventListener('click', function () {
        const table = document.querySelector('table');
        const wb = XLSX.utils.table_to_book(table, { sheet: "Marks Data" });
        XLSX.writeFile(wb, 'MarksData.xlsx');
    });

    // Export Failed Students List to Excel
    document.getElementById('exportFailedButton').addEventListener('click', function () {
        const container = document.createElement('table');
        container.innerHTML = `
            <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>IA-I Marks</th>
                <th>IA-II Marks</th>
                <th>Average</th>
            </tr>
        `;

        failedStudentsData.forEach(student => {
            const row = document.createElement('tr');
            const average = (student.ia1 !== null && student.ia2 !== null) ? (student.ia1 + student.ia2) / 2
                : (student.ia1 !== null ? student.ia1 : student.ia2);
            
            row.innerHTML = `
                <td>${student.rollno}</td>
                <td>${student.studentName}</td>
                <td>${student.ia1 !== undefined ? student.ia1 : '-'}</td>
                <td>${student.ia2 !== undefined ? student.ia2 : '-'}</td>
                <td class="failed">${average !== undefined ? average.toFixed(2) : '-'}</td>
            `;
            container.appendChild(row);
        });

        const wb = XLSX.utils.table_to_book(container, { sheet: "Failed Students" });
        XLSX.writeFile(wb, 'FailedStudents.xlsx');
    });
});
