// ==============================
// MOBILE NAVIGATION
// ==============================

// Select the hamburger button
const menuToggle = document.querySelector(".menu-toggle");

// Select the navigation menu
const mainNavigation = document.querySelector("#main-navigation");

// Check that both elements exist
if (menuToggle && mainNavigation) {

    // Listen for clicks on the hamburger button
    menuToggle.addEventListener("click", function () {

        // Check whether the menu is currently open
        const isExpanded =
            menuToggle.getAttribute("aria-expanded") === "true";

        // Update the accessibility state
        menuToggle.setAttribute("aria-expanded", String(!isExpanded));

        // Toggle the menu visibility
        mainNavigation.classList.toggle("active");

        // Update the button's accessible name
        menuToggle.setAttribute(
            "aria-label",
            isExpanded ? "Open navigation menu" : "Close navigation menu"
        );

    });

    // Close the menu after a navigation link is clicked
    mainNavigation.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            mainNavigation.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        });

    });

}
// ==============================
// VENUE FILTERING
// ==============================

// Select the filter dropdown
const venueFilter = document.querySelector("#venue-filter");

// Select all venue cards
const venueCards = document.querySelectorAll(".venue-card");

// Listen for changes in the dropdown
if (venueFilter && venueCards.length > 0) {
    const venueCount = document.querySelector("#venue-count");

    venueFilter.addEventListener("change", function () {

        // Get the selected seating configuration
        const selectedConfig = venueFilter.value;
        let visibleCount = 0;

        // Check each venue card
        venueCards.forEach(function (card) {

            // Read the venue's supported configurations
            const configurations = card.dataset.config.split(" ");

            // Decide whether the venue should be displayed
            const shouldShow =
                selectedConfig === "all" ||
                configurations.includes(selectedConfig);

            // Show or hide the venue card
            card.style.display = shouldShow ? "" : "none";
            if (shouldShow) {
                visibleCount++;
            }

        });

        // Update the venue count
        if (venueCount) {
            venueCount.textContent = `Showing ${visibleCount} venues`;
        }
    });

}
// ==============================
// VENUE MODAL ELEMENTS
// ==============================

const venueButtons = document.querySelectorAll(".venue-button");

const venueModal = document.querySelector("#venue-modal");

const modalClose = document.querySelector("#modal-close");

const modalTitle = document.querySelector("#modal-title");

const modalDescription = document.querySelector("#modal-description");

const modalCapacity = document.querySelector("#modal-capacity");

const modalConfigurations = document.querySelector("#modal-configurations");
const planVenueButton = document.querySelector("#plan-venue-button");
const selectedVenueInput = document.querySelector("#selected-venue");
const eventTypeInput = document.querySelector("#event-type");
const eventPlannerForm = document.querySelector("#event-planner-form");
const summaryVenue = document.querySelector("#summary-venue");

const summaryEventType = document.querySelector("#summary-event-type");

const summaryEventDate = document.querySelector("#summary-event-date");
const editEventButton = document.querySelector("#edit-event-button");
const confirmEventButton = document.querySelector("#confirm-event-button");
const confirmationMessage = document.querySelector("#confirmation-message");

// COST ESTIMATOR INPUTS
const guestCountInput = document.querySelector("#guest-count");
const cateringPackageInput = document.querySelector("#catering-package");
const decorationPackageInput = document.querySelector("#decoration-package");
const seatingArrangementInput = document.querySelector("#seating-arrangement");

// ADDITIONAL SERVICES
const photographyInput = document.querySelector("#photography");
const djServiceInput = document.querySelector("#dj-service");
const lightingInput = document.querySelector("#lighting");

// COST DISPLAY ELEMENTS
const venueCostDisplay = document.querySelector("#venue-cost");
const cateringCostDisplay = document.querySelector("#catering-cost");
const decorationCostDisplay = document.querySelector("#decoration-cost");
const seatingCostDisplay = document.querySelector("#seating-cost");
const servicesCostDisplay = document.querySelector("#services-cost");
const totalCostDisplay = document.querySelector("#total-cost");
// PAYMENT MODAL ELEMENTS

const confirmBookingButton = document.querySelector("#confirm-booking-button");

const paymentModal = document.querySelector("#payment-modal");

const paymentCloseButton = document.querySelector("#payment-close");

const paymentVenue = document.querySelector("#payment-venue");

const paymentEventType = document.querySelector("#payment-event-type");

const paymentEventDate = document.querySelector("#payment-event-date");

const paymentGuests = document.querySelector("#payment-guests");

const paymentTotal = document.querySelector("#payment-total");
const paymentMethodButtons = document.querySelectorAll(".payment-method");

const payNowButton = document.querySelector("#pay-now-button");

const paymentDetailsContainer = document.querySelector("#payment-details");
// BOOKING SUCCESS ELEMENTS

const successModal = document.querySelector("#success-modal");

const bookingIdDisplay = document.querySelector("#booking-id");

const successVenue = document.querySelector("#success-venue");

const successEventType = document.querySelector("#success-event-type");

const successEventDate = document.querySelector("#success-event-date");

const successGuests = document.querySelector("#success-guests");

const successTotal = document.querySelector("#success-total");

const returnHomeButton = document.querySelector("#return-home-button");
 const savedEventType = sessionStorage.getItem("eventType");

if (savedEventType) {
    eventTypeInput.value = savedEventType;
}
const savedVenue = sessionStorage.getItem("selectedVenue");

if (savedVenue) {
    selectedVenueInput.value = savedVenue;
}
// CHANGE VENUE DIRECTLY FROM THE EVENT PLANNER

selectedVenueInput.addEventListener("change", function () {

    // SAVE THE NEW VENUE
    sessionStorage.setItem(
        "selectedVenue",
        selectedVenueInput.value
    );

    // UPDATE THE COST ESTIMATOR
    calculateEventCost();

    // UPDATE THE EVENT SUMMARY IF IT IS ALREADY VISIBLE
    summaryVenue.textContent = selectedVenueInput.value;

});
const eventDateInput = document.querySelector("#event-date");
const savedEventDate = sessionStorage.getItem("eventDate");

if (savedEventDate) {
    eventDateInput.value = savedEventDate;
}
eventDateInput.addEventListener("change", function () {
    sessionStorage.setItem("eventDate", eventDateInput.value);
});
eventTypeInput.addEventListener("change", function () {
    sessionStorage.setItem("eventType", eventTypeInput.value);
});
const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

eventDateInput.min = `${year}-${month}-${day}`;
// Store the elemenet that opened the modal
let previouslyFocusedElement = null;
let selectedVenue = null;
// Control background interaction

function setBackgroundInert(isInert) {

    Array.from(document.body.children).forEach(function (element) {

        if (element !== venueModal &&
            element.tagName !== "SCRIPT") {

            element.inert = isInert;

        }

    });

}
// Open the correct venue details

venueButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Find the venue card containing this button
        const card = button.closest(".venue-card");
        selectedVenue = card; 

        // Extract venue information
        const name = card.querySelector("h3").textContent;

        const description = card.querySelector(".venue-description").textContent.trim();

        const capacity = card.querySelector(".venue-details p").textContent.replace("Capacity:", "").trim();

        // Insert information into the modal
        modalTitle.textContent = name;

        modalDescription.textContent = description;

        modalCapacity.textContent = capacity;

// Get seating configurations
const configurations = card.querySelectorAll(
    ".venue-details ul li"
);


// Clear previous configurations
modalConfigurations.innerHTML = "";

// Add configurations to the modal
configurations.forEach(function (configuration) {

    const listItem = document.createElement("li");

    listItem.textContent = configuration.textContent;

    modalConfigurations.appendChild(listItem);

});
        // Display the modal
        // Remember which button opened the modal
previouslyFocusedElement = button;
setBackgroundInert(true);

// Make the modal available to screen readers
venueModal.setAttribute("aria-hidden", "false");

// Display the modal
venueModal.classList.add("active");

// Move keyboard focus to the close button
modalClose.focus();

    });

});
// PLAN THE SELECTED VENUE

planVenueButton.addEventListener("click", function () {

    if (!selectedVenue) {
        return;
    }

    const selectedVenueName =
        selectedVenue.querySelector("h3").textContent.trim();

    // SAVE THE SELECTED VENUE
    sessionStorage.setItem("selectedVenue", selectedVenueName);

    selectedVenueInput.value = selectedVenueName;

    // UPDATE THE COST ESTIMATOR
    calculateEventCost();

    // CLOSE THE MODAL
    modalClose.click();

    // SCROLL TO EVENT PLANNER
    document.querySelector("#estimator").scrollIntoView({
        behavior: "smooth"
    });

    console.log("Selected venue:", selectedVenueName);

});
// Close the venue modal
modalClose.addEventListener("click", function () {

    venueModal.classList.remove("active");
    setBackgroundInert(false);

    venueModal.setAttribute("aria-hidden", "true");

    if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
    }

});
// Close modal when clicking outside the popup

venueModal.addEventListener("click", function (event) {

    if (event.target === venueModal) {

        venueModal.classList.remove("active");
        setBackgroundInert(false);

        venueModal.setAttribute("aria-hidden", "true");

        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }

    }

});
// Close modal using Escape key

// Keyboard controls for the venue modal

document.addEventListener("keydown", function (event) {

    // Close modal using Escape
    if (event.key === "Escape" &&
        venueModal.classList.contains("active")) {

        venueModal.classList.remove("active");
        setBackgroundInert(false);
        venueModal.setAttribute("aria-hidden", "true");

        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }

        return;
    }

    // Trap keyboard focus inside the open modal
    if (event.key === "Tab" &&
        venueModal.classList.contains("active")) {

        const focusableElements = venueModal.querySelectorAll(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];

        const lastElement =
            focusableElements[focusableElements.length - 1];

        // Move focus forward
        if (!event.shiftKey &&
            document.activeElement === lastElement) {

            event.preventDefault();
            firstElement.focus();

        }

        // Move focus backward
        else if (event.shiftKey &&
            document.activeElement === firstElement) {

            event.preventDefault();
            lastElement.focus();

        }

    }

});
// Select all venue images

const venueImages = document.querySelectorAll(".venue-image img");
// Open venue details on double-clicking an image

venueImages.forEach(function (image) {

    image.addEventListener("dblclick", function () {

        const card = image.closest(".venue-card");

        const detailsButton = card.querySelector(".venue-button");

        detailsButton.click();

    });

});
eventPlannerForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (!selectedVenueInput.value.trim()) {
    alert("Please select a venue before continuing.");
    return;
}

// GET THE SELECTED EVENT TYPE
const selectedEventType =
    eventTypeInput.options[eventTypeInput.selectedIndex].textContent;

// GET THE SELECTED EVENT DATE
const selectedEventDate = new Date(
    eventDateInput.value + "T00:00:00"
).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
});

// INSERT DETAILS INTO THE SUMMARY
summaryVenue.textContent = selectedVenueInput.value;

summaryEventType.textContent = selectedEventType;

summaryEventDate.textContent = selectedEventDate;

// DISPLAY THE SUMMARY
document.querySelector("#event-summary").hidden = false;

// SCROLL TO THE SUMMARY
document.querySelector("#event-summary").scrollIntoView({
    behavior: "smooth"
});

});
editEventButton.addEventListener("click", function () {

// RESET PREVIOUS CONFIRMATION
confirmationMessage.hidden = true;

confirmEventButton.disabled = false;

confirmEventButton.textContent = "Confirm Event Details";
    // HIDE THE EVENT SUMMARY
    document.querySelector("#event-summary").hidden = true;

    // SCROLL BACK TO THE EVENT PLANNER
    document.querySelector("#estimator").scrollIntoView({
        behavior: "smooth"
    });

});
// CONFIRM EVENT DETAILS
confirmEventButton.addEventListener("click", function () {

    // SHOW THE CONFIRMATION MESSAGE
    confirmationMessage.hidden = false;

    // DISABLE THE BUTTON AFTER CONFIRMATION
    confirmEventButton.disabled = true;

    // UPDATE THE BUTTON TEXT
    confirmEventButton.textContent = "Details Confirmed";

});
// EVENT COST CALCULATION FUNCTION

function calculateEventCost() {

    // GET THE NUMBER OF GUESTS
    const guests = Number(guestCountInput.value) || 0;

    // GET THE CATERING PRICE PER GUEST
    const cateringPrice = Number(cateringPackageInput.value) || 0;

    // GET THE DECORATION PRICE
    const decorationPrice = Number(decorationPackageInput.value) || 0;

    // GET THE SEATING ARRANGEMENT PRICE
    const seatingPrice = Number(seatingArrangementInput.value) || 0;

  // CALCULATE VENUE RENTAL
let venueCost = 0;

if (selectedVenueInput.value.includes("Garden Pavilion")) {
    venueCost = 50000;
}
else if (selectedVenueInput.value.includes("Crystal Ballroom")) {
    venueCost = 75000;
}
else if (selectedVenueInput.value.includes("Royal Grand Hall")) {
    venueCost = 100000;
}
    // CALCULATE CATERING
    const cateringCost = guests * cateringPrice;

    // CALCULATE DECORATION
    const decorationCost = decorationPrice;

    // CALCULATE SEATING
    const seatingCost = seatingPrice;

    // CALCULATE ADDITIONAL SERVICES
    const photographyCost = photographyInput.checked ? Number(photographyInput.value) : 0;

    const djCost = djServiceInput.checked ? Number(djServiceInput.value) : 0;

    const lightingCost = lightingInput.checked ? Number(lightingInput.value) : 0;

    const servicesCost = photographyCost + djCost + lightingCost;

    // CALCULATE TOTAL COST
    const totalCost =
        venueCost +
        cateringCost +
        decorationCost +
        seatingCost +
        servicesCost;

    // DISPLAY COSTS
   // DISPLAY COSTS
venueCostDisplay.textContent = `₹${venueCost.toLocaleString("en-IN")}`;

cateringCostDisplay.textContent = `₹${cateringCost.toLocaleString("en-IN")}`;

decorationCostDisplay.textContent = `₹${decorationCost.toLocaleString("en-IN")}`;

seatingCostDisplay.textContent = `₹${seatingCost.toLocaleString("en-IN")}`;

servicesCostDisplay.textContent = `₹${servicesCost.toLocaleString("en-IN")}`;

totalCostDisplay.textContent = `₹${totalCost.toLocaleString("en-IN")}`;
}
// LIVE COST CALCULATIONS

guestCountInput.addEventListener("input", calculateEventCost);

cateringPackageInput.addEventListener("change", calculateEventCost);

decorationPackageInput.addEventListener("change", calculateEventCost);

seatingArrangementInput.addEventListener("change", calculateEventCost);

photographyInput.addEventListener("change", calculateEventCost);

djServiceInput.addEventListener("change", calculateEventCost);

lightingInput.addEventListener("change", calculateEventCost);
// OPEN PAYMENT MODAL

confirmBookingButton.addEventListener("click", function () {

    // CHECK REQUIRED DETAILS

    if (
        !selectedVenueInput.value ||
        !eventTypeInput.value ||
        !eventDateInput.value ||
        !guestCountInput.value ||
        !cateringPackageInput.value ||
        !decorationPackageInput.value ||
        !seatingArrangementInput.value
    ) {
        alert("Please complete all event details and cost estimation before confirming your booking.");
        return;
    }

    // UPDATE COST

    calculateEventCost();

    // DISPLAY BOOKING DETAILS

    paymentVenue.textContent = selectedVenueInput.value;

    paymentEventType.textContent =
        eventTypeInput.options[eventTypeInput.selectedIndex].textContent;

    paymentEventDate.textContent = new Date(
        eventDateInput.value + "T00:00:00"
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    paymentGuests.textContent = guestCountInput.value;

    paymentTotal.textContent = totalCostDisplay.textContent;

    // OPEN PAYMENT MODAL

    paymentModal.hidden = false;

});
// CLOSE PAYMENT MODAL

paymentCloseButton.addEventListener("click", function () {

    paymentModal.hidden = true;

});
// PAYMENT METHOD SELECTION

paymentMethodButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // REMOVE PREVIOUS SELECTION
        paymentMethodButtons.forEach(function (method) {
            method.classList.remove("selected");
        });

        // SELECT CURRENT METHOD
        button.classList.add("selected");

        // ENABLE PAYMENT BUTTON
        payNowButton.disabled = false;

        // GET SELECTED METHOD
        const selectedMethod = button.dataset.method;

        // DISPLAY PAYMENT DETAILS
        if (selectedMethod === "upi") {

            paymentDetailsContainer.innerHTML = `
                <h3>UPI Payment</h3>
                <p>Choose your preferred UPI application.</p>

                <div class="demo-payment-option">
                    <span>Google Pay</span>
                </div>

                <div class="demo-payment-option">
                    <span>PhonePe</span>
                </div>

                <div class="demo-payment-option">
                    <span>Paytm</span>
                </div>

                <p class="payment-placeholder">
                    Demo interface only. No actual payment will be processed.
                </p>
            `;

        }

        else if (selectedMethod === "netbanking") {

            paymentDetailsContainer.innerHTML = `
                <h3>Net Banking</h3>

                <label for="demo-bank">Select Your Bank</label>

                <select id="demo-bank">
                    <option value="">Choose your bank</option>
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Punjab National Bank</option>
                    <option>Axis Bank</option>
                </select>

                <p class="payment-placeholder">
                    Demo bank selection. No bank login is required.
                </p>
            `;

        }

        else if (selectedMethod === "card") {

            paymentDetailsContainer.innerHTML = `
                <h3>Card Payment</h3>

                <p>
                    Card payments are simulated for this demonstration.
                </p>

                <div class="demo-payment-option">
                    <span>Debit Card</span>
                </div>

                <div class="demo-payment-option">
                    <span>Credit Card</span>
                </div>

                <p class="payment-placeholder">
                    No real card details are required.
                </p>
            `;

        }

    });

});
// PAYMENT SIMULATION

payNowButton.addEventListener("click", function () {

    // PREVENT MULTIPLE CLICKS
    payNowButton.disabled = true;

    payNowButton.textContent = "Processing Payment...";

    // SIMULATE PAYMENT PROCESSING

    setTimeout(function () {

        // GENERATE BOOKING ID
        const bookingId = "BANQ-" + Math.floor(100000 + Math.random() * 900000);

        bookingIdDisplay.textContent = bookingId;

        // DISPLAY BOOKING DETAILS

        successVenue.textContent = selectedVenueInput.value;

        successEventType.textContent =
            eventTypeInput.options[eventTypeInput.selectedIndex].textContent;

        successEventDate.textContent = new Date(
            eventDateInput.value + "T00:00:00"
        ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        successGuests.textContent = guestCountInput.value;

        successTotal.textContent = totalCostDisplay.textContent;

        // CLOSE PAYMENT MODAL
        paymentModal.hidden = true;

        // OPEN SUCCESS MODAL
        successModal.hidden = false;

        // RESET PAYMENT BUTTON
        payNowButton.disabled = false;

        payNowButton.textContent = "Proceed to Payment";

    }, 2000);

});
// RETURN TO WEBSITE

returnHomeButton.addEventListener("click", function () {

    successModal.hidden = true;

    document.querySelector("#home").scrollIntoView({
        behavior: "smooth"
    });

});
// SCROLL REVEAL ANIMATION

const revealElements = document.querySelectorAll(
    ".section-heading, .venue-card, .estimator-container"
);

revealElements.forEach(function (element) {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(function (entries) {

    entries.forEach(function (entry) {

        if (entry.isIntersecting) {

            entry.target.classList.add("active");

            revealObserver.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.15
});

revealElements.forEach(function (element) {
    revealObserver.observe(element);
});
// =========================================
// AVAILABILITY CHECKER
// =========================================

const availabilityForm =
    document.querySelector("#availability-form");

const availabilityVenue =
    document.querySelector("#availability-venue");

const availabilityDate =
    document.querySelector("#availability-date");

const availabilityResult =
    document.querySelector("#availability-result");


// PREVENT PAST DATES

availabilityDate.min = eventDateInput.min;


// CHECK AVAILABILITY

availabilityForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const venue = availabilityVenue.value;

    const date = availabilityDate.value;

    const formattedDate = new Date(
        date + "T00:00:00"
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    availabilityResult.hidden = false;

    availabilityResult.innerHTML = `
        <strong>Availability Check</strong>

        <p>
            Venue: ${venue}
        </p>

        <p>
            Event Date: ${formattedDate}
        </p>

        <p>
            <strong>Demo Status:</strong>
            Your selected date appears available in our demonstration.
        </p>

        <p>
            Please contact BANQORA to confirm actual availability.
        </p>
    `;

});