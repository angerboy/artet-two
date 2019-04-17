
window.onload = function() {
    const ageVerificationDiv = document.getElementById('age-verification');
    const sidebar = document.getElementById('position-indicator');
    if(document.cookie === "verified=true") {
        ageVerificationDiv.className = "age-verification hidden";
        sidebar.className = "position-indicator visible";
    } else {
        ageVerificationDiv.className = "age-verification visible";
    }
}

function over21() {
    const ageVerificationDiv = document.getElementById('age-verification');
    const sidebar = document.getElementById('position-indicator');

    ageVerificationDiv.className = "age-verification hidden";
    sidebar.className = "position-indicator visible";

    document.cookie = "verified=true";
}

function under21() {
    window.location = "https://google.com";
}