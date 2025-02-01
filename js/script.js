// $(document).ready(function () {
//     const phoneRegex = /^\d{10}$/;
//     const emailRegex = /^[a-zA-Z0-9._$]+@kccemsr\.edu\.in$/;
//     let existingStudents = []; // To store existing student data for the selected semester

//     // Define the subjects data
//     const subjects = {
//         "III": {
//             compulsory: [
//                 { "id": "ITC301", "name": "Engineering Mathematics-III" },
//                 { "id": "ITC302", "name": "Data Structure and Analysis" },
//                 { "id": "ITC303", "name": "Database Management System" },
//                 { "id": "ITC304", "name": "Principle of Communication" },
//                 { "id": "ITC305", "name": "Paradigms and Computer Programming Fundamentals" }
//             ],
//             optional: []
//         },
//         "IV": {
//             compulsory: [
//                 { "id": "ITC401", "name": "Engineering Mathematics-IV" },
//                 { "id": "ITC402", "name": "Computer Network and Network Design" },
//                 { "id": "ITC403", "name": "Operating System" },
//                 { "id": "ITC404", "name": "Automata Theory" },
//                 { "id": "ITC405", "name": "Computer Organization and Architecture" }
//             ],
//             optional: []
//         },
//         "V": {
//             compulsory: [
//                 { "id": "ITC501", "name": "Internet Programming" },
//                 { "id": "ITC502", "name": "Computer Network Security" },
//                 { "id": "ITC503", "name": "Entrepreneurship and E-business" },
//                 { "id": "ITC504", "name": "Software Engineering" }
//             ],
//             optional: [
//                 { "id": "ITDO5012", "name": "Advance Data Management Technologies" },
//                 { "id": "ITDO5014", "name": "Advanced Data Structure and Analysis" }
//             ]
//         },
//         "VI": {
//             compulsory: [
//                 { "id": "ITC601", "name": "Data Mining & Business Intelligence" },
//                 { "id": "ITC602", "name": "Web X.0" },
//                 { "id": "ITC603", "name": "Wireless Technology" },
//                 { "id": "ITC604", "name": "AI and DS – 1" }
//             ],
//             optional: [
//                 { "id": "ITDO6011", "name": "Software Architecture" },
//                 { "id": "ITDO6012", "name": "Image Processing" },
//                 { "id": "ITDO6013", "name": "Green IT" },
//                 { "id": "ITDO6014", "name": "Ethical Hacking and Forensic" }
//             ]
//         },
//         "VII": {
//             compulsory: [
//                 { "id": "ITC701", "name": "AI and DS – II" },
//                 { "id": "ITC702", "name": "Internet of Everything" }
//             ],
//             optional: {
//                 department: [
//                     { "id": "ITDO7011", "name": "Storage Area Network" },
//                     { "id": "ITDO7012", "name": "High-Performance Computing" },
//                     { "id": "ITDO7013", "name": "Infrastructure Security" },
//                     { "id": "ITDO7014", "name": "Software Testing and QA" }
//                 ],
//                 institute: [
//                     { "id": "ILO7011", "name": "Product Lifecycle Management" },
//                     { "id": "ILO7012", "name": "Reliability Engineering" },
//                     { "id": "ILO7013", "name": "Management Information System" }
//                 ]
//             }
//         },
//         "VIII": {
//             compulsory: [
//                 { "id": "ITC801", "name": "Big Data Analytics" },
//                 { "id": "ITC802", "name": "Internet of Everything" }
//             ],
//             optional: {
//                 department: [
//                     { "id": "ITDLO8041", "name": "User Interaction Design" },
//                     { "id": "ITDLO8042", "name": "Information Retrieval Systems" },
//                     { "id": "ITDLO8043", "name": "Knowledge Management" },
//                     { "id": "ITDLO8044", "name": "Robotics" }
//                 ],
//                 institute: [
//                     { "id": "ILO8021", "name": "Project Management" },
//                     { "id": "ILO8022", "name": "Finance Management" },
//                     { "id": "ILO8023", "name": "Entrepreneurship Development and Management" }
//                 ]
//             }
//         }
//     };

//     // Handle semester change and fetch existing students
//     $('#sem').change(function () {
//         const selectedSem = $(this).val();

//         // Clear previous subjects
//         $('#compulsory-subjects-container').empty();
//         $('#optional-subjects-container').empty();

//         if (selectedSem) {
//             // Populate the compulsory subjects for the selected semester
//             const compulsorySubjects = subjects[selectedSem].compulsory;
//             const optionalSubjects = subjects[selectedSem].optional;

//             $('#compulsory-subjects-container').append('<h3>Compulsory Subjects:</h3>');
//             compulsorySubjects.forEach(subject => {
//                 $('#compulsory-subjects-container').append(`<p>${subject.id} - ${subject.name}</p>`);
//             });

//             // Handling optional subjects for semesters
//             if (selectedSem === "V" || selectedSem === "VI") {
//                 $('#optional-subjects-container').append('<h4>Select Department Level Subject:</h4>');
//                 $('#optional-subjects-container').append('<select id="department-optional" name="department-optional" required><option value="" disabled selected>Select Department Level Subject</option></select>');
//                 optionalSubjects.forEach(subject => {
//                     $('#department-optional').append(`<option value="${subject.id}">${subject.name}</option>`);
//                 });
//             } else if (selectedSem === "VII") {
//                 $('#optional-subjects-container').append('<h4>Select Two Department Level Subjects:</h4>');
//                 $('#optional-subjects-container').append('<select id="department-optional1" name="department-optional1" required><option value="" disabled selected>Select Department Level Subject 1</option></select>');
//                 $('#optional-subjects-container').append('<select id="department-optional2" name="department-optional2" required><option value="" disabled selected>Select Department Level Subject 2</option></select>');
//                 optionalSubjects.department.forEach(subject => {
//                     $('#department-optional1').append(`<option value="${subject.id}">${subject.name}</option>`);
//                     $('#department-optional2').append(`<option value="${subject.id}">${subject.name}</option>`);
//                 });
            

//                 // Populate institute level subjects
//                 $('#optional-subjects-container').append('<h4>Select Institute Level Subject:</h4>');
//                 $('#optional-subjects-container').append('<select id="institute-optional" name="institute-optional" required><option value="" disabled selected>Select Institute Level Subject</option></select>');
//                 optionalSubjects.institute.forEach(subject => {
//                     $('#institute-optional').append(`<option value="${subject.id}">${subject.name}</option>`);
//                 });
//             } else if (selectedSem === "VIII") {
//                 $('#optional-subjects-container').append('<h4>Select One Department Level Subject:</h4>');
//                 $('#optional-subjects-container').append('<select id="department-optional" name="department-optional" required><option value="" disabled selected>Select Department Level Subject</option></select>');
//                 optionalSubjects.department.forEach(subject => {
//                     $('#department-optional').append(`<option value="${subject.id}">${subject.name}</option>`);
//                 });

//                 $('#optional-subjects-container').append('<h4>Select Institute Level Subject:</h4>');
//                 $('#optional-subjects-container').append('<select id="institute-optional" name="institute-optional" required><option value="" disabled selected>Select Institute Level Subject</option></select>');
//                 optionalSubjects.institute.forEach(subject => {
//                     $('#institute-optional').append(`<option value="${subject.id}">${subject.name}</option>`);
//                 });
//             }

//             // Fetch existing students data based on the selected semester
//             $.ajax({
//                 type: 'GET',
//                 url: `http://127.0.0.1:5000/get-students/${selectedSem}`,
//                 success: function (response) {
//                     console.log("Fetched students: ", response); // Debugging log
//                     if (response.success) {
//                         existingStudents = response.students; // Store existing students data
//                     } else {
//                         existingStudents = []; // If no students are found, set it to an empty array
//                     }
//                 },
//                 error: function () {
//                     console.log("Error fetching students."); // Debugging log
//                     existingStudents = []; // If there's an error, reset the existing students data
//                 }
//             });
//         }
//     });

//     // Validate fields for duplicates and other constraints
//     $('#username, #rollno, #collegeid, #phoneno, #password, #confirmpassword').on('input', function () {
//         const value = $(this).val();
//         const field = $(this).attr('id');
//         let errorElement = $(`#${field}-error`);

//         // Duplicate Check
//         if (field === 'username' || field === 'rollno' || field === 'collegeid') {
//             const isDuplicate = existingStudents.some(student => student[field] === value);
//             if (isDuplicate) {
//                 errorElement.text(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`).addClass('active');
//                 disableRegisterButton();
//                 return;
//             } else {
//                 errorElement.removeClass('active');
//             }
//         }

//         // Additional Validations
//         if (field === 'phoneno') {
//             if (!/^\d*$/.test(value)) {
//                 errorElement.text('Phone number can only contain digits.').addClass('active');
//                 disableRegisterButton();
//                 return;
//             } else if (!phoneRegex.test(value)) {
//                 errorElement.text('Phone number must be exactly 10 digits.').addClass('active');
//                 disableRegisterButton();
//                 return;
//             } else {
//                 errorElement.removeClass('active');
//             }
//         }

//         if (field === 'collegeid') {
//             if (!emailRegex.test(value)) {
//                 errorElement.text('College ID must end with @kccemsr.edu.in').addClass('active');
//                 disableRegisterButton();
//                 return;
//             } else {
//                 errorElement.removeClass('active');
//             }
//         }

//         if (field === 'confirmpassword' || field === 'password') {
//             const password = $('#password').val();
//             const confirmPassword = $('#confirmpassword').val();
//             errorElement = $('#password-error');
//             if (password !== confirmPassword) {
//                 errorElement.text('Passwords do not match.').addClass('active');
//                 disableRegisterButton();
//                 return;
//             } else {
//                 errorElement.removeClass('active');
//             }
//         }

//         enableRegisterButtonIfValid(); // Check if register button should be enabled
//     });

//     // Function to enable or disable the register button
//     function enableRegisterButtonIfValid() {
//         const isValidPhone = phoneRegex.test($('#phoneno').val());
//         const isValidEmail = emailRegex.test($('#collegeid').val());
//         const isPasswordMatch = $('#password').val() === $('#confirmpassword').val();
//         const areRequiredFieldsFilled = $('#username').val() && $('#fullname').val() && $('#address').val() && $('#rollno').val() && $('#sem').val();
//         const noDuplicateWarnings = $('.error-message.active').length === 0;

//         if (isValidPhone && isValidEmail && isPasswordMatch && areRequiredFieldsFilled && noDuplicateWarnings) {
//             $('#register-btn').removeAttr('disabled');
//         } else {
//             $('#register-btn').attr('disabled', true);
//         }
//     }

//     function disableRegisterButton() {
//         $('#register-btn').attr('disabled', true);
//     }

//     // Handle form submission
//     $('#student-register-form').submit(function (event) {
//         event.preventDefault(); // Prevent default form submission

//         const formData = $(this).serializeArray(); // Serialize the form data
//         const selectedSem = $('#sem').val();
//         let selectedSubjects = [];

//         // Collect compulsory subjects
//         subjects[selectedSem].compulsory.forEach(subject => {
//             selectedSubjects.push({ id: subject.id, name: subject.name });
//         });

//         // Collect optional subjects (if any)
//         if (selectedSem === "V" || selectedSem === "VI") {
//             const optionalSubject = $('#department-optional').val();
//             const subject = subjects[selectedSem].optional.find(opt => opt.id === optionalSubject);
//             if (subject) {
//                 selectedSubjects.push({ id: subject.id, name: subject.name });
//             }
//         } else if (selectedSem === "VII") {
//             const departmentOptional1 = $('#department-optional1').val();
//             const departmentOptional2 = $('#department-optional2').val();
//             const instituteOptional = $('#institute-optional').val();

//             const dept1 = subjects[selectedSem].optional.department.find(opt => opt.id === departmentOptional1);
//             const dept2 = subjects[selectedSem].optional.department.find(opt => opt.id === departmentOptional2);
//             const institute = subjects[selectedSem].optional.institute.find(opt => opt.id === instituteOptional);

//             if (dept1) selectedSubjects.push({ id: dept1.id, name: dept1.name });
//             if (dept2) selectedSubjects.push({ id: dept2.id, name: dept2.name });
//             if (institute) selectedSubjects.push({ id: institute.id, name: institute.name });
//         } else if (selectedSem === "VIII") {
//             const departmentOptional = $('#department-optional').val();
//             const instituteOptional = $('#institute-optional').val();

//             const dept = subjects[selectedSem].optional.department.find(opt => opt.id === departmentOptional);
//             const institute = subjects[selectedSem].optional.institute.find(opt => opt.id === instituteOptional);

//             if (dept) selectedSubjects.push({ id: dept.id, name: dept.name });
//             if (institute) selectedSubjects.push({ id: institute.id, name: institute.name });
//         }

//         // Add selected subjects to form data
//         formData.push({ name: 'subjects', value: JSON.stringify(selectedSubjects) });

//         // Send form data via AJAX
//         $.ajax({
//             type: 'POST',
//             url: 'http://127.0.0.1:5000/register-student',
//             data: $.param(formData), // Serialize formData object
//             success: function (response) {
//                 alert(response.message);
//                 window.location.href = 'index.html'; // Redirect to index.html after successful registration
//             },
//             error: function () {
//                 alert("Error in registration");
//             }
//         });
//     });

//     // Initially disable the register button if fields are not filled
//     disableRegisterButton();
// });



$(document).ready(function () {
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._$]+@kccemsr\.edu\.in$/;
    let existingStudents = []; // To store existing student data for the selected semester

    // Define the subjects data
    const subjects = {
        "III": {
            compulsory: [
                { "id": "ITC301", "name": "Engineering Mathematics-III" },
                { "id": "ITC302", "name": "Data Structure and Analysis" },
                { "id": "ITC303", "name": "Database Management System" },
                { "id": "ITC304", "name": "Principle of Communication" },
                { "id": "ITC305", "name": "Paradigms and Computer Programming Fundamentals" }
            ],
            optional: []
        },
        "IV": {
            compulsory: [
                { "id": "ITC401", "name": "Engineering Mathematics-IV" },
                { "id": "ITC402", "name": "Computer Network and Network Design" },
                { "id": "ITC403", "name": "Operating System" },
                { "id": "ITC404", "name": "Automata Theory" },
                { "id": "ITC405", "name": "Computer Organization and Architecture" }
            ],
            optional: []
        },
        "V": {
            compulsory: [
                { "id": "ITC501", "name": "Internet Programming" },
                { "id": "ITC502", "name": "Computer Network Security" },
                { "id": "ITC503", "name": "Entrepreneurship and E-business" },
                { "id": "ITC504", "name": "Software Engineering" }
            ],
            optional: [
                { "id": "ITDO5012", "name": "Advance Data Management Technologies" },
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
            optional: [
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
            optional: {
                department: [
                    { "id": "ITDO7011", "name": "Storage Area Network" },
                    { "id": "ITDO7012", "name": "High-Performance Computing" },
                    { "id": "ITDO7013", "name": "Infrastructure Security" },
                    { "id": "ITDO7014", "name": "Software Testing and QA" }
                ],
                institute: [
                    { "id": "ILO7011", "name": "Product Lifecycle Management" },
                    { "id": "ILO7012", "name": "Reliability Engineering" },
                    { "id": "ILO7013", "name": "Management Information System" }
                ]
            }
        },
        "VIII": {
            compulsory: [
                { "id": "ITC801", "name": "Big Data Analytics" },
                { "id": "ITC802", "name": "Internet of Everything" }
            ],
            optional: {
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
        }
    };

    // Handle semester change and fetch existing students
    $('#sem').change(function () {
        const selectedSem = $(this).val();

        // Clear previous subjects
        $('#compulsory-subjects-container').empty();
        $('#optional-subjects-container').empty();

        if (selectedSem) {
            // Populate the compulsory subjects for the selected semester
            const compulsorySubjects = subjects[selectedSem].compulsory;
            const optionalSubjects = subjects[selectedSem].optional;

            $('#compulsory-subjects-container').append('<h3>Compulsory Subjects:</h3>');
            compulsorySubjects.forEach(subject => {
                $('#compulsory-subjects-container').append(`<p>${subject.id} - ${subject.name}</p>`);
            });

            // Handling optional subjects for semesters
            if (selectedSem === "V" || selectedSem === "VI") {
                $('#optional-subjects-container').append('<h4>Select Department Level Subject:</h4>');
                $('#optional-subjects-container').append('<select id="department-optional" name="department-optional" required><option value="" disabled selected>Select Department Level Subject</option></select>');
                optionalSubjects.forEach(subject => {
                    $('#department-optional').append(`<option value="${subject.id}">${subject.name}</option>`);
                });
            } else if (selectedSem === "VII") {
                $('#optional-subjects-container').append('<h4>Select Two Department Level Subjects:</h4>');
                $('#optional-subjects-container').append('<select id="department-optional1" name="department-optional1" required><option value="" disabled selected>Select Department Level Subject 1</option></select>');
                $('#optional-subjects-container').append('<select id="department-optional2" name="department-optional2" required><option value="" disabled selected>Select Department Level Subject 2</option></select>');
                optionalSubjects.department.forEach(subject => {
                    $('#department-optional1').append(`<option value="${subject.id}">${subject.name}</option>`);
                    $('#department-optional2').append(`<option value="${subject.id}">${subject.name}</option>`);
                });
            
                // Populate institute level subjects
                $('#optional-subjects-container').append('<h4>Select Institute Level Subject:</h4>');
                $('#optional-subjects-container').append('<select id="institute-optional" name="institute-optional" required><option value="" disabled selected>Select Institute Level Subject</option></select>');
                optionalSubjects.institute.forEach(subject => {
                    $('#institute-optional').append(`<option value="${subject.id}">${subject.name}</option>`);
                });

                // Disable selected subject in the second dropdown for department-level subjects
                $('#department-optional1').change(function () {
                    const selectedSubject1 = $(this).val();
                    $('#department-optional2 option').prop('disabled', false); // Enable all options first
                    if (selectedSubject1) {
                        $(`#department-optional2 option[value="${selectedSubject1}"]`).prop('disabled', true); // Disable the selected subject in the second dropdown
                    }
                });

                $('#department-optional2').change(function () {
                    const selectedSubject2 = $(this).val();
                    $('#department-optional1 option').prop('disabled', false); // Enable all options first
                    if (selectedSubject2) {
                        $(`#department-optional1 option[value="${selectedSubject2}"]`).prop('disabled', true); // Disable the selected subject in the first dropdown
                    }
                });
            } else if (selectedSem === "VIII") {
                $('#optional-subjects-container').append('<h4>Select One Department Level Subject:</h4>');
                $('#optional-subjects-container').append('<select id="department-optional" name="department-optional" required><option value="" disabled selected>Select Department Level Subject</option></select>');
                optionalSubjects.department.forEach(subject => {
                    $('#department-optional').append(`<option value="${subject.id}">${subject.name}</option>`);
                });

                $('#optional-subjects-container').append('<h4>Select Institute Level Subject:</h4>');
                $('#optional-subjects-container').append('<select id="institute-optional" name="institute-optional" required><option value="" disabled selected>Select Institute Level Subject</option></select>');
                optionalSubjects.institute.forEach(subject => {
                    $('#institute-optional').append(`<option value="${subject.id}">${subject.name}</option>`);
                });
            }

            // Fetch existing students data based on the selected semester
            $.ajax({
                type: 'GET',
                url: `http://127.0.0.1:5000/get-students/${selectedSem}`,
                success: function (response) {
                    console.log("Fetched students: ", response); // Debugging log
                    if (response.success) {
                        existingStudents = response.students; // Store existing students data
                    } else {
                        existingStudents = []; // If no students are found, set it to an empty array
                    }
                },
                error: function () {
                    console.log("Error fetching students."); // Debugging log
                    existingStudents = []; // If there's an error, reset the existing students data
                }
            });
        }
    });

    // Validate fields for duplicates and other constraints
    $('#username, #rollno, #collegeid, #phoneno, #password, #confirmpassword').on('input', function () {
        const value = $(this).val();
        const field = $(this).attr('id');
        let errorElement = $(`#${field}-error`);

        // Duplicate Check
        if (field === 'username' || field === 'rollno' || field === 'collegeid') {
            const isDuplicate = existingStudents.some(student => student[field] === value);
            if (isDuplicate) {
                errorElement.text(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`).addClass('active');
                disableRegisterButton();
                return;
            } else {
                errorElement.removeClass('active');
            }
        }

        // Additional Validations
        if (field === 'phoneno') {
            if (!/^\d*$/.test(value)) {
                errorElement.text('Phone number can only contain digits.').addClass('active');
                disableRegisterButton();
                return;
            } else if (!phoneRegex.test(value)) {
                errorElement.text('Phone number must be exactly 10 digits.').addClass('active');
                disableRegisterButton();
                return;
            } else {
                errorElement.removeClass('active');
            }
        }

        if (field === 'collegeid') {
            if (!emailRegex.test(value)) {
                errorElement.text('College ID must end with @kccemsr.edu.in').addClass('active');
                disableRegisterButton();
                return;
            } else {
                errorElement.removeClass('active');
            }
        }

        if (field === 'confirmpassword' || field === 'password') {
            const password = $('#password').val();
            const confirmPassword = $('#confirmpassword').val();
            errorElement = $('#password-error');
            if (password !== confirmPassword) {
                errorElement.text('Passwords do not match.').addClass('active');
                disableRegisterButton();
                return;
            } else {
                errorElement.removeClass('active');
            }
        }

        enableRegisterButtonIfValid(); // Check if register button should be enabled
    });

    // Function to enable or disable the register button
    function enableRegisterButtonIfValid() {
        const isValidPhone = phoneRegex.test($('#phoneno').val());
        const isValidEmail = emailRegex.test($('#collegeid').val());
        const isPasswordMatch = $('#password').val() === $('#confirmpassword').val();
        const areRequiredFieldsFilled = $('#username').val() && $('#fullname').val() && $('#address').val() && $('#rollno').val() && $('#sem').val();
        const noDuplicateWarnings = $('.error-message.active').length === 0;

        if (isValidPhone && isValidEmail && isPasswordMatch && areRequiredFieldsFilled && noDuplicateWarnings) {
            $('#register-btn').removeAttr('disabled');
        } else {
            $('#register-btn').attr('disabled', true);
        }
    }

    function disableRegisterButton() {
        $('#register-btn').attr('disabled', true);
    }

    // Handle form submission
    $('#student-register-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        const formData = $(this).serializeArray(); // Serialize the form data
        const selectedSem = $('#sem').val();
        let selectedSubjects = [];

        // Collect compulsory subjects
        subjects[selectedSem].compulsory.forEach(subject => {
            selectedSubjects.push({ id: subject.id, name: subject.name });
        });

        // Collect optional subjects (if any)
        if (selectedSem === "V" || selectedSem === "VI") {
            const optionalSubject = $('#department-optional').val();
            const subject = subjects[selectedSem].optional.find(opt => opt.id === optionalSubject);
            if (subject) {
                selectedSubjects.push({ id: subject.id, name: subject.name });
            }
        } else if (selectedSem === "VII") {
            const departmentOptional1 = $('#department-optional1').val();
            const departmentOptional2 = $('#department-optional2').val();
            const instituteOptional = $('#institute-optional').val();

            const dept1 = subjects[selectedSem].optional.department.find(opt => opt.id === departmentOptional1);
            const dept2 = subjects[selectedSem].optional.department.find(opt => opt.id === departmentOptional2);
            const institute = subjects[selectedSem].optional.institute.find(opt => opt.id === instituteOptional);

            if (dept1) selectedSubjects.push({ id: dept1.id, name: dept1.name });
            if (dept2) selectedSubjects.push({ id: dept2.id, name: dept2.name });
            if (institute) selectedSubjects.push({ id: institute.id, name: institute.name });
        } else if (selectedSem === "VIII") {
            const departmentOptional = $('#department-optional').val();
            const instituteOptional = $('#institute-optional').val();

            const dept = subjects[selectedSem].optional.department.find(opt => opt.id === departmentOptional);
            const institute = subjects[selectedSem].optional.institute.find(opt => opt.id === instituteOptional);

            if (dept) selectedSubjects.push({ id: dept.id, name: dept.name });
            if (institute) selectedSubjects.push({ id: institute.id, name: institute.name });
        }

        // Add selected subjects to form data
        formData.push({ name: 'subjects', value: JSON.stringify(selectedSubjects) });

        // Send form data via AJAX
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:5000/register-student',
            data: $.param(formData), // Serialize formData object
            success: function (response) {
                alert(response.message);
                window.location.href = 'index.html'; // Redirect to index.html after successful registration
            },
            error: function () {
                alert("Error in registration");
            }
        });
    });

    // Initially disable the register button if fields are not filled
    disableRegisterButton();
});
