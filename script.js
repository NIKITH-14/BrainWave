/* script.js */

/**
 * UTILITY: Enforce fullscreen and detect exit
 */
function enterFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

document.addEventListener('fullscreenchange', handleFullScreenChange);
document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
document.addEventListener('mozfullscreenchange', handleFullScreenChange);
document.addEventListener('MSFullscreenChange', handleFullScreenChange);

function handleFullScreenChange() {
    // If not in full screen, show warning overlay (if it exists on the page)
    const warning = document.getElementById('fullscreen-warning');
    if (warning) {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            warning.classList.remove('hidden');
        } else {
            warning.classList.add('hidden');
        }
    }
}

function requestFullScreenAgain() {
    enterFullScreen();
}

/**
 * PAGE 1 LOGIC: Terminal Verification
 */
async function startVerificationProtocol() {
    document.getElementById('click-overlay').style.display = 'none';
    enterFullScreen();
    
    const terminal = document.getElementById('terminal-container');
    if (!terminal) return; // Not on page 1

    terminal.innerHTML = ''; // Clear blinking cursor
    
    const lines = [
        "INITIATING CONNECTION PROTOCOLS...",
        "CHECKING HARDWARE INTERFACES...",
        "[OK] RASPBERRY PI_1 (CAMERA) DETECTED [IP: 192.168.137.8]",
        "[OK] RASPBERRY PI_2 (LCD_KEYPAD) DETECTED [IP: 192.168.137.8]",
        "VERIFYING HOTSPOT IP ADDRESS...",
        "ANALYZING NETWORK TOPOLOGY...",
        "IP ADDRESS: 192.168.137.8 <span class='warning-text'>[VERIFYING...]</span>"
    ];

    for (let i = 0; i < lines.length; i++) {
        await sleep(500 + Math.random() * 800); // Random delay 0.5-1.3s
        appendTerminalLine(terminal, lines[i]);
    }

    await sleep(2000); // dramatic pause
    
    appendTerminalLine(terminal, "IP ADDRESS: 192.168.137.8 <span class='success-text'>[VERIFIED: SECURE NODE]</span>");
    
    await sleep(1000);
    appendTerminalLine(terminal, "HANDSHAKE COMPLETE. REDIRECTING TO SKYWATCH...");

    await sleep(1500);
    window.location.href = 'login.html'; // Redirect to page 2 (must be served in same origin/folder)
}

function appendTerminalLine(container, html) {
    const p = document.createElement('p');
    p.className = 'terminal-line';
    p.innerHTML = `> ${html}`;
    container.appendChild(p);
}


/**
 * PAGE 2 LOGIC: Hardware Simulation
 */
async function simulateHardwareValidation() {
    const step1 = document.getElementById('status-step-1');
    const step2 = document.getElementById('status-step-2');
    const step3 = document.getElementById('status-step-3');
    
    if (!step1 || !step2 || !step3) return; // Not on page 2

    // Simulate Step 1: Face Detection
    await sleep(1000);
    setStepActive(step1);
    await sleep(4000); // Takes 4 seconds to scan face
    setStepSuccess(step1, "[✓]", "FACE MATCHED: AUTHORIZED");

    // Simulate Step 2: LCD PIN
    await sleep(1000);
    setStepActive(step2);
    await sleep(5000); // Takes 5 seconds to type PIN
    setStepSuccess(step2, "[✓]", "PIN ACCEPTED");

    // Unlock Step 3: Web Form
    await sleep(1000);
    setStepActive(step3);
    const indicator = step3.querySelector('.indicator');
    indicator.textContent = "INPUT REQUIRED";
    
    // Enable Form
    const passwordInput = document.getElementById('password');
    const authButton = document.getElementById('auth-button');
    passwordInput.disabled = false;
    authButton.disabled = false;
    passwordInput.focus();
}

function setStepActive(element) {
    element.classList.remove('pending');
    element.classList.add('active');
    element.querySelector('.indicator').textContent = "SCANNING...";
}

function setStepSuccess(element, iconText, msg) {
    element.classList.remove('active');
    element.classList.add('success');
    element.querySelector('.icon').textContent = iconText;
    element.querySelector('.indicator').textContent = msg;
}

// Ensure fullscreen on login page load
document.addEventListener("DOMContentLoaded", () => {
    // If login body exists, we start the simulation
    if (document.getElementById('login-body')) {
        simulateHardwareValidation();

        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('auth-button');
            const passwordInput = document.getElementById('password');
            const passwordValue = passwordInput.value;
            
            btn.innerHTML = "AUTHENTICATING...";
            btn.disabled = true;
            passwordInput.disabled = true;
            
            setTimeout(() => {
                if (passwordValue === "SECRET") {
                    btn.innerHTML = "ACCESS GRANTED";
                    btn.style.backgroundColor = "var(--neon-green)";
                    btn.style.color = "#000";
                    
                    const step3 = document.getElementById('status-step-3');
                    setStepSuccess(step3, "[✓]", "FULL ACCESS GRANTED");
                } else {
                    btn.innerHTML = "ACCESS DENIED";
                    btn.style.borderColor = "red";
                    btn.style.color = "red";
                    
                    const step3 = document.getElementById('status-step-3');
                    step3.classList.remove('active');
                    step3.style.color = "red";
                    step3.querySelector('.indicator').textContent = "INVALID PASSWORD";
                    step3.querySelector('.indicator').style.color = "red";
                    step3.querySelector('.icon').textContent = "[X]";
                    
                    // Reset slightly after failure to allow retry
                    setTimeout(() => {
                        btn.innerHTML = "AUTHENTICATE";
                        btn.disabled = false;
                        btn.style.borderColor = "var(--neon-green)";
                        btn.style.color = "var(--neon-green)";
                        
                        passwordInput.disabled = false;
                        passwordInput.value = "";
                        passwordInput.focus();
                        
                        setStepActive(step3);
                        step3.style.color = ""; // reset to default active CSS
                        step3.querySelector('.indicator').textContent = "INPUT REQUIRED";
                        step3.querySelector('.indicator').style.color = "yellow";
                    }, 2000);
                }
            }, 2000);
        });
    }
});


/**
 * Helper Sleep Function
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
