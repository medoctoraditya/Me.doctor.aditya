/* =========================================================
   ME-ADI MEDICAL WEBSITE
   SCRIPT.JS
========================================================= */


/* =========================================================
   BASIC SETTINGS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* Current year */
    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* Set minimum appointment date to today */
    const appointmentDate = document.getElementById("appointmentDate");

    if (appointmentDate) {

        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        appointmentDate.min = `${year}-${month}-${day}`;
    }

});


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {

    menuBtn.addEventListener("click", () => {

        nav.classList.toggle("active");

        if (nav.classList.contains("active")) {
            menuBtn.textContent = "×";
        } else {
            menuBtn.textContent = "☰";
        }

    });


    /* Close menu when a link is clicked */

    nav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("active");

            menuBtn.textContent = "☰";

        });

    });

}


/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 50) {

        header.style.boxShadow =
            "0 8px 30px rgba(10, 60, 70, 0.08)";

    } else {

        header.style.boxShadow = "none";

    }

});


/* =========================================================
   CHAT MODAL
========================================================= */

function openChatModal() {

    const modal = document.getElementById("chatModal");

    if (!modal) return;

    modal.classList.add("active");

    document.body.style.overflow = "hidden";

}


function closeChatModal() {

    const modal = document.getElementById("chatModal");

    if (!modal) return;

    modal.classList.remove("active");

    document.body.style.overflow = "";

}


/* =========================================================
   SUCCESS MODAL
========================================================= */

function openSuccessModal(name, requestId) {

    const modal = document.getElementById("successModal");

    const nameElement =
        document.getElementById("successPatientName");

    const requestElement =
        document.getElementById("requestId");


    if (nameElement) {
        nameElement.textContent = name;
    }

    if (requestElement) {
        requestElement.textContent = requestId;
    }

    if (modal) {
        modal.classList.add("active");

        document.body.style.overflow = "hidden";
    }

}


function closeSuccessModal() {

    const modal = document.getElementById("successModal");

    if (!modal) return;

    modal.classList.remove("active");

    document.body.style.overflow = "";

}


/* =========================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener("click", (event) => {

    const chatModal =
        document.getElementById("chatModal");

    const successModal =
        document.getElementById("successModal");


    if (
        event.target === chatModal
    ) {
        closeChatModal();
    }


    if (
        event.target === successModal
    ) {
        closeSuccessModal();
    }

});


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        closeChatModal();

        closeSuccessModal();

    }

});


/* =========================================================
   MOBILE NUMBER VALIDATION
========================================================= */

function isValidIndianMobile(number) {

    return /^[6-9]\d{9}$/.test(number);

}


/* =========================================================
   GENERATE REQUEST ID
========================================================= */

function generateRequestId() {

    const now = new Date();

    const random =
        Math.floor(1000 + Math.random() * 9000);

    return `MEADI-${now.getFullYear()}-${random}`;

}

const API_BASE_URL =
    document
        .querySelector('meta[name="api-base-url"]')
        ?.content
        .replace(/\/$/, "") || "http://localhost:5000";

async function submitConsultation(payload) {

    let response;

    try {
        response = await fetch(
            `${API_BASE_URL}/api/consultation`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );
    } catch (error) {
        throw new Error(
            "Unable to connect to the consultation service. Please try again or contact the doctor directly."
        );
    }

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Unable to send your request."
        );
    }

    return result;
}


/* =========================================================
   CHAT FORM
========================================================= */

const chatForm =
    document.getElementById("chatForm");


if (chatForm) {

    chatForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        /* Get values */

        const name =
            document.getElementById("patientName").value.trim();

        const mobile =
            document.getElementById("patientMobile").value.trim();

        const age =
            document.getElementById("patientAge").value.trim();

        const gender =
            document.getElementById("patientGender").value;

        const city =
            document.getElementById("patientCity").value.trim();

        const problem =
            document.getElementById("patientProblem").value.trim();

        const contactMethod =
            document.getElementById("contactMethod").value;

        const consent =
            document.getElementById("patientConsent").checked;


        /* Basic validation */

        if (!name) {

            alert("Please enter patient name.");

            return;
        }


        if (!isValidIndianMobile(mobile)) {

            alert(
                "Please enter a valid 10-digit Indian mobile number."
            );

            return;
        }


        if (!age || age < 1 || age > 120) {

            alert("Please enter a valid age.");

            return;
        }


        if (!problem) {

            alert(
                "Please briefly describe your concern."
            );

            return;
        }


        if (!consent) {

            alert(
                "Please agree to share your information."
            );

            return;
        }


        try {
            const result = await submitConsultation({
                name,
                mobile,
                age,
                gender,
                city,
                problem,
                contactMethod
            });

            closeChatModal();
            chatForm.reset();
            openSuccessModal(name, result.requestId);

        } catch (error) {
            alert(error.message);
            return;

        }

    });

}


/* =========================================================
   APPOINTMENT FORM
========================================================= */

const appointmentForm =
    document.getElementById("appointmentForm");


if (appointmentForm) {

    appointmentForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const name =
                document.getElementById("appointmentName")
                    .value
                    .trim();


            const mobile =
                document.getElementById("appointmentMobile")
                    .value
                    .trim();


            const age =
                document.getElementById("appointmentAge")
                    .value
                    .trim();


            const date =
                document.getElementById("appointmentDate")
                    .value;


            const reason =
                document.getElementById("appointmentReason")
                    .value
                    .trim();


            if (!name) {

                alert("Please enter your name.");

                return;

            }


            if (!isValidIndianMobile(mobile)) {

                alert(
                    "Please enter a valid 10-digit Indian mobile number."
                );

                return;

            }


            if (!reason) {

                alert(
                    "Please describe the reason for appointment."
                );

                return;

            }


            try {
                const result = await submitConsultation({
                    name,
                    mobile,
                    age,
                    problem: reason,
                    preferredDate: date,
                    contactMethod: "Appointment"
                });

                appointmentForm.reset();
                openSuccessModal(name, result.requestId);

            } catch (error) {
                alert(error.message);
                return;

            }

        }
    );

}


/* =========================================================
   FAQ
========================================================= */

const faqQuestions =
    document.querySelectorAll(".faq-question");


faqQuestions.forEach(question => {

    question.addEventListener("click", () => {

        const item =
            question.closest(".faq-item");


        const alreadyActive =
            item.classList.contains("active");


        /* Close all */

        document
            .querySelectorAll(".faq-item")
            .forEach(faq => {

                faq.classList.remove("active");

            });


        /* Open clicked one */

        if (!alreadyActive) {

            item.classList.add("active");

        }

    });

});


/* =========================================================
   PHONE INPUT - ONLY NUMBERS
========================================================= */

const phoneInputs =
    document.querySelectorAll(
        'input[type="tel"]'
    );


phoneInputs.forEach(input => {

    input.addEventListener("input", () => {

        input.value =
            input.value.replace(/\D/g, "");

    });

});


/* =========================================================
   REVEAL ANIMATION
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".service-card, .feature-card, .review-card, .doctor-profile, .appointment-wrapper"
    );


const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.08
        }
    );


revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(25px)";

    element.style.transition =
        "opacity 0.7s ease, transform 0.7s ease";

    revealObserver.observe(element);

});


/* =========================================================
   DEMO ADMIN HELPER
=========================================================

   Open browser console and run:

   getMeadiRequests()

   to see demo requests stored in localStorage.

========================================================= */

function getMeadiRequests() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "meadi_requests"
            ) || "[]"
        );

    } catch (error) {

        console.error(error);

        return [];

    }

}


function getMeadiAppointments() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "meadi_appointments"
            ) || "[]"
        );

    } catch (error) {

        console.error(error);

        return [];

    }

}


/* =========================================================
   PAGE LOAD MESSAGE
========================================================= */

console.log(
    "%cMe-adi",
    "font-size:28px;font-weight:bold;color:#087f8c;"
);

console.log(
    "Medical website frontend loaded successfully."
);