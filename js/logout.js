document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logout-btn');

    // Handle the logout button click event
    logoutButton.addEventListener('click', function () {
        // Clear session storage
        sessionStorage.clear();

        // Optionally, clear local storage or cookies if needed
        // localStorage.clear();

        // Redirect the user back to the login page
        window.location.href = '../html/teacher-login.html';
    });
});
