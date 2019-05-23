
const isMobile = positionIndicator.style.display === 'none';

if( document.readyState !== 'loading' ) {
    checkAge();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        checkAge();
    });
}

function checkAge() {
    const ageVerificationDiv = document.getElementById('age-verification');
    const sidebar = document.getElementById('position-indicator');
    if(document.cookie === "verified=true") {
        ageVerificationDiv.className = "age-verification hidden";
        sidebar.className = "position-indicator visible";

        fadeInLandingBlock();
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

    fadeInLandingBlock();
}

function under21() {
    window.location = "https://google.com";
}

function fadeInLandingBlock() {
    if(isMobile) {
        document.body.style.overflow = 'unset';
        document.body.style.position = 'unset';
    }

    const logo = document.getElementById('artet-cannabis-aperitif');
    const text = document.getElementById('landing-block-text');
    const scroll = document.getElementById('scroll-to-discover');
    const scrollMobile = document.getElementById('scroll-to-discover-mobile');

    logo.className = "visible";
    text.className = "landing-text-container visible";
    scroll.className = "visible";
    scrollMobile.className = "visible";
}