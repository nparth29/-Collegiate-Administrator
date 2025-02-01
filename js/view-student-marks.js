document.addEventListener('DOMContentLoaded', function () {
    // Get the student's identifier and semester from the URL parameters
    const params = new URLSearchParams(window.location.search);
    const identifier = params.get('identifier'); // Username or College ID
    const semester = params.get('semester');
    const subjectId = params.get('subjectId'); // Specific subject ID

    if (!identifier || !semester || !subjectId) {
        alert('Subject or semester information is missing. Please go back and select the subject again.');
        window.location.href = '../html/student-page.html';
        return;
    }

    // Fetch marks data for the specific student based on the subject and semester
    fetch(`http://localhost:5000/get-student-marks/${semester}/${subjectId}/${identifier}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Display the student's marks
                displayMarksRecords(data.marks);
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

        records.forEach(record => {
            const row = document.createElement('tr');
            row.classList.add('student-row');

            // Calculate average
            const average = (record.ia1 !== null && record.ia2 !== null) ? (record.ia1 + record.ia2) / 2
                : (record.ia1 !== null ? record.ia1 : record.ia2);

            // Create a cell for each attribute
            row.innerHTML = `
                <td>${record.subjectCode}</td>
                <td>${record.ia1 !== undefined ? record.ia1 : '-'}</td>
                <td>${record.ia2 !== undefined ? record.ia2 : '-'}</td>
                <td>${average !== undefined ? average.toFixed(2) : '-'}</td>
            `;

            container.appendChild(row);
        });
    }

    // Display a message when no records are found
    function displayNoRecordsMessage() {
        const container = document.getElementById('marksResultsContainer');
        container.innerHTML = '<tr><td colspan="4" class="text-center text-danger">No marks records found for this subject and semester.</td></tr>';
    }
});
