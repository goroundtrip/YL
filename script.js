document.addEventListener('DOMContentLoaded', function() {
    // Waitlist Form Handler
    const waitlistForm = document.getElementById('waitlist-form');
    waitlistForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Waitlist form submitted');
        
        const formData = new FormData(waitlistForm);
        const data = Object.fromEntries(formData);
        console.log('Form data:', data);
        
        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (response.ok) {
                alert('Thank you for joining our waitlist! We will contact you soon.');
                waitlistForm.reset();
            } else {
                throw new Error(responseData.message || 'Network response was not ok');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your form. Please try again.');
        }
    });

    // Partnership Form Handler
    const partnershipForm = document.getElementById('partnership-form');
    partnershipForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Partnership form submitted');
        
        const formData = new FormData(partnershipForm);
        const data = Object.fromEntries(formData);
        console.log('Form data:', data);
        
        try {
            const response = await fetch('/api/partnership', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (response.ok) {
                alert('Thank you for your interest! We will contact you soon.');
                partnershipForm.reset();
            } else {
                throw new Error(responseData.message || 'Network response was not ok');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your form. Please try again.');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add animation to form containers
    const formContainers = document.querySelectorAll('.form-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    formContainers.forEach(container => {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(container);
    });
}); 