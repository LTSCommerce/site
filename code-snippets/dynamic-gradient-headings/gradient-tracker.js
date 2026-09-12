function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

function initializeDynamicGradients() {
    const dynamicGradientHandler = throttle((e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 135;

        document.documentElement.style.setProperty(
            '--gradient-angle',
            `${angle}deg`
        );
    }, 16);

    document.addEventListener('mousemove', dynamicGradientHandler);

    document.addEventListener('mouseleave', () => {
        document.documentElement.style.setProperty('--gradient-angle', '135deg');
    });
}
