// Handle Signup
document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (!name || !email || !password || !role) {
        alert("Please fill in all fields.");
        return;
    }

    fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            window.location.href = "/dashboard"; // Redirect to dashboard
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error("Error:", error));
});

// Handle Login
document.getElementById("loginForm")?.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Login successful!");
            window.location.href = "/dashboard";
        } else {
            alert("Login failed: " + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

// Register for Competition
function registerCompetition() {
    const competitionName = document.getElementById('competitionName').value;

    if (!competitionName) {
        alert('Competition name is required!');
        return;
    }

    fetch('/register-competition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitionName })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error:', error));
}

// Report Injury
function reportInjury() {
    const injuryType = document.getElementById('injuryType').value;
    const injuryDate = document.getElementById('injuryDate').value;
    const injuryDescription = document.getElementById('injuryDescription').value;

    if (!injuryType || !injuryDate || !injuryDescription) {
        alert('All fields are required!');
        return;
    }

    fetch('/report-injury', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ injuryType, injuryDate, injuryDescription })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error:', error));
}

// Save Financial Plan
function saveFinancialPlan() {
    const income = document.getElementById('income').value;
    const expenses = document.getElementById('expenses').value;
    const savingsGoal = document.getElementById('savingsGoal').value;

    if (!income || !expenses || !savingsGoal) {
        alert('All fields are required!');
        return;
    }

    fetch('/save-financial-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ income, expenses, savingsGoal })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error:', error));
}
