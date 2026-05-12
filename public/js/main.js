// =====================
// MODAL (CREATE QR)
// =====================
function openModal() {
    document.getElementById("overlay").style.display = "flex";
}

function closeModal() {
    document.getElementById("overlay").style.display = "none";
}


// =====================
// QR SCANNER
// =====================
let html5QrCode = null;

function openScanner() {
    document.getElementById("scannerOverlay").style.display = "flex";

    html5QrCode = new Html5Qrcode("reader");

    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 }
    };

    html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
            window.location.href = decodedText;
            closeScanner();
        },
        () => {}
    ).catch((err) => {
        console.error("Scanner error:", err);
        alert("Camera access denied or not found.");
    });
}

function closeScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            document.getElementById("scannerOverlay").style.display = "none";
        });
    } else {
        document.getElementById("scannerOverlay").style.display = "none";
    }
}




// =====================
// INPUT VALIDATION
// =====================

// phone: only numbers, max 9 digits
const phoneInput = document.querySelector("input[name='phone']");
if (phoneInput) {
    phoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "").slice(0, 9);
    });
}

// item name: only English letters + spaces
const itemName = document.querySelector("input[name='item_name']");
if (itemName) {
    itemName.addEventListener("input", function () {
        this.value = this.value.replace(/[^A-Za-z\s]/g, "");
    });
}

// owner name: only English letters + spaces
const ownerName = document.querySelector("input[name='owner_name']");
if (ownerName) {
    ownerName.addEventListener("input", function () {
        this.value = this.value.replace(/[^A-Za-z\s]/g, "");
    });
}

// telegram: @ + allowed chars only
const telegram = document.querySelector("input[name='telegram']");
if (telegram) {
    telegram.addEventListener("input", function () {
        this.value = this.value.replace(/[^A-Za-z0-9_@]/g, "");

        if (this.value && this.value[0] !== "@") {
            this.value = "@" + this.value.replace("@", "");
        }
    });
}