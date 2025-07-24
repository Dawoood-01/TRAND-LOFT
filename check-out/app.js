// Enhanced 3D Checkout Application - Fixed Version
class CheckoutApp {
    constructor() {
        this.currentStep = 1;
        this.data = null;
        this.formData = {
            address: {},
            payment: {},
            shipping: null
        };
        this.animationQueue = [];
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.initializeAnimations();
        this.populateSelects();
        this.populateShippingOptions();
        this.calculateTotals();
        this.initializeOrderSummary();
        
        // Trigger entrance animations
        setTimeout(() => this.playEntranceAnimations(), 100);
        
        // Set default shipping method
        setTimeout(() => {
            if (this.data.shippingOptions.length > 0) {
                this.selectShipping(this.data.shippingOptions[0]);
            }
        }, 500);
    }

    async loadData() {
        // Simulate loading application data
        this.data = {
            "sampleProducts": [
                {
                    "id": 1,
                    "name": "Wireless Bluetooth Headphones",
                    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
                    "price": 99.99,
                    "quantity": 1
                },
                {
                    "id": 2,
                    "name": "Premium Phone Case", 
                    "image": "https://images.unsplash.com/photo-1601593346740-925612772716?w=100&h=100&fit=crop",
                    "price": 29.99,
                    "quantity": 2
                }
            ],
            "shippingOptions": [
                {
                    "id": "standard",
                    "name": "Standard Shipping",
                    "price": 5.99,
                    "time": "5-7 business days"
                },
                {
                    "id": "express", 
                    "name": "Express Shipping",
                    "price": 15.99,
                    "time": "2-3 business days"
                }
            ],
            "taxRate": 0.08,
            "countries": [
                "United States", "Canada", "United Kingdom", "Australia", 
                "Germany", "France", "Japan"
            ],
            "states": [
                "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
                "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
                "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
                "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
                "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
                "New Hampshire", "New Jersey", "New Mexico", "New York", 
                "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
                "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
                "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
                "West Virginia", "Wisconsin", "Wyoming"
            ]
        };
    }

    setupEventListeners() {
        // Navigation buttons
        const nextBtn = document.getElementById('next-btn');
        const backBtn = document.getElementById('back-btn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextStep();
            });
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousStep();
            });
        }
        
        // Progress steps - Allow navigation to completed or current steps
        document.querySelectorAll('.progress-step').forEach(step => {
            step.addEventListener('click', (e) => {
                e.preventDefault();
                const stepNumber = parseInt(e.currentTarget.dataset.step);
                if (stepNumber <= this.currentStep) {
                    this.goToStep(stepNumber);
                }
            });
        });

        // Form validation
        this.setupFormValidation();
        
        // Payment methods
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectPaymentMethod(e.currentTarget.dataset.method);
            });
        });

        // Order summary toggle
        const summaryToggle = document.getElementById('summary-toggle');
        if (summaryToggle) {
            summaryToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleOrderSummary();
            });
        }

        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => this.formatCardNumber(e));
        }

        // Expiry date formatting
        const expiryInput = document.getElementById('expiry');
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => this.formatExpiryDate(e));
        }

        // CVV validation
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => this.formatCVV(e));
        }

        // Mobile FAB
        const mobileFab = document.getElementById('mobile-fab');
        if (mobileFab) {
            mobileFab.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMobileFabClick();
            });
        }

        // Responsive handling
        window.addEventListener('resize', () => this.handleResize());
        this.handleResize();
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearValidation(e.target));
            input.addEventListener('focus', (e) => this.animateFieldFocus(e.target));
        });
    }

    validateField(field) {
        const group = field.closest('.floating-label');
        if (!group) return true;
        
        const validation = group.querySelector('.form-validation');
        let isValid = true;
        let message = '';

        // Clear previous states
        group.classList.remove('error', 'success');

        // Skip validation if field is empty and not required
        if (!field.required && !field.value.trim()) {
            return true;
        }

        // Validation rules
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (field.value.trim() && !emailRegex.test(field.value)) {
                    isValid = false;
                    message = 'Please enter a valid email address';
                }
                break;
                
            case 'tel':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (field.value.trim() && !phoneRegex.test(field.value.replace(/\D/g, ''))) {
                    isValid = false;
                    message = 'Please enter a valid phone number';
                }
                break;
                
            default:
                if (field.required && !field.value.trim()) {
                    isValid = false;
                    message = 'This field is required';
                }
                break;
        }

        // Special validations
        if (field.id === 'cardNumber' && field.value.trim()) {
            const cardRegex = /^[\d\s]{13,19}$/;
            if (!cardRegex.test(field.value)) {
                isValid = false;
                message = 'Please enter a valid card number';
            }
        }

        if (field.id === 'expiry' && field.value.trim()) {
            const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!expiryRegex.test(field.value)) {
                isValid = false;
                message = 'Please enter MM/YY format';
            }
        }

        if (field.id === 'cvv' && field.value.trim()) {
            const cvvRegex = /^\d{3,4}$/;
            if (!cvvRegex.test(field.value)) {
                isValid = false;
                message = 'Please enter 3-4 digits';
            }
        }

        // Apply validation state
        if (!isValid) {
            group.classList.add('error');
            if (validation) {
                validation.textContent = message;
                validation.classList.add('error');
            }
            this.animateFieldError(field);
        } else if (field.value.trim()) {
            group.classList.add('success');
            if (validation) {
                validation.textContent = '✓ Looks good!';
                validation.classList.add('success');
            }
            this.animateFieldSuccess(field);
        }

        return isValid;
    }

    clearValidation(field) {
        const group = field.closest('.floating-label');
        if (!group) return;
        
        const validation = group.querySelector('.form-validation');
        
        group.classList.remove('error', 'success');
        if (validation) {
            validation.classList.remove('error', 'success');
            validation.textContent = '';
        }
    }

    animateFieldFocus(field) {
        const group = field.closest('.floating-label');
        if (!group) return;
        
        group.style.transform = 'translateZ(8px) scale(1.02)';
        
        setTimeout(() => {
            group.style.transform = '';
        }, 300);
    }

    animateFieldError(field) {
        const group = field.closest('.floating-label');
        if (!group) return;
        
        group.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            group.style.animation = '';
        }, 500);
    }

    animateFieldSuccess(field) {
        const group = field.closest('.floating-label');
        if (!group) return;
        
        group.style.transform = 'translateZ(5px) scale(1.01)';
        
        setTimeout(() => {
            group.style.transform = '';
        }, 200);
    }

    nextStep() {
        if (this.currentStep < 3) {
            if (this.validateCurrentStep()) {
                this.goToStep(this.currentStep + 1);
            }
        } else {
            this.completeOrder();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.goToStep(this.currentStep - 1);
        }
    }

    goToStep(step) {
        const sections = document.querySelectorAll('.checkout-section');
        const progressSteps = document.querySelectorAll('.progress-step');
        const progressLines = document.querySelectorAll('.progress-line');
        const nextBtn = document.getElementById('next-btn');
        const backBtn = document.getElementById('back-btn');

        // Animate out current section
        const currentSection = document.querySelector('.checkout-section.active');
        if (currentSection) {
            this.animateOut(currentSection);
        }

        // Update step
        setTimeout(() => {
            this.currentStep = step;

            // Update sections
            sections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(`${this.getStepName(step)}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
                this.animateIn(targetSection);
            }

            // Update progress
            progressSteps.forEach((progressStep, index) => {
                progressStep.classList.remove('active', 'completed');
                if (index + 1 < step) {
                    progressStep.classList.add('completed');
                } else if (index + 1 === step) {
                    progressStep.classList.add('active');
                }
            });

            // Update progress lines
            progressLines.forEach((line, index) => {
                line.classList.remove('completed');
                if (index + 1 < step) {
                    line.classList.add('completed');
                }
            });

            // Update buttons
            if (backBtn) {
                backBtn.classList.toggle('hidden', step === 1);
            }
            
            if (nextBtn) {
                if (step === 3) {
                    nextBtn.innerHTML = '<span>Complete Order</span><div class="btn-loading hidden"><div class="spinner"></div></div>';
                } else {
                    nextBtn.innerHTML = `<span>Continue to ${this.getNextStepName(step)} →</span><div class="btn-loading hidden"><div class="spinner"></div></div>`;
                }
            }

            // Update review content
            if (step === 3) {
                this.updateReviewContent();
            }

        }, 150);
    }

    getStepName(step) {
        const names = ['', 'address', 'payment', 'review'];
        return names[step];
    }

    getNextStepName(step) {
        const names = ['', '', 'Payment', 'Review'];
        return names[step + 1] || 'Complete';
    }

    validateCurrentStep() {
        let isValid = true;
        
        if (this.currentStep === 1) {
            // Validate address form
            const currentSection = document.querySelector('#address-section');
            const inputs = currentSection.querySelectorAll('.form-control[required]');
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            // Check shipping selection
            if (!this.formData.shipping) {
                isValid = false;
                this.showNotification('Please select a shipping method', 'error');
            }
        }

        if (this.currentStep === 2) {
            // Validate payment form
            const activePaymentMethod = document.querySelector('.payment-method.active');
            if (!activePaymentMethod) {
                isValid = false;
                this.showNotification('Please select a payment method', 'error');
                return false;
            }

            // Validate payment fields based on selected method
            if (this.formData.payment.method === 'card') {
                const paymentSection = document.querySelector('#payment-section');
                const inputs = paymentSection.querySelectorAll('#card-payment .form-control[required]');
                
                inputs.forEach(input => {
                    if (!this.validateField(input)) {
                        isValid = false;
                    }
                });
            }
        }

        return isValid;
    }

    animateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(30px) rotateY(10deg)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateX(0) rotateY(0)';
        }, 50);
    }

    animateOut(element) {
        element.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px) rotateY(-10deg)';
    }

    selectPaymentMethod(method) {
        // Update active state with 3D flip animation
        document.querySelectorAll('.payment-method').forEach(pm => {
            pm.classList.remove('active');
            pm.style.transform = 'translateZ(5px) perspective(400px) rotateX(5deg)';
        });
        
        const selectedMethod = document.querySelector(`[data-method="${method}"]`);
        selectedMethod.classList.add('active');
        
        // 3D flip animation
        selectedMethod.style.transform = 'translateZ(15px) perspective(400px) rotateX(0deg) rotateY(360deg)';
        
        setTimeout(() => {
            selectedMethod.style.transform = 'translateZ(15px) perspective(400px) rotateX(0deg)';
        }, 600);

        // Show/hide payment content
        document.querySelectorAll('.payment-content').forEach(content => content.classList.add('hidden'));
        const targetContent = document.getElementById(`${method}-payment`);
        if (targetContent) {
            targetContent.classList.remove('hidden');
            this.animateIn(targetContent);
        }

        this.formData.payment.method = method;
    }

    formatCardNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
    }

    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }

    formatCVV(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    }

    populateSelects() {
        const countrySelect = document.getElementById('country');
        const stateSelect = document.getElementById('state');

        if (countrySelect) {
            // Populate countries
            this.data.countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });
        }

        if (stateSelect) {
            // Populate states
            this.data.states.forEach(state => {
                const option = document.createElement('option');
                option.value = state;
                option.textContent = state;
                stateSelect.appendChild(option);
            });
        }
    }

    populateShippingOptions() {
        const shippingContainer = document.getElementById('shipping-options');
        if (!shippingContainer) return;
        
        this.data.shippingOptions.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'shipping-option';
            optionElement.dataset.shippingId = option.id;
            optionElement.innerHTML = `
                <div class="option-header">
                    <div class="option-name">${option.name}</div>
                    <div class="option-price">$${option.price.toFixed(2)}</div>
                </div>
                <div class="option-time">${option.time}</div>
            `;

            // Add click event with proper 3D animation
            optionElement.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectShipping(option);
            });
            
            optionElement.style.cursor = 'pointer';
            shippingContainer.appendChild(optionElement);

            // Add staggered animation
            setTimeout(() => {
                optionElement.style.animation = `staggerIn 0.6s ${index * 0.1}s both`;
            }, 100);
        });
    }

    selectShipping(option) {
        // Remove selection from all options
        document.querySelectorAll('.shipping-option').forEach(opt => {
            opt.classList.remove('selected');
            opt.style.transform = 'translateZ(5px)';
        });
        
        // Select the clicked option with 3D animation
        const selectedOption = document.querySelector(`[data-shipping-id="${option.id}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
            
            // 3D selection animation
            selectedOption.style.transform = 'translateZ(15px) scale(1.05) rotateY(5deg)';
            
            setTimeout(() => {
                selectedOption.style.transform = 'translateZ(10px)';
            }, 300);
        }
        
        this.formData.shipping = option;
        this.calculateTotals();
    }

    calculateTotals() {
        const subtotal = this.data.sampleProducts.reduce((sum, product) => 
            sum + (product.price * product.quantity), 0);
        
        const shippingCost = this.formData.shipping ? this.formData.shipping.price : 0;
        const taxAmount = (subtotal + shippingCost) * this.data.taxRate;
        const total = subtotal + shippingCost + taxAmount;

        // Update display with animation
        this.animateValueUpdate('subtotal', subtotal);
        this.animateValueUpdate('shipping-cost', shippingCost);
        this.animateValueUpdate('tax-amount', taxAmount);
        this.animateValueUpdate('final-total', total);
    }

    animateValueUpdate(elementId, value) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const formattedValue = `$${value.toFixed(2)}`;
        
        if (element.textContent !== formattedValue) {
            element.style.transform = 'scale(1.1)';
            element.style.color = 'var(--color-primary)';
            
            setTimeout(() => {
                element.textContent = formattedValue;
                element.style.transform = '';
                element.style.color = '';
            }, 150);
        }
    }

    initializeOrderSummary() {
        const orderItemsContainer = document.getElementById('order-items');
        if (!orderItemsContainer) return;
        
        this.data.sampleProducts.forEach((product, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="item-image">
                <div class="item-details">
                    <div class="item-name">${product.name}</div>
                    <div class="item-price">$${product.price.toFixed(2)} × ${product.quantity}</div>
                </div>
            `;
            
            orderItemsContainer.appendChild(itemElement);
            
            // Add staggered animation
            setTimeout(() => {
                itemElement.style.animation = `staggerIn 0.6s ${index * 0.1}s both`;
            }, 200);
        });
    }

    toggleOrderSummary() {
        const summaryContent = document.getElementById('summary-content');
        const summaryToggle = document.getElementById('summary-toggle');
        
        if (!summaryContent || !summaryToggle) return;
        
        const toggleText = summaryToggle.querySelector('.toggle-text');
        
        summaryContent.classList.toggle('expanded');
        summaryToggle.classList.toggle('expanded');
        
        if (summaryContent.classList.contains('expanded')) {
            if (toggleText) toggleText.textContent = 'Hide';
        } else {
            if (toggleText) toggleText.textContent = 'Show';
        }
    }

    updateReviewContent() {
        // Update address review
        const addressReview = document.getElementById('review-address-content');
        if (addressReview) {
            const firstName = document.getElementById('firstName')?.value || '';
            const lastName = document.getElementById('lastName')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const phone = document.getElementById('phone')?.value || '';
            const address = document.getElementById('address')?.value || '';
            const city = document.getElementById('city')?.value || '';
            const state = document.getElementById('state')?.value || '';
            const zipCode = document.getElementById('zipCode')?.value || '';
            const country = document.getElementById('country')?.value || '';
            
            addressReview.innerHTML = `
                <p><strong>${firstName} ${lastName}</strong></p>
                <p>${address}</p>
                <p>${city}, ${state} ${zipCode}</p>
                <p>${country}</p>
                <p>Email: ${email}</p>
                <p>Phone: ${phone}</p>
            `;
        }

        // Update payment review
        const paymentReview = document.getElementById('review-payment-content');
        if (paymentReview) {
            const activeMethod = document.querySelector('.payment-method.active');
            const methodName = activeMethod ? activeMethod.textContent.trim() : 'Not selected';
            
            let paymentDetails = `<p><strong>${methodName}</strong></p>`;
            
            if (this.formData.payment.method === 'card') {
                const cardNumber = document.getElementById('cardNumber')?.value || '';
                if (cardNumber) {
                    const maskedCard = '•••• •••• •••• ' + cardNumber.slice(-4);
                    paymentDetails += `<p>${maskedCard}</p>`;
                }
            }
            
            paymentReview.innerHTML = paymentDetails;
        }
    }

    completeOrder() {
        const nextBtn = document.getElementById('next-btn');
        if (!nextBtn) return;
        
        const loadingSpinner = nextBtn.querySelector('.btn-loading');
        const btnText = nextBtn.querySelector('span');
        
        // Show loading state
        if (btnText) btnText.style.opacity = '0.5';
        if (loadingSpinner) loadingSpinner.classList.remove('hidden');
        nextBtn.disabled = true;
        
        // Simulate order processing
        setTimeout(() => {
            this.showSuccessModal();
            
            // Reset button state
            if (btnText) btnText.style.opacity = '';
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
            nextBtn.disabled = false;
        }, 2000);
    }

    showSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (!modal) return;
        
        modal.classList.remove('hidden');
        
        // Trigger checkmark animation
        setTimeout(() => {
            const checkmark = modal.querySelector('.checkmark');
            if (checkmark) {
                checkmark.style.animation = 'fadeInUp 0.6s ease-out';
            }
        }, 300);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            z-index: 1001;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            padding: var(--space-16);
            box-shadow: var(--shadow-lg);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
        
        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            });
        }
    }

    handleMobileFabClick() {
        if (this.currentStep < 3) {
            this.nextStep();
        } else {
            this.completeOrder();
        }
    }

    handleResize() {
        const fab = document.getElementById('mobile-fab');
        if (!fab) return;
        
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            fab.classList.remove('hidden');
        } else {
            fab.classList.add('hidden');
        }
    }

    playEntranceAnimations() {
        // Stagger section animations
        const sections = document.querySelectorAll('.checkout-section, .order-summary');
        sections.forEach((section, index) => {
            section.style.animation = `fadeInUp 0.8s ${index * 0.2}s both`;
        });
        
        // Form field animations
        setTimeout(() => {
            const formGroups = document.querySelectorAll('.floating-label');
            formGroups.forEach((group, index) => {
                group.style.animation = `staggerIn 0.6s ${index * 0.05}s both`;
            });
        }, 400);
    }

    initializeAnimations() {
        // Add CSS for dynamic animations
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                animation: slideInRight 0.3s ease-out;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .checkout-section.entering {
                animation: fadeInUp 0.6s ease-out;
            }
            
            .checkout-section.leaving {
                animation: fadeOutLeft 0.4s ease-in;
            }
            
            @keyframes fadeOutLeft {
                to {
                    opacity: 0;
                    transform: translateX(-30px) rotateY(-10deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutApp();
});

// Enhanced smooth scrolling for better UX
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Performance optimization for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.checkout-section, .order-item, .shipping-option');
    animatedElements.forEach(el => observer.observe(el));
});