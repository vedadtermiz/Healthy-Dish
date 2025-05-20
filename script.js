// Timer functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    let isMenuOpen = false;

    mobileMenuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = isMenuOpen ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                isMenuOpen = false;
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !e.target.closest('nav')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            isMenuOpen = false;
        }
    });

    // Progress Tracker
    const progressSteps = document.querySelectorAll('.progress-step');
    let currentStep = 0;

    function updateProgress(step) {
        progressSteps.forEach((s, index) => {
            if (index <= step) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    }

    // Timer functionality
    const timerButtons = document.querySelectorAll('.timer-btn');
    
    timerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const time = parseInt(this.dataset.time);
            const step = this.closest('.step');
            const originalText = this.textContent;
            const timerDisplay = step.querySelector('.timer-display');
            
            // Disable all timer buttons while one is running
            timerButtons.forEach(btn => btn.disabled = true);
            
            let timeLeft = time;
            this.textContent = `${timeLeft} seconds`;
            timerDisplay.textContent = `${timeLeft}s`;
            
            const timer = setInterval(() => {
                timeLeft--;
                this.textContent = `${timeLeft} seconds`;
                timerDisplay.textContent = `${timeLeft}s`;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    this.textContent = originalText;
                    timerDisplay.textContent = '';
                    this.disabled = false;
                    timerButtons.forEach(btn => btn.disabled = false);
                    
                    // Add completion animation
                    step.style.backgroundColor = '#e8f5e9';
                    setTimeout(() => {
                        step.style.backgroundColor = '#f8f9fa';
                    }, 1000);

                    // Update progress
                    currentStep++;
                    updateProgress(currentStep);
                }
            }, 1000);
        });
    });

    // Ingredients Search with debounce
    const ingredientSearch = document.getElementById('ingredientSearch');
    const ingredients = document.querySelectorAll('#ingredients li');
    let searchTimeout;

    ingredientSearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            ingredients.forEach(ing => {
                const text = ing.textContent.toLowerCase();
                ing.style.display = text.includes(searchTerm) ? 'flex' : 'none';
            });
        }, 300);
    });

    // Step Tips with improved mobile interaction
    const tipButtons = document.querySelectorAll('.tip-btn');
    
    tipButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tipContent = button.nextElementSibling;
            const isActive = tipContent.classList.contains('active');
            
            // Close all other tips
            document.querySelectorAll('.tip-content.active').forEach(content => {
                if (content !== tipContent) {
                    content.classList.remove('active');
                }
            });
            
            tipContent.classList.toggle('active');
            
            // Scroll to tip content on mobile
            if (!isActive && window.innerWidth <= 768) {
                tipContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // Servings calculator with improved mobile UX
    const servingsInput = document.getElementById('servings');
    const servingsBtns = document.querySelectorAll('.servings-btn');
    const baseAmounts = {
        'ing1': 1, // quinoa
        'ing2': 2, // water
        'ing3': 200, // chicken/tofu
        'ing4': 1, // avocado
        'ing5': 1, // bell pepper
        'ing6': 2, // spinach
        'ing7': 2, // olive oil
        'ing8': 1, // lemon
        'ing9': 1  // salt and pepper
    };

    function updateIngredients() {
        const servings = parseInt(servingsInput.value);
        ingredients.forEach(ing => {
            const checkbox = ing.querySelector('input');
            const label = ing.querySelector('label');
            const baseAmount = baseAmounts[checkbox.id];
            const unit = label.textContent.split(' ')[1];
            const newAmount = baseAmount * servings;
            label.textContent = `${newAmount} ${unit}`;
        });
    }

    servingsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            let currentValue = parseInt(servingsInput.value);
            
            if (action === 'increase' && currentValue < 10) {
                servingsInput.value = currentValue + 1;
            } else if (action === 'decrease' && currentValue > 1) {
                servingsInput.value = currentValue - 1;
            }
            
            updateIngredients();
            showToast(`Servings updated to ${servingsInput.value}`);
        });
    });

    servingsInput.addEventListener('change', () => {
        let value = parseInt(servingsInput.value);
        if (value < 1) servingsInput.value = 1;
        if (value > 10) servingsInput.value = 10;
        updateIngredients();
        showToast(`Servings updated to ${servingsInput.value}`);
    });

    // Toast Notifications with improved mobile styling
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.querySelector('.toast-container').appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Save Recipe with improved mobile interaction
    const saveBtn = document.querySelector('.save-btn');
    saveBtn.addEventListener('click', () => {
        const isSaved = saveBtn.classList.toggle('saved');
        showToast(isSaved ? 'Recipe saved!' : 'Recipe unsaved');
        
        // Add haptic feedback for mobile devices
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });

    // Newsletter Form with improved validation
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && emailRegex.test(email)) {
            showToast('Thank you for subscribing!');
            newsletterForm.reset();
        } else {
            showToast('Please enter a valid email address', 'error');
        }
    });

    // Customization options with improved mobile interaction
    const customizationButtons = document.querySelectorAll('.apply-option');
    
    customizationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const option = this.dataset.option;
            const ingredients = document.querySelectorAll('#ingredients li');
            
            if (option === 'vegetarian') {
                ingredients.forEach(ing => {
                    const label = ing.querySelector('label');
                    if (label.textContent.includes('chicken')) {
                        label.textContent = label.textContent.replace('chicken breast', 'firm tofu');
                    }
                });
            } else if (option === 'budget') {
                ingredients.forEach(ing => {
                    const label = ing.querySelector('label');
                    if (label.textContent.includes('quinoa')) {
                        label.textContent = label.textContent.replace('quinoa', 'brown rice');
                    }
                });
            } else if (option === 'spicy') {
                const spicyIngredients = [
                    '1 tsp chili flakes',
                    '1 jalapeño, diced'
                ];
                
                const ingredientsList = document.querySelector('#ingredients');
                spicyIngredients.forEach(ing => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <input type="checkbox" id="spicy-${ingredientsList.children.length + 1}">
                        <label for="spicy-${ingredientsList.children.length + 1}">${ing}</label>
                    `;
                    ingredientsList.appendChild(li);
                });
            }
            
            showToast('Customization applied successfully!');
            
            // Scroll to ingredients section on mobile
            if (window.innerWidth <= 768) {
                document.querySelector('#ingredients').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });

    // Print functionality with improved mobile handling
    const printBtn = document.querySelector('.print-btn');
    printBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            showToast('Printing is best viewed on desktop', 'warning');
        }
        window.print();
    });

    // Share functionality with improved mobile support
    const shareBtn = document.querySelector('.share-btn');
    shareBtn.addEventListener('click', async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Quinoa Power Salad Recipe',
                    text: 'Check out this delicious and healthy Quinoa Power Salad recipe!',
                    url: window.location.href
                });
            } else {
                // Fallback for desktop
                const dummy = document.createElement('input');
                document.body.appendChild(dummy);
                dummy.value = window.location.href;
                dummy.select();
                document.execCommand('copy');
                document.body.removeChild(dummy);
                showToast('Link copied to clipboard!');
            }
        } catch (err) {
            console.log('Error sharing:', err);
        }
    });

    // Add animation to nutrition items with improved mobile performance
    const nutritionItems = document.querySelectorAll('.nutrition-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    nutritionItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease-out';
        observer.observe(item);
    });

    // Reviews functionality
    const starsInput = document.querySelectorAll('.stars-input i');
    const submitReviewBtn = document.querySelector('.submit-review');
    const reviewTextarea = document.querySelector('.rating-input textarea');
    const helpfulBtns = document.querySelectorAll('.helpful-btn');
    const replyBtns = document.querySelectorAll('.reply-btn');

    // Star rating interaction
    starsInput.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = this.dataset.rating;
            starsInput.forEach(s => {
                if (s.dataset.rating <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    document.querySelector('.stars-input').addEventListener('mouseleave', function() {
        const activeRating = document.querySelector('.stars-input i.active');
        if (!activeRating) {
            starsInput.forEach(s => s.classList.remove('active'));
        }
    });

    starsInput.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.dataset.rating;
            starsInput.forEach(s => {
                if (s.dataset.rating <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    // Submit review
    submitReviewBtn.addEventListener('click', () => {
        const rating = document.querySelectorAll('.stars-input i.active').length;
        const review = reviewTextarea.value.trim();

        if (rating === 0) {
            showToast('Please select a rating', 'error');
            return;
        }

        // Here you would typically send this to a server
        showToast('Thank you for your review!');
        
        // Reset form
        starsInput.forEach(s => s.classList.remove('active'));
        reviewTextarea.value = '';
    });

    // Helpful button interaction
    helpfulBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const count = parseInt(this.textContent.match(/\d+/)[0]);
            this.innerHTML = `<i class="fas fa-thumbs-up"></i> Helpful (${count + 1})`;
            this.disabled = true;
            showToast('Thank you for your feedback!');
        });
    });

    // Reply button interaction
    replyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const review = this.closest('.review');
            const existingReply = review.querySelector('.reply-form');
            
            if (existingReply) {
                existingReply.remove();
                return;
            }

            const replyForm = document.createElement('div');
            replyForm.className = 'reply-form';
            replyForm.innerHTML = `
                <textarea placeholder="Write your reply..."></textarea>
                <div class="reply-actions">
                    <button class="cancel-reply">Cancel</button>
                    <button class="submit-reply">Submit Reply</button>
                </div>
            `;

            review.appendChild(replyForm);

            // Focus the textarea
            replyForm.querySelector('textarea').focus();

            // Handle cancel
            replyForm.querySelector('.cancel-reply').addEventListener('click', () => {
                replyForm.remove();
            });

            // Handle submit
            replyForm.querySelector('.submit-reply').addEventListener('click', () => {
                const reply = replyForm.querySelector('textarea').value.trim();
                if (reply) {
                    const replyElement = document.createElement('div');
                    replyElement.className = 'reply';
                    replyElement.innerHTML = `
                        <div class="reply-header">
                            <img src="https://i.pravatar.cc/30?img=3" alt="User avatar" class="user-avatar">
                            <div class="reply-info">
                                <h5>You</h5>
                                <span class="reply-date">Just now</span>
                            </div>
                        </div>
                        <p class="reply-text">${reply}</p>
                    `;
                    review.insertBefore(replyElement, replyForm);
                    replyForm.remove();
                    showToast('Reply posted successfully!');
                } else {
                    showToast('Please write a reply', 'error');
                }
            });
        });
    });

    // Shopping List functionality
    const shoppingListBtn = document.querySelector('.shopping-list-btn');
    const shoppingListModal = document.querySelector('.shopping-list-modal');
    const closeShoppingList = document.querySelector('.close-shopping-list');
    const shoppingListItems = document.querySelector('.shopping-list-items');
    const exportListBtn = document.querySelector('.export-list-btn');
    const clearListBtn = document.querySelector('.clear-list-btn');

    // Load shopping list from localStorage
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

    function updateShoppingList() {
        shoppingListItems.innerHTML = '';
        shoppingList.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = `shopping-list-item ${item.checked ? 'checked' : ''}`;
            itemElement.innerHTML = `
                <input type="checkbox" id="item-${index}" ${item.checked ? 'checked' : ''}>
                <label for="item-${index}">${item.text}</label>
                <button class="remove-item"><i class="fas fa-times"></i></button>
            `;
            shoppingListItems.appendChild(itemElement);
        });
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    }

    // Add to shopping list
    shoppingListBtn.addEventListener('click', () => {
        const ingredients = document.querySelectorAll('#ingredients li');
        ingredients.forEach(ing => {
            const label = ing.querySelector('label');
            const text = label.textContent;
            if (!shoppingList.some(item => item.text === text)) {
                shoppingList.push({ text, checked: false });
            }
        });
        updateShoppingList();
        shoppingListModal.classList.add('active');
        showToast('Ingredients added to shopping list!');
    });

    // Close shopping list
    closeShoppingList.addEventListener('click', () => {
        shoppingListModal.classList.remove('active');
    });

    // Close on outside click
    shoppingListModal.addEventListener('click', (e) => {
        if (e.target === shoppingListModal) {
            shoppingListModal.classList.remove('active');
        }
    });

    // Handle checkbox changes
    shoppingListItems.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const index = parseInt(e.target.id.split('-')[1]);
            shoppingList[index].checked = e.target.checked;
            updateShoppingList();
        }
    });

    // Remove item
    shoppingListItems.addEventListener('click', (e) => {
        if (e.target.closest('.remove-item')) {
            const item = e.target.closest('.shopping-list-item');
            const index = Array.from(shoppingListItems.children).indexOf(item);
            shoppingList.splice(index, 1);
            updateShoppingList();
            showToast('Item removed from shopping list');
        }
    });

    // Export list
    exportListBtn.addEventListener('click', () => {
        const uncheckedItems = shoppingList
            .filter(item => !item.checked)
            .map(item => item.text)
            .join('\n');
        
        const blob = new Blob([uncheckedItems], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shopping-list.txt';
        a.click();
        window.URL.revokeObjectURL(url);
        showToast('Shopping list exported!');
    });

    // Clear list
    clearListBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the shopping list?')) {
            shoppingList = [];
            updateShoppingList();
            showToast('Shopping list cleared!');
        }
    });

    // Initialize shopping list
    updateShoppingList();

    // Dropdown menu functionality
    const dropdown = document.querySelector('.nav-links .dropdown');
    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    const featureSections = document.querySelectorAll('.feature-section');

    // Open/close dropdown
    let dropdownOpen = false;
    dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('open');
        dropdownOpen = !dropdownOpen;
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', (e) => {
        if (dropdownOpen && !dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
            dropdownOpen = false;
        }
    });

    // Show feature section when dropdown item is clicked
    const navFeatureLinks = dropdownMenu.querySelectorAll('a');
    navFeatureLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Hide all feature sections
            featureSections.forEach(section => section.classList.remove('active'));
            // Show the selected section
            const targetId = link.getAttribute('href').replace('#', '');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                // Scroll to the section
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Close dropdown
            dropdown.classList.remove('open');
            dropdownOpen = false;
        });
    });

    // Nutrition Calculator
    const calculateNutritionBtn = document.querySelector('.calculate-nutrition');
    const weightInput = document.getElementById('weight');
    const servingsCalcInput = document.getElementById('servings-calc');
    const caloriesResult = document.getElementById('calories-result');
    const proteinResult = document.getElementById('protein-result');
    const carbsResult = document.getElementById('carbs-result');
    const fatsResult = document.getElementById('fats-result');

    // Base nutritional values per 100g
    const baseNutrition = {
        calories: 550,
        protein: 40,
        carbs: 45,
        fats: 30
    };

    function calculateNutrition() {
        const weight = parseFloat(weightInput.value) || 0;
        const servings = parseInt(servingsCalcInput.value) || 1;
        
        // Calculate per serving
        const calories = (baseNutrition.calories * weight / 100) * servings;
        const protein = (baseNutrition.protein * weight / 100) * servings;
        const carbs = (baseNutrition.carbs * weight / 100) * servings;
        const fats = (baseNutrition.fats * weight / 100) * servings;
        
        // Update results
        caloriesResult.textContent = Math.round(calories);
        proteinResult.textContent = `${Math.round(protein)}g`;
        carbsResult.textContent = `${Math.round(carbs)}g`;
        fatsResult.textContent = `${Math.round(fats)}g`;
        
        // Save to localStorage
        localStorage.setItem('lastNutritionCalculation', JSON.stringify({
            weight,
            servings,
            results: { calories, protein, carbs, fats }
        }));
        
        showToast('Nutrition calculated successfully!');
    }

    calculateNutritionBtn.addEventListener('click', calculateNutrition);

    // Load last calculation
    const lastCalculation = JSON.parse(localStorage.getItem('lastNutritionCalculation'));
    if (lastCalculation) {
        weightInput.value = lastCalculation.weight;
        servingsCalcInput.value = lastCalculation.servings;
        calculateNutrition();
    }

    // Recipe Customization
    const proteinSource = document.getElementById('protein-source');
    const grain = document.getElementById('grain');
    const vegetableOptions = document.querySelectorAll('.vegetable-options input');
    const dressing = document.getElementById('dressing');
    const applyCustomBtn = document.querySelector('.apply-custom');

    // Ingredient mappings
    const ingredientMappings = {
        protein: {
            chicken: '200g chicken breast',
            tofu: '200g firm tofu',
            tempeh: '200g tempeh',
            seitan: '200g seitan'
        },
        grain: {
            quinoa: '1 cup quinoa',
            rice: '1 cup brown rice',
            couscous: '1 cup couscous',
            bulgur: '1 cup bulgur'
        },
        vegetables: {
            'bell-pepper': '1 bell pepper',
            spinach: '2 cups spinach',
            cucumber: '1 cucumber',
            tomato: '2 tomatoes'
        },
        dressing: {
            lemon: '2 tbsp olive oil, 1 lemon',
            balsamic: '2 tbsp balsamic vinaigrette',
            tahini: '2 tbsp tahini dressing',
            yogurt: '2 tbsp yogurt dressing'
        }
    };

    function applyCustomModifications() {
        const ingredients = document.querySelector('#ingredients');
        const selectedProtein = proteinSource.value;
        const selectedGrain = grain.value;
        const selectedVegetables = Array.from(vegetableOptions)
            .filter(option => option.checked)
            .map(option => option.value);
        const selectedDressing = dressing.value;

        // Update ingredients list
        ingredients.innerHTML = `
            <li><input type="checkbox" id="ing1"><label for="ing1">${ingredientMappings.grain[selectedGrain]}</label></li>
            <li><input type="checkbox" id="ing2"><label for="ing2">2 cups water</label></li>
            <li><input type="checkbox" id="ing3"><label for="ing3">${ingredientMappings.protein[selectedProtein]}</label></li>
            ${selectedVegetables.map((veg, index) => `
                <li><input type="checkbox" id="ing${index + 4}"><label for="ing${index + 4}">${ingredientMappings.vegetables[veg]}</label></li>
            `).join('')}
            <li><input type="checkbox" id="ing${selectedVegetables.length + 4}"><label for="ing${selectedVegetables.length + 4}">${ingredientMappings.dressing[selectedDressing]}</label></li>
            <li><input type="checkbox" id="ing${selectedVegetables.length + 5}"><label for="ing${selectedVegetables.length + 5}">Salt and pepper to taste</label></li>
        `;

        // Save customization
        const customization = {
            protein: selectedProtein,
            grain: selectedGrain,
            vegetables: selectedVegetables,
            dressing: selectedDressing
        };
        localStorage.setItem('recipeCustomization', JSON.stringify(customization));

        showToast('Custom modifications applied successfully!');
        
        // Update servings calculator
        updateIngredients();
    }

    applyCustomBtn.addEventListener('click', applyCustomModifications);

    // Load saved customization
    const savedCustomization = JSON.parse(localStorage.getItem('recipeCustomization'));
    if (savedCustomization) {
        proteinSource.value = savedCustomization.protein;
        grain.value = savedCustomization.grain;
        vegetableOptions.forEach(option => {
            option.checked = savedCustomization.vegetables.includes(option.value);
        });
        dressing.value = savedCustomization.dressing;
    }

    // Navigation functionality
    const cookingModeNav = document.querySelector('.cooking-mode-nav');
    const collectionsNav = document.querySelector('.collections-nav');
    const dataManagementNav = document.querySelector('.data-management-nav');

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });

    // Navigation item click handlers
    cookingModeNav.addEventListener('click', (e) => {
        e.preventDefault();
        const cookingModeToggle = document.querySelector('.cooking-mode-toggle');
        if (cookingModeToggle) {
            cookingModeToggle.click();
        }
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });

    collectionsNav.addEventListener('click', (e) => {
        e.preventDefault();
        const collectionsToggle = document.querySelector('.collections-toggle');
        if (collectionsToggle) {
            collectionsToggle.click();
        }
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });

    dataManagementNav.addEventListener('click', (e) => {
        e.preventDefault();
        const dataManagementToggle = document.querySelector('.data-management-toggle');
        if (dataManagementToggle) {
            dataManagementToggle.click();
        }
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
}); 