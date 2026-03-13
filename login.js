document.addEventListener('DOMContentLoaded', () => {

    // --- STEP 1: FACIAL RECOGNITION (Mock Pi Camera) ---
    const step1Card = document.getElementById('step-1');
    const status1 = document.getElementById('status-1');
    const camStatus = document.getElementById('cam-status');
    const scanLine = document.querySelector('.scan-line');

    const startFaceRec = () => {
        status1.textContent = 'SCANNING...';
        status1.className = 'step-footer status-active';
        camStatus.textContent = 'ANALYZING FACIAL GEOMETRY...';
        scanLine.style.display = 'block';

        // Simulate 4 seconds of scanning, then success
        setTimeout(() => {
            scanLine.style.display = 'none';
            camStatus.textContent = 'MATCH: AUTHORIZED OP';
            camStatus.style.color = '#00ff00';
            status1.textContent = 'VERIFIED';
            status1.className = 'step-footer status-success';
            step1Card.style.borderColor = '#00ff00';
            
            // Trigger Step 2
            startPinEntry();
        }, 4000);
    };


    // --- STEP 2: HARDWARE PIN (Mock LCD Input) ---
    const step2Card = document.getElementById('step-2');
    const status2 = document.getElementById('status-2');
    const dots = document.querySelectorAll('.dot');

    const startPinEntry = () => {
        step2Card.classList.remove('disabled');
        status2.textContent = 'AWAITING KEYPAD...';
        status2.className = 'step-footer status-active';

        // Simulate a user typing a 4-digit PIN on the hardware keypad
        let filled = 0;
        const typePinInterval = setInterval(() => {
            if (filled < 4) {
                dots[filled].classList.add('filled');
                filled++;
            } else {
                clearInterval(typePinInterval);
                finishPinEntry();
            }
        }, 800); // 800ms between "keystrokes"
    };

    const finishPinEntry = () => {
        setTimeout(() => { // slight pause after 4th digit
            status2.textContent = 'VERIFIED';
            status2.className = 'step-footer status-success';
            step2Card.style.borderColor = '#00ff00';
            
            // Trigger Step 3
            unlockWebPassword();
        }, 600);
    };


    // --- STEP 3: WEB PASSWORD ---
    const step3Card = document.getElementById('step-3');
    const status3 = document.getElementById('status-3');
    const webPasswordInput = document.getElementById('web-password');
    const finalLoginBtn = document.getElementById('final-login-btn');
    const authError = document.getElementById('auth-error');
    const overlay = document.getElementById('access-granted');

    const unlockWebPassword = () => {
        step3Card.classList.remove('disabled');
        status3.textContent = 'INPUT REQUIRED';
        status3.className = 'step-footer status-active';
        webPasswordInput.disabled = false;
        finalLoginBtn.disabled = false;
        
        webPasswordInput.focus();
    };

    finalLoginBtn.addEventListener('click', () => {
        const pass = webPasswordInput.value;
        status3.textContent = 'AUTHENTICATING...';
        
        // Mock check (e.g. valid pass is 'admin123')
        setTimeout(() => {
            if (pass === 'admin123') {
                authError.classList.add('hidden');
                status3.textContent = 'ACCESS GRANTED';
                status3.className = 'step-footer status-success';
                step3Card.style.borderColor = '#00ff00';

                // Show Success Overlay
                setTimeout(() => {
                    overlay.classList.remove('hidden');
                }, 500);

            } else {
                authError.classList.remove('hidden');
                status3.textContent = 'INPUT REJECTED';
                status3.className = 'step-footer status-error';
                webPasswordInput.value = '';
                
                // Reset status to allow retry
                setTimeout(() => {
                    status3.textContent = 'INPUT REQUIRED';
                    status3.className = 'step-footer status-active';
                }, 1500);
            }
        }, 1000);
    });

    // START ENTIRE SEQUENCE
    setTimeout(startFaceRec, 1000); // Delay 1s after load before starting Step 1
});
