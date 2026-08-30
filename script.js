document.addEventListener("DOMContentLoaded", function () {

    let currentPage = window.location.pathname.split("/").pop();

    // GitHub Pages may load the homepage without index.html in the URL
    if (currentPage === "") {
        currentPage = "index.html";
    }

    const navLinks = document.querySelectorAll(".sidebar nav a");

    navLinks.forEach(function (link) {

        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }

    });

});