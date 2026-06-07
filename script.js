document.addEventListener('DOMContentLoaded', () => {
    // 0. Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (themeToggle) {
        // Check for saved theme
        if (localStorage.getItem('theme') === 'light-mode') {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light-mode' : 'dark-mode');
            themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // 1. Loader
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader-wrapper');
        if (loader) loader.style.display = 'none';
    });

    // 2. Typing Effect
    const typingText = document.querySelector('.typing-text');
    const roles = ['Computer Engineer', 'Web Developer', 'Network Enthusiast', 'Technology Explorer', 'Lifelong Learner'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 200;
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    if (typingText) type();

    // 3. Sticky Navbar & Active Links
    const nav = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Only apply section-based active link logic if on the index page
            const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
            if (isIndex) {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (window.scrollY >= sectionTop - nav.offsetHeight - 20) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${current}`) {
                        a.classList.add('active');
                    }
                });
            }
        });
    }

    // 4. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }

    // 5. Reveal Animation
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 7. Hero Canvas Particles
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const geometry = new THREE.BufferGeometry();
        const count = 1000;
        const positions = new Float32Array(count * 3);
        for(let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 10;
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({ size: 0.015, color: 0x00d2ff, transparent: true, opacity: 0.4 });
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        camera.position.z = 3;

        function animate() {
            requestAnimationFrame(animate);
            points.rotation.y += 0.0015; // Slightly faster for a "data flow" feel
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Contact Form Logic
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const button = contactForm.querySelector('button');
            const originalText = button.textContent;
            
            button.disabled = true;
            button.textContent = 'Sending...';

            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                alert('Thank you! Your message has been sent directly to Syukie.');
                contactForm.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    alert(data.errors.map(error => error.message).join(", "));
                } else {
                    alert('Oops! There was a problem. Ensure you replaced YOUR_FORM_ID in Index.html and verified your email with Formspree.');
                }
            }
            button.disabled = false;
            button.textContent = originalText;
        });
    }

    // 7.5 Skills Radar Chart
    const ctx = document.getElementById('skillsRadar');
    if (ctx) {
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Software Dev', 'Networking', 'Cybersecurity', 'Electronics', 'Mathematics', 'Hardware'],
                datasets: [{
                    label: 'Proficiency',
                    data: [90, 85, 80, 75, 88, 82],
                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                    borderColor: '#2563eb',
                    pointBackgroundColor: '#00d2ff',
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#64748b', font: { family: 'Space Grotesk' } },
                        ticks: { display: false },
                        suggestedMin: 50
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // 8. PDF Generation (Auto-generate Resume from Portfolio content)
    const downloadBtn = document.getElementById('download-cv');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const element = document.createElement('div');
            element.style.width = '210mm';
            element.style.display = 'flex';
            element.style.fontFamily = "'Inter', 'Space Grotesk', sans-serif";
            element.style.backgroundColor = '#0f172a';

            element.innerHTML = `
                <!-- Sidebar -->
                <div style="width: 38%; background: #0f172a; color: #f1f5f9; padding: 40px 20px; min-height: 297mm; border-right: 1px solid rgba(255,255,255,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="https://avatars.githubusercontent.com/u/249472822?s=400&u=85bd22071841e054145999e1d6b035766eaade80&v=4" 
                             style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid #2563eb; object-fit: cover; margin-bottom: 15px;">
                        <h2 style="font-size: 18px; margin: 0; color: #2563eb; font-family: 'Space Grotesk';">SYUK</h2>
                    </div>
                    
                    <h3 style="border-bottom: 1px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #00d2ff;">Personal Info</h3>
                    <div style="font-size: 9px; margin-bottom: 25px; line-height: 1.8;">
                        <p><span style="color: #2563eb; font-weight: bold;">Birth Date:</span> July 05, 2004</p>
                        <p><span style="color: #2563eb; font-weight: bold;">Birthplace:</span> Tudaya, Sta. Cruz, Davao del Sur</p>
                        <p><span style="color: #2563eb; font-weight: bold;">Religion:</span> Davao Apo Sandawa Sarili Langis</p>
                        <p><span style="color: #2563eb; font-weight: bold;">Blood Type:</span> AB+</p>
                        <p><span style="color: #2563eb; font-weight: bold;">Stats:</span> 5'6" / 52 kg</p>
                        <p><strong style="color: #2563eb;">Status:</strong> Single | Filipino</p>
                    </div>

                    <h3 style="border-bottom: 1px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #00d2ff;">Contact</h3>
                    <div style="font-size: 9px; margin-bottom: 25px; line-height: 1.8;">
                        <p>📞 09197130276</p>
                        <p>✉️ ayogsyukie@gmail.com</p>
                        <p>🌐 syukieaoda.vercel.app</p>
                        <p>📍 Davao City, PH</p>
                    </div>

                    <h3 style="border-bottom: 1px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #00d2ff;">Languages</h3>
                    <div style="font-size: 9px; margin-bottom: 25px; line-height: 1.6;">
                        <p>Bagobo Tagabawa, Cebuano,</p>
                        <p>English, Filipino</p>
                    </div>

                    <h3 style="border-bottom: 1px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #00d2ff;">Interests</h3>
                    <div style="font-size: 9px;">
                        <p>AI, Networking, Music Creator</p>
                    </div>
                </div>

                <!-- Main Content -->
                <div style="width: 62%; padding: 40px; background: #1e293b; color: #f1f5f9;">
                    <h1 style="margin: 0; font-size: 28px; color: #f1f5f9; font-family: 'Space Grotesk';">Syukie Ayog Oda</h1>
                    <h4 style="margin: 5px 0 30px 0; color: #00d2ff; font-weight: 400; letter-spacing: 1px; text-transform: uppercase; font-size: 12px;">Computer Engineer | Software Developer</h4>
                    
                    <div style="margin-bottom: 25px; background: rgba(255,255,255,0.03); padding: 15px; border-radius: 10px; border-left: 4px solid #2563eb;">
                        <h3 style="font-size: 13px; color: #2563eb; margin-top: 0; margin-bottom: 8px; text-transform: uppercase;">About Me</h3>
                        <p style="font-size: 9.5px; line-height: 1.6; margin: 0;">I am currently pursuing a degree in Computer Engineering and enjoy developing software applications and information systems. My interests include programming, web development, system design, database management, and emerging technologies. I am committed to learning new technologies, solving real-world problems, and building systems that can help organizations and communities improve their processes and services.</p>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <h3 style="font-size: 13px; color: #2563eb; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase;">Technical Skills</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 9px;">
                            <div>
                                <strong style="color: #00d2ff; display: block; margin-bottom: 3px;">Programming</strong>
                                Python, JavaScript, C++, PHP, HTML5, CSS3
                            </div>
                            <div>
                                <strong style="color: #00d2ff; display: block; margin-bottom: 3px;">Engineering</strong>
                                Networking, Cybersecurity, Embedded Systems, Linux
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <h3 style="font-size: 13px; color: #2563eb; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase;">Education</h3>
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 11px;">
                                <span style="color: #00d2ff;">Holy Cross of Davao College</span>
                                <span>2023 - 2028</span>
                            </div>
                            <p style="font-size: 9px; margin: 2px 0;">BS in Computer Engineering (BSCpE)</p>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 11px;">
                                <span style="color: #00d2ff;">Polytechnic College of Davao del Sur</span>
                                <span>2020 - 2022</span>
                            </div>
                            <p style="font-size: 9px; margin: 2px 0;">Senior High School</p>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 11px;">
                                <span style="color: #00d2ff;">Tudaya National High School</span>
                                <span>2016 - 2020</span>
                            </div>
                            <p style="font-size: 9px; margin: 2px 0;">Junior High School</p>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 11px;">
                                <span style="color: #00d2ff;">Tudaya Elementary School</span>
                                <span>2010 - 2016</span>
                            </div>
                            <p style="font-size: 9px; margin: 2px 0;">Elementary Graduate</p>
                        </div>
                    </div>

                    <div>
                        <h3 style="font-size: 13px; color: #2563eb; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase;">Experience</h3>
                        <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 11px;">
                            <span style="color: #00d2ff;">Freelance Tech & Dev</span>
                            <span>2023 - Present</span>
                        </div>
                        <p style="font-size: 9px; line-height: 1.5; margin-top: 5px;">Building responsive frontend projects, troubleshooting computer hardware, and exploring network configurations for local implementations.</p>
                    </div>
                </div>
            `;

            const opt = {
                margin: 0,
                filename: 'Resume_Syukie_Ayog_Oda.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save();
        });
    }

    // 9. AI Assistant Integration (Gemini)
    const aiChatHTML = `
        <div class="ai-chat-container">
            <div class="ai-chat-window" id="aiWindow">
                <div class="ai-chat-header">
                    <span>Syukie's AI Assistant</span>
                    <i class="fas fa-times" style="cursor:pointer" id="closeChat"></i>
                </div>
                <div class="ai-chat-messages" id="aiMessages">
                    <div class="ai-message bot">Kumusta! Ako ang AI assistant ni Syukie. May katanungan ka ba tungkol sa kanya?</div>
                </div>
                <form class="ai-chat-input" id="aiForm">
                    <input type="text" placeholder="Mag-tanong..." id="aiInput">
                    <button type="submit" style="background:none; border:none; color:var(--primary); cursor:pointer">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
            <div class="ai-chat-toggle" id="aiToggle">
                <i class="fas fa-robot"></i>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', aiChatHTML);

    const aiToggle = document.getElementById('aiToggle');
    const aiWindow = document.getElementById('aiWindow');
    const aiForm = document.getElementById('aiForm');
    const aiInput = document.getElementById('aiInput');
    const aiMessages = document.getElementById('aiMessages');
    const closeChat = document.getElementById('closeChat');

    aiToggle.addEventListener('click', () => aiWindow.classList.toggle('active'));
    closeChat.addEventListener('click', () => aiWindow.classList.remove('active'));

    async function sendMessage(message) {
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            const data = await res.json();

            if (!res.ok) {
                return "Error: " + (data.error || "Server error");
            }

            return data.reply;
        } catch (err) {
            console.error(err);
            return "Error connecting to AI server.";
        }
    }

    function appendMessage(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-message ${role}`;
        msgDiv.textContent = text;
        aiMessages.appendChild(msgDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    aiForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = aiInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        aiInput.value = '';

        // Show loading state
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'ai-message bot';
        loadingDiv.textContent = 'Typing...';
        aiMessages.appendChild(loadingDiv);

        const aiResponse = await sendMessage(text);
        
        // Remove loading and show response
        aiMessages.removeChild(loadingDiv);
        appendMessage('bot', aiResponse);
    });
});
