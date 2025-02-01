document.addEventListener('DOMContentLoaded', function () {
    // Retrieve query parameters from the URL
    const params = new URLSearchParams(window.location.search);
    const subjectId = params.get('subjectId');
    const semester = params.get('semester');
    const identifier = params.get('identifier'); // College ID

    // Check if required parameters are present
    if (!subjectId || !semester || !identifier) {
        alert('Student identifier or semester is missing. Please log in again.');
        window.location.href = '../html/index.html'; // Redirect to login page if parameters are missing
        return;
    }

    // Set the subject name on the page
    const subjectNameElement = document.getElementById('subject-name');
    if (subjectNameElement) {
        subjectNameElement.innerText = subjectId; // Set the subject ID in the span element
    } else {
        console.error("The 'subject-name' element is missing in the HTML structure.");
    }

    // Fetch attendance records from the server based on the subject and semester
    fetch(`http://localhost:5000/view-student-attendance/${semester}/${subjectId}/${identifier}`)
    .then(response => response.json())
    .then(data => {
        console.log('Fetched Data:', data); // Log fetched data
        if (data.success) {
            displayAttendanceRecords(data.attendanceRecords);
        } else {
            displayNoRecordsMessage();
            console.error('Failed to fetch attendance records:', data.message);
        }
    })
    .catch(error => {
        displayNoRecordsMessage();
        console.error('Error fetching attendance records:', error);
    });


    // Function to display attendance records in a table format with percentage calculation
    function displayAttendanceRecords(records) {
        const headerRow = document.getElementById('attendanceTableHead');
        const bodyContainer = document.getElementById('attendanceResultsContainer');
        bodyContainer.innerHTML = ''; // Clear previous content
    
        if (!records || records.length === 0) {
            displayNoRecordsMessage();
            return;
        }
    
        // Clear existing headers and dynamically create the date columns
        headerRow.innerHTML = ''; // Clear existing headers
        let headerHTML = '<tr><th>Date</th>'; // Initialize header with a "Date" column
    
        // Get the unique dates for which attendance was recorded
        const uniqueDates = [...new Set(records.map(record => new Date(record.date).toLocaleDateString()))];
        uniqueDates.forEach(date => {
            headerHTML += `<th>${date}</th>`;
        });
        headerHTML += '<th>Attendance Percentage</th></tr>'; // Add "Attendance Percentage" column
        headerRow.innerHTML = headerHTML; // Set the header row with dates
    
        // Now create the row for attendance status and percentage calculation
        let attendanceRowHTML = '<tr><td>Attendance Status</td>';
    
        // Count the number of total classes and number of days present
        let totalClasses = 0;
        let daysPresent = 0;
    
        
        // Loop through each record to calculate the total number of classes and present days
records.forEach(record => {
    // Find the student's attendance entry for the current record
    const studentAttendance = record.attendance.find(student => student.collegeid === identifier);
    
    // Check the attendance status based on the 'present' field
    let status = 'Absent'; // Default status
    if (studentAttendance) {
        // Check the attendance status as a string
        status = studentAttendance.present === 'Present' ? 'Present' : 'Absent'; // Check if the status is 'Present'
    }
    
    attendanceRowHTML += `<td>${status}</td>`; // Append status for each date
    totalClasses++;

    if (status === 'Present') {
        daysPresent++;
    }
});

    
        // Calculate attendance percentage
        const attendancePercentage = (daysPresent / totalClasses) * 100;
    
        // Append percentage column to the row
        attendanceRowHTML += `<td>${attendancePercentage.toFixed(2)}%</td></tr>`; // Round to 2 decimal places
        bodyContainer.innerHTML = attendanceRowHTML; // Append the row with attendance statuses
    }
    
    // Function to display a message when no records are found
    function displayNoRecordsMessage() {
        const container = document.getElementById('attendanceResultsContainer');
        container.innerHTML = '<tr><td colspan="2" class="text-center text-danger">No attendance records found for this subject and semester.</td></tr>';
    }
});
