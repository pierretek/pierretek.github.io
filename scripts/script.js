// funny demo thing
const funnyDemoBtn = document.getElementById("funny-demo");
if (funnyDemoBtn) {
    funnyDemoBtn.addEventListener("click", function () {
        const original = this.textContent;
        this.textContent = "You're already here dummy";

        setTimeout(() => {
            this.textContent = original;
        }, 5000);
    });
}

// hide header on scroll down, show on scroll up
let lastScrollTop = 0;
const header = document.querySelector('.header');
const threshold = 50; // minimum scroll amount before hiding/showing

if (header) {
    window.addEventListener('scroll', function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(scrollTop - lastScrollTop) <= threshold) {
            return;
        }

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.classList.add('header-hidden');
        } else {
            // Scrolling up
            header.classList.remove('header-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
}

//table of contents thing
document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.page');
    const tocLinks = document.querySelectorAll('.toc-item a');
    const headerLinks = document.querySelectorAll('.nav-links a');

    const updateActiveLink = () => {
        const scrollPosition = window.scrollY;
        const sectionsArray = Array.from(sections);
        const offset = 200;

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const atBottom = scrollPosition >= maxScroll - offset;

        let activeIndex = 0;

        if (atBottom) {
            activeIndex = sectionsArray.length - 1;
        } else {
            sectionsArray.forEach((section, index) => {
                const sectionTopOffset = section.offsetTop - offset;
                if (scrollPosition >= sectionTopOffset) {
                    activeIndex = index;
                }
            });
        }

        const activeSection = sectionsArray[activeIndex];
        const sectionId = activeSection.getAttribute('id');

        tocLinks.forEach(link => {
            link.parentElement.classList.toggle(
                'active',
                link.getAttribute('href') === `#${sectionId}`
            );
        });

        headerLinks.forEach(link => {
            link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${sectionId}`
            );
        });
    };

    // Function for smooth scrolling to target element
    function smoothScrollToTarget(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 50;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    //update on scroll and load
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('load', updateActiveLink);

    //smooth scrolling for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollToTarget(targetId);
        });
    });

    //smooth scrolling for header links
    headerLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollToTarget(targetId);
        });
    });

    //showing the TOC 
    const toc = document.querySelector('.toc-container');
    if (toc) {
        toc.classList.add('toc-visible');
    }
});

//project opening/closing animations
function currentHeight(el) {
    const h = parseFloat(getComputedStyle(el).height);
    return (h && !isNaN(h)) ? h : el.scrollHeight;
}

document.querySelectorAll('details').forEach((details) => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.dtl-content');
    let isOpen = false;

    function openSection() {
        isOpen = true;
        details.setAttribute('open', '');
        content.classList.add('is-animating');        
        content.style.opacity = '0';
        content.style.marginTop = '0px';
        content.style.height = '0px';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                content.style.height = content.scrollHeight + 'px';
                content.style.opacity = '1';
                content.style.marginTop = '20px';
            });
        });
    }

    function closeSection() {
        isOpen = false;
        content.classList.add('is-animating');
        content.style.height = currentHeight(content) + 'px';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                content.style.height = '0px';
                content.style.opacity = '0';
                content.style.marginTop = '0px';
            });
        });
    }

    content.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'height') return;         
        if (isOpen) {
            content.style.height = 'auto';             
            content.classList.remove('is-animating');    
        } else {
            details.removeAttribute('open');
            content.classList.remove('is-animating');
            content.style.height = '';
            content.style.opacity = '';
            content.style.marginTop = '';
        }
    });

    summary.addEventListener('click', (e) => {
        e.preventDefault();                            
        isOpen ? closeSection() : openSection();
    });
});
