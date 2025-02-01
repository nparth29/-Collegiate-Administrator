document.getElementById('teacherLoginForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const teacherIdentifier = document.getElementById('teacherIdentifier').value;
    const teacherPassword = document.getElementById('teacherPassword').value;
  
    // AJAX request to server for authentication
    fetch('http://127.0.0.1:5000/login-teacher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: teacherIdentifier,
        password: teacherPassword
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Store the username in sessionStorage
        sessionStorage.setItem('username', teacherIdentifier);
  
        // Redirect to the teacher dashboard
        window.location.href = '/html/teacher-page.html';
      } else {
        alert('Login failed. Please check your username and password.');
      }
    })
    .catch(error => {
      console.error('Error during login:', error);
      document.getElementById('loginError').innerText = 'An error occurred. Please try again.';
    });
});
