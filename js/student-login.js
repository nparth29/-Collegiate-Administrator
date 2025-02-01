document.getElementById('studentLoginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get the form values
    const semester = document.getElementById('semester').value;
    const identifier = document.getElementById('studentIdentifier').value;
    const password = document.getElementById('studentPassword').value;

    try {
        // Send login request to the server
        const response = await fetch('http://localhost:5000/login-student', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ semester, identifier, password })
        });

        const result = await response.json();

        if (result.success) {
            // Redirect to the student-page.html with semester and identifier
            window.location.href = `student-page.html?semester=${semester}&identifier=${identifier}`;
        } else {
            document.getElementById('loginError').innerText = 'Invalid login credentials. Please try again.';
        }
    } catch (error) {
        console.error('Error during student login:', error);
    }
});
