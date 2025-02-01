document.addEventListener('DOMContentLoaded', function () {
    const username = sessionStorage.getItem('username');

    if (username) {
        fetch(`http://localhost:5000/get-teacher-subjects/${username}`)
            .then(response => response.json())
            .then(data => {
                const subjectContainer = document.getElementById('subject-container');

                if (data.success && data.subjects && Object.keys(data.subjects).length > 0) {
                    subjectContainer.innerHTML = ''; // Clear the container for new data

                    let hasCompulsorySubject = false;
                    const compulsorySemesters = [];

                    // Loop through each semester and subject
                    Object.keys(data.subjects).forEach(sem => {
                        const subject = data.subjects[sem];

                        const subjectCard = document.createElement('div');
                        subjectCard.className = 'subject-card';

                        // Create the subject title with category (Compulsory, Department-Level, or Institute-Level)
                        const subjectTitle = document.createElement('h3');
                        subjectTitle.innerHTML = `${subject.code} - ${subject.name} (${subject.category})`; // Displaying subject category
                        subjectCard.appendChild(subjectTitle);

                        // Mark Attendance Button
                        const attendanceButton = document.createElement('button');
                        attendanceButton.innerHTML = 'Mark Attendance';
                        attendanceButton.className = 'action-button';
                        attendanceButton.dataset.semester = sem;
                        attendanceButton.dataset.code = subject.code;
                        attendanceButton.dataset.name = subject.name;
                        attendanceButton.addEventListener('click', function () {
                            sessionStorage.setItem('selectedSemester', this.dataset.semester);
                            sessionStorage.setItem('selectedSubjectCode', this.dataset.code);
                            sessionStorage.setItem('selectedSubjectName', this.dataset.name);
                            window.location.href = '../html/attendance-mark.html';
                        });
                        subjectCard.appendChild(attendanceButton);

                        // Enter Marks Button
                        const marksButton = document.createElement('button');
                        marksButton.innerHTML = 'Enter Marks';
                        marksButton.className = 'action-button';
                        marksButton.dataset.semester = sem;
                        marksButton.dataset.code = subject.code;
                        marksButton.dataset.name = subject.name;
                        marksButton.addEventListener('click', function () {
                            sessionStorage.setItem('selectedSemester', this.dataset.semester);
                            sessionStorage.setItem('selectedSubjectCode', this.dataset.code);
                            sessionStorage.setItem('selectedSubjectName', this.dataset.name);
                            window.location.href = '../html/enter-marks.html';
                        });
                        subjectCard.appendChild(marksButton);

                        // View Marks Button
                        const viewMarksButton = document.createElement('button');
                        viewMarksButton.innerHTML = 'View Marks';
                        viewMarksButton.className = 'action-button';
                        viewMarksButton.dataset.semester = sem;
                        viewMarksButton.dataset.code = subject.code;
                        viewMarksButton.dataset.name = subject.name;
                        viewMarksButton.addEventListener('click', function () {
                            sessionStorage.setItem('selectedSemester', this.dataset.semester);
                            sessionStorage.setItem('selectedSubjectCode', this.dataset.code);
                            sessionStorage.setItem('selectedSubjectName', this.dataset.name);
                            window.location.href = '../html/view-marks.html';
                        });
                        subjectCard.appendChild(viewMarksButton);

                        // View Attendance Details Button
                        const viewAttendanceButton = document.createElement('button');
                        viewAttendanceButton.innerHTML = 'View Attendance Details';
                        viewAttendanceButton.className = 'action-button';
                        viewAttendanceButton.dataset.semester = sem;
                        viewAttendanceButton.dataset.code = subject.code;
                        viewAttendanceButton.dataset.name = subject.name;
                        viewAttendanceButton.addEventListener('click', function () {
                            sessionStorage.setItem('selectedSemester', this.dataset.semester);
                            sessionStorage.setItem('selectedSubjectCode', this.dataset.code);
                            sessionStorage.setItem('selectedSubjectName', this.dataset.name);
                            window.location.href = '../html/view-attendance.html';
                        });
                        subjectCard.appendChild(viewAttendanceButton);

                        // Add View Past Records Button
                        const viewPastRecordsButton = document.createElement('button');
                        viewPastRecordsButton.innerHTML = 'View Past Records';
                        viewPastRecordsButton.className = 'action-button';
                        viewPastRecordsButton.dataset.semester = sem;
                        viewPastRecordsButton.dataset.code = subject.code;
                        viewPastRecordsButton.dataset.name = subject.name;
                        viewPastRecordsButton.addEventListener('click', function () {
                            openHistoryModal(this.dataset.semester, this.dataset.code);
                        });
                        subjectCard.appendChild(viewPastRecordsButton);

                        // Append the subject card to the container
                        subjectContainer.appendChild(subjectCard);

                        // Check if the subject is Compulsory and add the semester to the list
                        if (subject.category === 'Compulsory') {
                            hasCompulsorySubject = true;
                            compulsorySemesters.push(sem);
                        }
                    });

                    // Enable Upgrade Semester Button if there is at least one compulsory subject
                    if (hasCompulsorySubject) {
                        document.getElementById('upgrade-btn').style.display = 'block';
                        populateSemesterSelect(compulsorySemesters); // Populate the semester options in the modal
                    }
                } else {
                    subjectContainer.innerHTML = "<p>No subjects found for this teacher.</p>";
                }
            })
            .catch(error => {
                console.error('Error fetching subjects:', error);
                document.getElementById('subject-container').innerHTML = "<p>Unable to fetch subjects at the moment. Please try again later.</p>";
            });
    } else {
        console.error('No username found in session storage');
        document.getElementById('subject-container').innerHTML = "<p>Error: No user session found. Please log in again.</p>";
    }
});

// Function to open modal for history input
function openHistoryModal(semester, subjectCode) {
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">View Past Records</h5>
                    <button type="button" class="btn-close" onclick="closeModal()" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="semesterYear" class="form-label">Enter Semester-Year (e.g., III-2024-25):</label>
                        <input type="text" id="semesterYear" class="form-control" placeholder="III-2024-25" />
                    </div>
                    <div class="mb-3">
                        <label for="subjectCodeInput" class="form-label">Enter Subject Code (e.g., ITC501):</label>
                        <input type="text" id="subjectCodeInput" class="form-control" value="${subjectCode}" readonly />
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="fetchPastRecords()">OK</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('options-modal').style.display = 'block'; // Show the modal
}

// Close modal function
function closeModal() {
    document.getElementById('options-modal').style.display = 'none';
}

// Fetch past records after OK is clicked
function fetchPastRecords() {
    const semesterYear = document.getElementById('semesterYear').value;
    const subjectCode = document.getElementById('subjectCodeInput').value;

    if (semesterYear && subjectCode) {
        sessionStorage.setItem('historySemesterYear', semesterYear);
        sessionStorage.setItem('historySubjectCode', subjectCode);

        // Redirect to view past records page
        window.location.href = '../html/view-past-records.html';
    }
}

// Function to open the modal for upgrading semester
function openUpgradeModal() {
    const upgradeModal = new bootstrap.Modal(document.getElementById('upgradeModal'));
    upgradeModal.show();
}

// Populate the semester dropdown based on compulsory subjects
function populateSemesterSelect(semesters) {
    const semesterSelect = document.getElementById('semesterSelect');
    semesterSelect.innerHTML = ''; // Clear previous options

    semesters.forEach(sem => {
        const option = document.createElement('option');
        option.value = sem;
        option.innerText = `Semester ${sem}`;
        semesterSelect.appendChild(option);
    });
}

// Function to upgrade the semester and move student data to history
async function upgradeSemester() {
    const selectedSemester = document.getElementById('semesterSelect').value;
    const yearInput = document.getElementById('yearInput').value;

    if (!yearInput || !/^\d{4}-\d{2}$/.test(yearInput)) {
        alert('Please enter a valid academic year (e.g., 2024-25).');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/upgrade-teacher-semester', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                semester: selectedSemester,
                year: yearInput
            })
        });

        const data = await response.json();

        if (data.success) {
            alert(`Semester upgraded successfully for ${selectedSemester}!`);
        } else {
            alert(`Failed to upgrade semester: ${data.message}`);
        }
    } catch (error) {
        console.error('Error upgrading semester:', error);
        alert('An error occurred during the upgrade process.');
    }
}
