// Background Matrix Effect
function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*<>';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array.from({length: columns}).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00FF7F';
        ctx.font = fontSize + 'px "JetBrains Mono"';

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(draw, 35);
}

// Main Flow Controller
document.addEventListener('DOMContentLoaded', () => {
    initMatrix();

    // DOM Elements
    const btnUnlock = document.getElementById('btn-unlock');
    
    // Stages
    const stageIntro = document.getElementById('stage-intro');
    const introContent = document.getElementById('intro-content');
    const introTerminal = document.getElementById('intro-terminal');
    const stageNetwork = document.getElementById('stage-network');
    const stageSignal = document.getElementById('stage-signal');
    const stageAccess = document.getElementById('stage-access');
    const stageLogin = document.getElementById('stage-login');
    const stageDashboard = document.getElementById('stage-dashboard');
    
    // Utilities
    function switchStage(hideEl, showEl) {
        hideEl.classList.remove('active');
        hideEl.classList.add('hidden');
        showEl.classList.remove('hidden');
        setTimeout(() => showEl.classList.add('active'), 50);
    }

    function addTerminalLine(container, text, delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                const p = document.createElement('p');
                p.innerHTML = text;
                container.appendChild(p);
                container.scrollTop = container.scrollHeight;
                resolve();
            }, delay);
        });
    }

    /* --- STAGE 1: INTRO --- */
    btnUnlock.addEventListener('click', async () => {
        // Enforce Fullscreen
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                await document.documentElement.webkitRequestFullscreen();
            }
        } catch (e) { console.log("FS blocked"); }

        btnUnlock.style.display = 'none';
        introContent.classList.remove('hidden');
        
        runIntroSequence();
    });

    async function runIntroSequence() {
        const sequence = [
            { text: "> loading security modules", delay: 800 },
            { text: "> activating defense protocols", delay: 900 },
            { text: "> checking network environment", delay: 800 }
        ];

        for (const step of sequence) {
            await addTerminalLine(introTerminal, step.text, step.delay);
        }

        setTimeout(() => {
            switchStage(stageIntro, stageNetwork);
            runNetworkSequence();
        }, 1200);
    }

    /* --- STAGE 2: NETWORK VALIDATION --- */
    async function runNetworkSequence() {
        const terminalBox = document.querySelector('.terminal-box');
        const sequence = [
            { text: "> Detected Network: <br><span class='text-blue'>Nikith_Event_Hotspot</span>", delay: 1000 },
            { text: "> Verifying security signature...", delay: 800 },
            { text: "<span class='text-green'>✓ Trusted Network Detected</span>", delay: 600 },
            { text: "<span class='text-green'>✓ Authorized Access Point</span>", delay: 500 },
            { text: "<br>> Scanning connected devices...", delay: 1200 },
            { text: "<span class='text-yellow'>192.168.137.8   → Raspberry Pi (Node)</span>", delay: 600 },
            { text: "<span class='text-yellow'>192.168.137.59  → Laptop (Client)</span>", delay: 600 },
            { text: "<span class='text-green mb-20'>✓ Network Verified</span>", delay: 1000 },
            { text: "> Proceeding to Signal Check...", delay: 800 }
        ];

        for (const step of sequence) {
            await addTerminalLine(terminalBox, step.text, step.delay);
        }

        setTimeout(() => {
            switchStage(stageNetwork, stageSignal);
            runSignalCheck();
        }, 1000);
    }

    /* --- STAGE 3: SIGNAL CHECK --- */
    function runSignalCheck() {
        setTimeout(() => { document.querySelector('.stage.active .delay-1').classList.remove('hidden'); }, 1000);
        setTimeout(() => { document.querySelector('.stage.active .delay-2').classList.remove('hidden'); }, 2000);
        setTimeout(() => { document.querySelector('.stage.active .delay-3').classList.remove('hidden'); }, 3000);
        setTimeout(() => { document.querySelector('.stage.active .delay-4').classList.remove('hidden'); }, 4500);

        setTimeout(() => {
            switchStage(stageSignal, stageAccess);
        }, 6000);
    }

    /* --- STAGE 4: ACCESS PANEL --- */
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchStage(stageAccess, stageLogin);
            document.getElementById('sys-username').focus();
        });
    });

    /* --- STAGE 5: LOGIN --- */
    const sysUsername = document.getElementById('sys-username');
    const sysPassword = document.getElementById('sys-password');
    const btnLogin = document.getElementById('btn-login');

    const attemptLogin = () => {
        const user = sysUsername.value.trim().toLowerCase();
        const pass = sysPassword.value;

        if (user === 'nikith' && pass === '123456') {
            showPopup('success', '✓ AUTHENTICATION SUCCESSFUL', 'Welcome Commander<br>Loading Dashboard...');
            setTimeout(() => {
                document.getElementById('popup-container').classList.add('hidden');
                switchStage(stageLogin, stageDashboard);
                document.getElementById('cmd-input').focus();
            }, 2500);
        } else {
            showPopup('error', '⚠ ACCESS DENIED', 'Invalid Credentials Submitted.<br>Intrusion logged.');
            sysPassword.value = '';
        }
    };

    btnLogin.addEventListener('click', attemptLogin);
    sysPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') attemptLogin();
    });

    /* --- STAGE 6: DASHBOARD CONSOLE MOCK --- */
    const cmdInput = document.getElementById('cmd-input');
    const consoleBox = document.getElementById('command-console');
    
    cmdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const val = cmdInput.value.trim();
            if (val.length > 0) {
                // Echo command
                const p = document.createElement('p');
                p.innerHTML = `<span class="text-blue">> ${val}</span>`;
                consoleBox.insertBefore(p, cmdInput.parentElement);
                
                // Mock execution delay
                setTimeout(() => {
                    const resp = document.createElement('p');
                    resp.innerHTML = `> execute: [${val}] : COMMAND NOT RECOGNIZED IN MOCK MODE.`;
                    resp.className = 'text-yellow';
                    consoleBox.insertBefore(resp, cmdInput.parentElement);
                    consoleBox.scrollTop = consoleBox.scrollHeight;
                }, 500);
            }
            cmdInput.value = '';
        }
    });

    /* --- POPUP COMPONENT --- */
    const popupContent = document.getElementById('popup-content');
    const popupContainer = document.getElementById('popup-container');

    function showPopup(type, title, message) {
        popupContent.className = 'popup-box ' + type;
        popupContent.innerHTML = `
            <h2>${title}</h2>
            <p>${message}</p>
        `;
        popupContainer.classList.remove('hidden');
        
        if (type === 'error') {
            popupContainer.onclick = () => {
                popupContainer.classList.add('hidden');
                popupContainer.onclick = null;
            };
        }
    }
});
