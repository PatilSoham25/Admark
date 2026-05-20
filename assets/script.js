document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header", "components/header.html");
    loadComponent("footer", "components/footer.html");

    // Observe changes and initialize features once header/footer loads
    const observer = new MutationObserver(() => {
        setupDropdowns();
        setupMobileMenu(); // ✅ Re-initialize after header loads
        setupScrollToTop();
        setupContactForm();
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

// FUNCTION TO LOAD HEADER & FOOTER DYNAMICALLY
function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (elementId === "header") setupMobileMenu(); // ✅ Ensure Mobile Menu works after load
        })
        .catch(error => console.error(`Error loading ${filePath}:`, error));
}

// FUNCTION TO HANDLE MOBILE MENU TOGGLE (HAMBURGER MENU)
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mainMenu = document.querySelector(".main-menu");

    if (!mobileMenuBtn || !mainMenu) return;

    // ✅ Remove previous event listeners before adding new ones
    mobileMenuBtn.removeEventListener("click", toggleMenu);
    mobileMenuBtn.addEventListener("click", toggleMenu);

    document.removeEventListener("click", closeMenuOnOutsideClick);
    document.addEventListener("click", closeMenuOnOutsideClick);

    function toggleMenu(e) {
        e.stopPropagation();
        mainMenu.classList.toggle("show");
    }

    function closeMenuOnOutsideClick(e) {
        if (!mainMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mainMenu.classList.remove("show");
        }
    }
}

// FUNCTION TO HANDLE DROPDOWN MENU
function setupDropdowns() {
    const isMobile = window.innerWidth <= 768;

    document.querySelectorAll(".panel-dropdown").forEach(dropdown => {
        const submenu = dropdown.querySelector(".dropdown-panel");

        if (!submenu) return;

        submenu.style.display = "none";

        if (isMobile) {
            dropdown.addEventListener("click", function (e) {
                e.stopPropagation();
                closeAllDropdowns();
                toggleDropdown(submenu);
            });
        } else {
            dropdown.addEventListener("mouseenter", () => showDropdown(submenu));
            dropdown.addEventListener("mouseleave", () => hideDropdown(submenu));
        }
    });

    document.addEventListener("click", closeAllDropdowns);
}

// SHOW & HIDE DROPDOWNS
function showDropdown(submenu) {
    submenu.style.display = "block";
}

function hideDropdown(submenu) {
    submenu.style.display = "none";
}

// FUNCTION TO CLOSE ALL DROPDOWNS
function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-panel").forEach(submenu => {
        submenu.style.display = "none";
    });
}

// FUNCTION TO TOGGLE DROPDOWN (MOBILE)
function toggleDropdown(submenu) {
    submenu.style.display = submenu.style.display === "block" ? "none" : "block";
}

// FUNCTION TO SHOW/HIDE SCROLL TO TOP BUTTON
function setupScrollToTop() {
    const scrollToTopBtn = document.getElementById("scrollToTop");
    if (!scrollToTopBtn) return;

    scrollToTopBtn.style.display = "none";

    window.addEventListener("scroll", function () {
        scrollToTopBtn.style.display = window.scrollY > 300 ? "flex" : "none";
    });

    scrollToTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// SLIDESHOW FUNCTIONALITY
document.addEventListener("DOMContentLoaded", function () {
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        const slides = document.querySelectorAll(".slide");
        const dots = document.querySelectorAll(".dot");

        slides.forEach(slide => (slide.style.display = "none"));
        dots.forEach(dot => dot.classList.remove("active"));

        slideIndex = (slideIndex + 1) % slides.length;

        slides[slideIndex].style.display = "block";
        dots[slideIndex].classList.add("active");

        setTimeout(showSlides, 5000);
    }

    window.currentSlide = function (n) {
        slideIndex = n - 1;
        showSlides();
    };
});

// HANDLE DROPDOWN BEHAVIOR ON RESIZE
window.addEventListener("resize", () => {
    setupDropdowns();
    if (window.innerWidth > 768) {
        document.querySelector(".main-menu")?.classList.remove("show");
    }
});

// FUNCTION TO SET UP CONTACT FORM
document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    // Remove any previous event listeners
    contactForm.removeEventListener("submit", handleFormSubmit);
    contactForm.addEventListener("submit", handleFormSubmit);
});

// FUNCTION TO HANDLE FORM SUBMISSION
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const message = document.querySelector('textarea[name="message"]').value;

    // ✅ Google Form Action URL
    const googleFormURL = "https://docs.google.com/forms/d/e/1FAIpQLSfvgBtlywPrt8U2B-tcWF9XJ6KeaGMcVTIskdfVehGPEJv1RA/formResponse";

    // ✅ Google Form Entry IDs
    const formData = new FormData();
    formData.append("entry.856552114", name); // Name Field
    formData.append("entry.416083448", email); // Email Field
    formData.append("entry.533288431", message); // Message Field

    // Submit data using fetch
    fetch(googleFormURL, {
        method: "POST",
        body: formData,
        mode: "no-cors" // Allows cross-origin submission
    }).then(() => {
        alert("Thank you! Your message has been submitted successfully.");
        document.getElementById("contactForm").reset(); // Reset form
    }).catch(error => console.error("Error:", error));
}

// Accordion Functionality
document.querySelectorAll(".accordion-header").forEach(button => {
    button.addEventListener("click", () => {
        const accordionItem = button.parentElement;

        // Close all other accordion sections
        document.querySelectorAll(".accordion-item").forEach(item => {
            if (item !== accordionItem) {
                item.classList.remove("active");
                item.querySelector(".accordion-content").style.display = "none";
            }
        });

        // Toggle clicked section
        if (accordionItem.classList.contains("active")) {
            accordionItem.classList.remove("active");
            button.nextElementSibling.style.display = "none";
        } else {
            accordionItem.classList.add("active");
            button.nextElementSibling.style.display = "block";
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const breadcrumbContainer = document.querySelector("#dynamic-breadcrumbs");
    
    if (breadcrumbContainer) {
        // Get the current filename accurately
        const path = window.location.pathname;
        let page = path.split("/").pop(); 

        // Default to index.html if the path is empty (homepage)
        if (page === "" || page === undefined) {
            page = "index.html";
        }

        const breadcrumbMap = {
            "about.html": { parent: null, current: "About Us" },
            "contact.html": { parent: null, current: "Contact Us" },
            "printers.html": { parent: null, current: "Digital Printers" },
            "flex.html": { parent: { name: "Digital Printers", url: "printers.html" }, current: "Flex" },
            "eco_solvent.html": { parent: { name: "Digital Printers", url: "printers.html" }, current: "Eco Solvent" },
            "uv_flated.html": { parent: { name: "Digital Printers", url: "printers.html" }, current: "UV Flatbed" },
            "uv_Hybrid.html": { parent: { name: "Digital Printers", url: "printers.html" }, current: "UV Hybrid" },
            "uv_roll_to_roll.html": { parent: { name: "Digital Printers", url: "printers.html" }, current: "UV Roll To Roll" },
            "cnc-router.html": { parent: null, current: "CNC Router" },
            "cnc_Router_4'x8'.html": { parent: { name: "CNC Router", url: "cnc-router.html" }, current: "4' x 8'" },
            "cnc_Router_5'x10'.html": { parent: { name: "CNC Router", url: "cnc-router.html" }, current: "5' x 10'" },
            "cnc_Router_DoubleSpindle.html": { parent: { name: "CNC Router", url: "cnc-router.html" }, current: "Double Spindle" },
            "cnc_Router_PatternStone_Marking.html": { parent: { name: "CNC Router", url: "cnc-router.html" }, current: "Pattern/Stone Making" },
            "cnc-laser.html": { parent: null, current: "CNC Laser" },
            "cnc_Laser_2x3.html": { parent: { name: "CNC Laser", url: "cnc-laser.html" }, current: "2' x 3' CNC Laser" },
            "cnc_Laser_4x3.html": { parent: { name: "CNC Laser", url: "cnc-laser.html" }, current: "4' x 3' CNC Laser" },
            "cnc_Laser_4x4.html": { parent: { name: "CNC Laser", url: "cnc-laser.html" }, current: "4' x 4' CNC Laser" },
            "cnc_Laser_8x4.html": { parent: { name: "CNC Laser", url: "cnc-laser.html" }, current: "8' x 4' CNC Laser" },
            "cnc_Laser_CCD.html": { parent: { name: "CNC Laser", url: "cnc-laser.html" }, current: "CCD" },
            "cnc_Laser_FiberLaser.html": { parent: { name: "CNC Laser", url: "cnc-laser.html" }, current: "Fiber Laser" },
            "led-display.html": { parent: null, current: "LED Display" },
            "led_Display_Indoor.html": { parent: { name: "LED Display", url: "led-display.html" }, current: "Indoor LED Display" },
            "led_Display_Outdoor.html": { parent: { name: "LED Display", url: "led-display.html" }, current: "Outdoor LED Display" },
            "led_Display_Vehicle.html": { parent: { name: "LED Display", url: "led-display.html" }, current: "Vehicle LED Display" },
            "led_Display_Rental.html": { parent: { name: "LED Display", url: "led-display.html" }, current: "Rental LED Display Services" },
            "chennel-Bending.html": { parent: null, current: "CNC Channel Bending" },
            "chennel_Bending_Aluminium.html": { parent: { name: "CNC Channel Bending", url: "chennel-Bending.html" }, current: "Aluminum" },
            "video-gallery.html": { parent: null, current: "Video Gallery" },
            "complete_project.html": { parent: { name: "Video Gallery", url: "video-gallery.html" }, current: "Complete Project" }
        };

        const pageData = breadcrumbMap[page];

        if (pageData) {
            // Notice: We use root "/" or relative paths now, not hardcoded folder names
            let html = `<ul><li><a href="index.html"><i class="fa-solid fa-house"></i> Home</a></li>`;
            
            if (pageData.parent) {
                html += `<li class="separator">/</li><li><a href="${pageData.parent.url}">${pageData.parent.name}</a></li>`;
            }
            
            if (page !== "index.html") {
                html += `<li class="separator">/</li><li class="active">${pageData.current}</li>`;
            }
            
            html += `</ul>`;
            breadcrumbContainer.innerHTML = html;
        } else {
            console.warn("Breadcrumb Error: Current page filename '" + page + "' not found in breadcrumbMap.");
        }
    }
});


document.addEventListener("DOMContentLoaded", () => {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const currentItem = question.parentElement;
      const answer = currentItem.querySelector(".faq-answer");
      
      // Close all other open items (Optional: remove this block if you want multiple open at once)
      document.querySelectorAll(".faq-item").forEach((item) => {
        if (item !== currentItem) {
          item.classList.remove("active");
          item.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      // Toggle current item
      currentItem.classList.toggle("active");
      
      if (currentItem.classList.contains("active")) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = null;
      }
    });
  });
});



// Ensure GSAP is loaded
gsap.from(".floating-contact-btn", {
  duration: 1,
  y: 100,
  opacity: 0,
  ease: "expo.out",
  delay: 1.5 // Appears after the initial hero animation
});

// Magnetic hover effect
const btn = document.querySelector(".floating-contact-btn");
btn.addEventListener("mousemove", (e) => {
  const { offsetX, offsetY, target } = e;
  const { clientWidth, clientHeight } = target;
  
  const xPos = (offsetX / clientWidth - 0.5) * 20;
  const yPos = (offsetY / clientHeight - 0.5) * 20;

  gsap.to(btn, {
    x: xPos,
    y: yPos,
    duration: 0.3
  });
});

btn.addEventListener("mouseleave", () => {
  gsap.to(btn, {
    x: 0,
    y: 0,
    duration: 0.3
  });
});