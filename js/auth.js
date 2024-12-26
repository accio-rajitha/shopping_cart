
function getLocalStorageData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function setLocalStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


function checkLogin() {
    return localStorage.getItem("currentUser") !== null;
}

function signup() {
    const firstName = document.getElementById("firstname").value.trim();
    const lastName = document.getElementById("lastname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmpassword").value;

    
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

   
    const users = getLocalStorageData("users");
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
        alert("User is already registered!");

       
        document.getElementById("firstname").value = '';
        document.getElementById("lastname").value = '';
        document.getElementById("email").value = '';
        document.getElementById("password").value = '';
        document.getElementById("confirmpassword").value = '';

        return;
    }

    
    const newUser = { firstName, lastName, email, password };
    users.push(newUser);
    setLocalStorageData("users", users);

    alert("Signup successful! Please log in.");
    window.location.href = "login.html"; 
}


function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const users = getLocalStorageData("users");
    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
       
        setLocalStorageData("currentUser", user);

        alert("Login successful!");

       
        const redirectUrl = localStorage.getItem("redirectAfterLogin") || "shop.html";
        localStorage.removeItem("redirectAfterLogin"); 
        window.location.href = redirectUrl;
    } else {
        alert("Invalid email or password!");
    }
}


function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    
    if (!user) {
        alert("Please log in to access your profile.");
        window.location.href = "login.html";
        return;
    }

    
    document.getElementById("firstname").value = user.firstName;
    document.getElementById("lastname").value = user.lastName;
    document.getElementById("email").value = user.email;
}


function updateUserProfile() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

   
    const firstName = document.getElementById("firstname").value.trim();
    const lastName = document.getElementById("lastname").value.trim();
    const email = document.getElementById("email").value.trim();

    
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    
    setLocalStorageData("currentUser", user);

    alert("Profile updated successfully!");
}


function changePassword() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    const oldPassword = document.getElementById("old-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

   
    if (oldPassword !== user.password) {
        alert("Old password is incorrect!");
        return;
    }

   
    if (newPassword !== confirmPassword) {
        alert("New passwords do not match!");
        return;
    }

    
    user.password = newPassword;
    setLocalStorageData("currentUser", user);

    alert("Password changed successfully!");
}


function logout() {
    localStorage.removeItem("currentUser");
    alert("Logged out successfully!");
    window.location.href = "index.html"; 
}


document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("currentUser");
    const restrictedPages = ["profile.html", "shop.html", "cart.html"]; 

    if (!user && restrictedPages.some((page) => window.location.pathname.includes(page))) {
        alert("Please log in to access this page.");
        localStorage.setItem("redirectAfterLogin", window.location.pathname);
        window.location.href = "login.html";
    }
});
