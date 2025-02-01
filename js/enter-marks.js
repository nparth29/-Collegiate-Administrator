document.addEventListener('DOMContentLoaded', function () {
    const subjectCode = sessionStorage.getItem('selectedSubjectCode');
    const semester = sessionStorage.getItem('selectedSemester');
    const subjectName = sessionStorage.getItem('selectedSubjectName');

    if (!subjectCode || !semester || !subjectName) {
        alert('Subject name, code, or semester is missing. Please go back and select the subject again.');
        window.location.href = '../html/teacher-page.html';
        return;
    }

    document.getElementById('subject-name').textContent = subjectName;

    fetch(`http://localhost:5000/get-marks/${semester}/${subjectCode}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const existingMarks = data.marks || [];
                const container = document.getElementById('marksContainer');
                container.innerHTML = '';

                const marksMap = {};
                existingMarks.forEach(mark => marksMap[mark.rollno] = mark);

                fetch(`http://localhost:5000/get-students/${semester}/${subjectCode}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            const students = data.students;
                            students.sort((a, b) => parseInt(a.rollno) - parseInt(b.rollno));

                            students.forEach(student => {
                                const row = document.createElement('tr');
                                const ia1Value = marksMap[student.rollno]?.ia1 || '';
                                const ia2Value = marksMap[student.rollno]?.ia2 || '';
                                const ia2Disabled = ia1Value ? '' : 'disabled';

                                row.innerHTML = `
                                    <td>${student.rollno}</td>
                                    <td>${student.fullname}</td>
                                    <td>${student.collegeid}</td>
                                    <td><input type="number" name="ia1-${student.rollno}" min="0" max="20" value="${ia1Value}"></td>
                                    <td><input type="number" name="ia2-${student.rollno}" min="0" max="20" value="${ia2Value}" ${ia2Disabled}></td>
                                `;
                                container.appendChild(row);
                            });

                            document.querySelectorAll(`input[name^='ia1-']`).forEach(input => {
                                input.addEventListener('input', function () {
                                    const rollNo = this.name.split('-')[1];
                                    const ia2Input = document.querySelector(`input[name='ia2-${rollNo}']`);
                                    ia2Input.disabled = this.value === '';
                                });
                            });

                            document.getElementById('searchBox').addEventListener('input', function () {
                                const searchValue = this.value.toLowerCase();
                                document.querySelectorAll('#marksContainer tr').forEach(row => {
                                    const rollNo = row.cells[0].textContent.toLowerCase();
                                    row.style.display = rollNo.includes(searchValue) ? '' : 'none';
                                });
                            });

                            document.getElementById('refreshButton').addEventListener('click', function () {
                                document.getElementById('searchBox').value = '';
                                document.querySelectorAll('#marksContainer tr').forEach(row => row.style.display = '');
                            });
                        } else {
                            alert('Failed to fetch students for the selected subject.');
                        }
                    })
                    .catch(error => console.error('Error fetching students:', error));
            } else {
                alert('Failed to fetch existing marks data.');
            }
        })
        .catch(error => console.error('Error fetching existing marks data:', error));

    document.getElementById('marks-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const marksData = [];
        document.querySelectorAll('#marksContainer tr').forEach(row => {
            const rollNo = row.cells[0].textContent;
            const name = row.cells[1].textContent;
            const collegeID = row.cells[2].textContent;
            const ia1 = row.querySelector(`input[name=ia1-${rollNo}]`).value || null;
            const ia2 = row.querySelector(`input[name=ia2-${rollNo}]`).value || null;

            marksData.push({
                rollno: rollNo,
                studentName: name,
                collegeID,
                ia1: ia1 ? parseInt(ia1) : null,
                ia2: ia2 ? parseInt(ia2) : null
            });
        });

        fetch('http://localhost:5000/submit-marks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subjectCode,
                semester,
                marks: marksData
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Marks submitted successfully!');
                    window.location.href = '../html/teacher-page.html';
                } else {
                    alert('Failed to submit marks.');
                }
            })
            .catch(error => console.error('Error submitting marks:', error));
    });
});
