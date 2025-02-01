document.addEventListener('DOMContentLoaded', function () {
    const semesterYear = sessionStorage.getItem('historySemesterYear');
    const subjectCode = sessionStorage.getItem('historySubjectCode');

    if (!semesterYear || !subjectCode) {
        alert('No past record data available. Please go back and try again.');
        window.history.back();
    } else {
        document.getElementById('subject-name').innerText = `${subjectCode} (${semesterYear})`;

        // Fetch Attendance Data
        fetch(`http://localhost:5000/view-past-attendance/${semesterYear}/${subjectCode}`)
            .then(response => response.json())
            .then(data => {
                const attendanceTableHead = document.getElementById('attendance-header');
                const attendanceTableBody = document.getElementById('attendance-table').querySelector('tbody');

                if (data.success && data.attendanceRecords.length > 0) {
                    const uniqueDates = new Set();
                    
                    // Collect unique attendance dates
                    data.attendanceRecords.forEach(record => {
                        record.attendanceDates.forEach(date => {
                            const [attDate] = date.split(' '); // Extract the date part
                            uniqueDates.add(attDate);
                        });
                    });

                    // Create dynamic headers based on unique dates
                    const sortedDates = Array.from(uniqueDates).sort((a, b) => new Date(a) - new Date(b));
                    sortedDates.forEach(date => {
                        const th = document.createElement('th');
                        th.textContent = date;
                        attendanceTableHead.appendChild(th);
                    });

                    // Populate attendance records
                    data.attendanceRecords.forEach(record => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${record.rollno}</td>
                            <td>${record.studentName} (${record.collegeID})</td>
                        `;

                        sortedDates.forEach(date => {
                            const attendanceStatus = record.attendanceDates.includes(date + ' (Present)') ? 'Present' : 'Absent';
                            const td = document.createElement('td');
                            td.textContent = attendanceStatus;
                            row.appendChild(td);
                        });

                        attendanceTableBody.appendChild(row);
                    });
                } else {
                    attendanceTableBody.innerHTML = '<tr><td colspan="3">No attendance records found.</td></tr>';
                }
            })
            .catch(error => {
                console.error('Error fetching attendance:', error);
                document.getElementById('attendance-table').querySelector('tbody').innerHTML = '<tr><td colspan="3">Failed to load attendance records.</td></tr>';
            });

        // Fetch Marks Data
        fetch(`http://localhost:5000/view-past-marks/${semesterYear}/${subjectCode}`)
            .then(response => response.json())
            .then(data => {
                const marksTable = document.getElementById('marks-table').querySelector('tbody');

                if (data.success && data.marksRecords.length > 0) {
                    data.marksRecords.forEach(record => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${record.rollno}</td>
                            <td>${record.studentName} (${record.collegeID})</td>
                            <td>${record.ia1 !== undefined ? record.ia1 : 'N/A'}</td>
                            <td>${record.ia2 !== undefined ? record.ia2 : 'N/A'}</td>
                        `;
                        marksTable.appendChild(row);
                    });
                } else {
                    marksTable.innerHTML = '<tr><td colspan="4">No marks records found.</td></tr>';
                }
            })
            .catch(error => {
                console.error('Error fetching marks:', error);
                document.getElementById('marks-table').querySelector('tbody').innerHTML = '<tr><td colspan="4">Failed to load marks records.</td></tr>';
            });
    }

    // Back button to go to the previous page
    document.getElementById('back-button').addEventListener('click', function () {
        window.history.back();
    });
});
