document.addEventListener('DOMContentLoaded', () => {
    // 1. Boot up sequence logic
    const bootOverlay = document.getElementById('boot-overlay');
    
    setTimeout(() => {
        bootOverlay.classList.add('hidden');
    }, 2800); // Overlay disappears after animations

    // 2. Navigation Active State (Intersection Observer)
    const sections = document.querySelectorAll('.sys-section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to corresponding nav link
                const targetId = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // 3. Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if(targetEl) {
                window.scrollTo({
                    top: targetEl.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Live chart mockup simulation
    const chartContainer = document.getElementById('live-chart');
    if (chartContainer) {
        // Create 15 bars
        for (let i = 0; i < 15; i++) {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${20 + Math.random() * 80}%`;
            chartContainer.appendChild(bar);
        }

        // Randomly update bars to simulate live data
        setInterval(() => {
            const bars = chartContainer.querySelectorAll('.bar');
            const randomBar = bars[Math.floor(Math.random() * bars.length)];
            randomBar.style.height = `${20 + Math.random() * 80}%`;
        }, 800);
    }
});
