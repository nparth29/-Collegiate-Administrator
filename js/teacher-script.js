$(document).ready(function () {
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._$]+@kccemsr\.edu\.in$/; // Regex for Employee ID

    let existingTeachers = []; // To store existing teacher data
    let subjectsInUse = {}; // To track subjects that are already selected by other teachers

    // Define the subjects data
    const subjects = {
        "III": {
            compulsory: [
                { "id": "ITC301", "name": "Engineering Mathematics-III" },
                { "id": "ITC302", "name": "Data Structure and Analysis" },
                { "id": "ITC303", "name": "Database Management System" },
                { "id": "ITC304", "name": "Principle of Communication" },
                { "id": "ITC305", "name": "Paradigms and Computer Programming Fundamentals" }
            ]
        },
        "IV": {
            compulsory: [
                { "id": "ITC401", "name": "Engineering Mathematics-IV" },
                { "id": "ITC402", "name": "Computer Network and Network Design" },
                { "id": "ITC403", "name": "Operating System" },
                { "id": "ITC404", "name": "Automata Theory" },
                { "id": "ITC405", "name": "Computer Organization and Architecture" }
            ]
        },
        "V": {
            compulsory: [
                { "id": "ITC501", "name": "Internet Programming" },
                { "id": "ITC502", "name": "Computer Network Security" },
                { "id": "ITC503", "name": "Entrepreneurship and E-business" },
                { "id": "ITC504", "name": "Software Engineering" }
            ],
            department: [
                { "id": "ITDO5011", "name": "Microcontroller Embedded Programming" },
                { "id": "ITDO5012", "name": "Advance Data Management Technologies" },
                { "id": "ITDO5013", "name": "Computer Graphics & Multimedia System" },
                { "id": "ITDO5014", "name": "Advanced Data Structure and Analysis" }
            ]
        },
        "VI": {
            compulsory: [
                { "id": "ITC601", "name": "Data Mining & Business Intelligence" },
                { "id": "ITC602", "name": "Web X.0" },
                { "id": "ITC603", "name": "Wireless Technology" },
                { "id": "ITC604", "name": "AI and DS – 1" }
            ],
            department: [
                { "id": "ITDO6011", "name": "Software Architecture" },
                { "id": "ITDO6012", "name": "Image Processing" },
                { "id": "ITDO6013", "name": "Green IT" },
                { "id": "ITDO6014", "name": "Ethical Hacking and Forensic" }
            ]
        },
        "VII": {
            compulsory: [
                { "id": "ITC701", "name": "AI and DS – II" },
                { "id": "ITC702", "name": "Internet of Everything" }
            ],
            department: [
                { "id": "ITDO7011", "name": "Storage Area Network" },
                { "id": "ITDO7012", "name": "High-Performance Computing" },
                { "id": "ITDO7013", "name": "Infrastructure Security" },
                { "id": "ITDO7014", "name": "Software Testing and QA" }
            ],
            institute: [
                { "id": "ILO7011", "name": "Product Lifecycle Management" },
                { "id": "ILO7012", "name": "Reliability Engineering" },
                { "id": "ILO7013", "name": "Management Information System" },
                { "id": "ILO7014", "name": "Design of Experiments" },
                { "id": "ILO7015", "name": "Operation Research" }
            ]
        },
        "VIII": {
            compulsory: [
                { "id": "ITC801", "name": "Big Data Analytics" },
                { "id": "ITC802", "name": "Internet of Everything" }
            ],
            department: [
                { "id": "ITDLO8041", "name": "User Interaction Design" },
                { "id": "ITDLO8042", "name": "Information Retrieval Systems" },
                { "id": "ITDLO8043", "name": "Knowledge Management" },
                { "id": "ITDLO8044", "name": "Robotics" }
            ],
            institute: [
                { "id": "ILO8021", "name": "Project Management" },
                { "id": "ILO8022", "name": "Finance Management" },
                { "id": "ILO8023", "name": "Entrepreneurship Development and Management" }
            ]
        }
    };

    // Fetch existing teacher data and populate the subjectsInUse
    function fetchExistingTeacherData() {
        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:5000/get-teachers',
            success: function (response) {
                if (response.success) {
                    existingTeachers = response.teachers;
                    subjectsInUse = {}; // Reset the subjectsInUse object

                    // Populate subjectsInUse with already assigned subjects
                    existingTeachers.forEach(teacher => {
                        Object.keys(teacher.subjects).forEach(semester => {
                            const subjectCode = teacher.subjects[semester].code;
                            subjectsInUse[subjectCode] = teacher.username; // Map subject code to the teacher
                        });
                    });

                    // Disable subjects that are already assigned
                    disableAssignedSubjects();
                }
            },
            error: function () {
                existingTeachers = []; // Reset if there's an error fetching teacher data
                subjectsInUse = {};
            }
        });
    }

    // Disable subjects in the dropdowns that are already assigned to other teachers
    function disableAssignedSubjects() {
        ['III', 'IV', 'V', 'VI', 'VII', 'VIII'].forEach(function (semester) {
            const compulsorySelect = `#sem-${semester}-compulsory`;
            const departmentSelect = `#sem-${semester}-department`;
            const instituteSelect = `#sem-${semester}-institute`;

            $(compulsorySelect + ' option').each(function () {
                const value = $(this).val();
                if (subjectsInUse[value]) {
                    $(this).prop('disabled', true).text($(this).text() + " (Assigned to " + subjectsInUse[value] + ")");
                }
            });

            $(departmentSelect + ' option').each(function () {
                const value = $(this).val();
                if (subjectsInUse[value]) {
                    $(this).prop('disabled', true).text($(this).text() + " (Assigned to " + subjectsInUse[value] + ")");
                }
            });

            $(instituteSelect + ' option').each(function () {
                const value = $(this).val();
                if (subjectsInUse[value]) {
                    $(this).prop('disabled', true).text($(this).text() + " (Assigned to " + subjectsInUse[value] + ")");
                }
            });
        });
    }

    // Fetch existing teacher data on document ready
    fetchExistingTeacherData();

    // Validate Employee ID to end with @kccemsr.edu.in
    $('#employeeid').on('input', function () {
        const employeeID = $(this).val();
        const errorElement = $('#employeeid-error');
        const isDuplicate = existingTeachers.some(teacher => teacher.employeeid === employeeID);

        if (!emailRegex.test(employeeID)) {
            errorElement.text('Employee ID must end with @kccemsr.edu.in').addClass('active');
            disableRegisterButton();
        } else if (isDuplicate) {
            errorElement.text('Employee ID already exists.').addClass('active');
            disableRegisterButton();
        } else {
            errorElement.removeClass('active');
            enableRegisterButtonIfValid();
        }
    });

    // Handle subject selection for each semester
    ['III', 'IV', 'V', 'VI', 'VII', 'VIII'].forEach(function (semester) {
        const compulsorySelect = `#sem-${semester}-compulsory`;
        const departmentSelect = `#sem-${semester}-department`;
        const instituteSelect = `#sem-${semester}-institute`;

        // Add subjects for each semester
        if (subjects[semester].compulsory) {
            subjects[semester].compulsory.forEach(subject => {
                $(compulsorySelect).append(`<option value="${subject.id}">${subject.name}</option>`);
            });
        }
        if (subjects[semester].department) {
            subjects[semester].department.forEach(subject => {
                $(departmentSelect).append(`<option value="${subject.id}">${subject.name}</option>`);
            });
        }
        if (subjects[semester].institute) {
            subjects[semester].institute.forEach(subject => {
                $(instituteSelect).append(`<option value="${subject.id}">${subject.name}</option>`);
            });
        }

        // Allow only one selection per semester (compulsory, department, or institute)
        $(`${compulsorySelect}, ${departmentSelect}, ${instituteSelect}`).change(function () {
            if ($(compulsorySelect).val()) {
                $(departmentSelect).attr('disabled', true);
                $(instituteSelect).attr('disabled', true);
            } else if ($(departmentSelect).val()) {
                $(compulsorySelect).attr('disabled', true);
                $(instituteSelect).attr('disabled', true);
            } else if ($(instituteSelect).val()) {
                $(compulsorySelect).attr('disabled', true);
                $(departmentSelect).attr('disabled', true);
            } else {
                $(compulsorySelect).removeAttr('disabled');
                $(departmentSelect).removeAttr('disabled');
                $(instituteSelect).removeAttr('disabled');
            }
        });
    });

    // Validate phone number
    $('#phoneno').on('input', function () {
        const phoneNo = $(this).val();
        const errorElement = $('#phoneno-error');

        if (!/^\d*$/.test(phoneNo)) {
            errorElement.text('Phone number can only contain digits.').addClass('active');
            disableRegisterButton();
        } else if (!phoneRegex.test(phoneNo)) {
            errorElement.text('Phone number must be exactly 10 digits.').addClass('active');
            disableRegisterButton();
        } else {
            errorElement.removeClass('active');
            enableRegisterButtonIfValid();
        }
    });

    // Validate password matching
    $('#confirmpassword').on('input', function () {
        const password = $('#password').val();
        const confirmPassword = $(this).val();
        const errorElement = $('#password-error');

        if (password !== confirmPassword) {
            errorElement.text('Passwords do not match.').addClass('active');
            disableRegisterButton();
        } else {
            errorElement.removeClass('active');
            enableRegisterButtonIfValid();
        }
    });

    function enableRegisterButtonIfValid() {
        const isValidPhone = phoneRegex.test($('#phoneno').val());
        const isValidEmployeeID = emailRegex.test($('#employeeid').val());
        const isPasswordMatch = $('#password').val() === $('#confirmpassword').val();
        const noDuplicateWarnings = $('.error-message.active').length === 0;

        if (isValidPhone && isValidEmployeeID && isPasswordMatch && noDuplicateWarnings) {
            $('#register-btn').removeAttr('disabled');
        } else {
            $('#register-btn').attr('disabled', true);
        }
    }

    function disableRegisterButton() {
        $('#register-btn').attr('disabled', true);
    }

    // Handle form submission
    $('#teacher-register-form').submit(function (event) {
        event.preventDefault();

        const formData = $(this).serializeArray();
        const selectedSubjects = {};

        ['III', 'IV', 'V', 'VI', 'VII', 'VIII'].forEach(function (semester) {
            const compulsory = $(`#sem-${semester}-compulsory`).val();
            const department = $(`#sem-${semester}-department`).val();
            const institute = $(`#sem-${semester}-institute`).val();

            if (compulsory) {
                const subject = subjects[semester].compulsory.find(sub => sub.id === compulsory);
                selectedSubjects[semester] = { code: subject.id, name: subject.name };
            } else if (department) {
                const subject = subjects[semester].department.find(sub => sub.id === department);
                selectedSubjects[semester] = { code: subject.id, name: subject.name };
            } else if (institute) {
                const subject = subjects[semester].institute.find(sub => sub.id === institute);
                selectedSubjects[semester] = { code: subject.id, name: subject.name };
            }
        });

        formData.push({ name: 'subjects', value: JSON.stringify(selectedSubjects) });

        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:5000/register-teacher',
            data: $.param(formData),
            success: function (response) {
                alert(response.message);
                window.location.href = 'index.html'; // Redirect after successful registration
            },
            error: function () {
                alert("Error in registration");
            }
        });
    });
});
