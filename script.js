document.addEventListener("DOMContentLoaded", function () {

    /* ========================= */
    /* ACTIVE NAVIGATION         */
    /* ========================= */

    let currentPage = window.location.pathname.split("/").pop();

    if (!currentPage) {
        currentPage = "index.html";
    }

    const navLinks = document.querySelectorAll(".sidebar nav a");

    navLinks.forEach(function (link) {

        link.classList.remove("active");

        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }

    });


    /* ========================= */
    /* MOBILE MENU               */
    /* ========================= */

    const menuButton = document.getElementById("mobileMenuButton");
    const sidebar = document.querySelector(".sidebar");

    if (menuButton && sidebar) {

        menuButton.addEventListener("click", function () {

            sidebar.classList.toggle("mobile-open");

        });


        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                sidebar.classList.remove("mobile-open");

            });

        });

    }

});