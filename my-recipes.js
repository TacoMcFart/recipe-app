document.addEventListener('DOMContentLoaded', () => {

    // --- Translations ---
    const translations = {
        en: {
            myRecipesTitle: "My Recipes - Recipe App",
            backToAll: "Back to All Recipes",
            searchPlaceholder: "Search for ingredients...",
            filterAll: "All",
            filterVegan: "Vegan",
            filterVegetarian: "Vegetarian",
            filterQuick: "Quick",
            filterLowCarb: "Low Carb",
            filterHighProtein: "High Protein",
            modalIngredients: "Ingredients",
            modalInstructions: "Instructions",
            modalNutrition: "Nutrition Facts",
            nutritionServingNote: "(Values per serving)",
            calories: "Calories",
            carbs: "Carbs",
            protein: "Protein",
            deleteRecipeBtn: "Delete Recipe",
            deleteConfirmMessage: "Are you sure you want to delete this recipe?",
            deleteConfirmYes: "Yes, Delete",
            deleteConfirmCancel: "Cancel",
            noUserRecipes: "No recipes yet",
            noUserRecipesDesc: "You haven't added any recipes yet. Click the button below to add your first recipe!",
            addFirstRecipe: "Add Your First Recipe",
            langEN: "English",
            langDE: "Deutsch",
            closeModal: "×",
            copiedToClipboard: "Shopping list copied to clipboard!",
            newRecipeTitle: "Add a New Recipe",
            recipeName: "Recipe Name",
            description: "Description",
            imageUrl: "Image URL",
            ingredients: "Ingredients (comma-separated)",
            instructions: "Instructions",
            tags: "Tags (comma-separated)",
            saveRecipe: "Save Recipe",
            addYourOwnRecipe: "Add Your Own Recipe"
        },
        de: {
            myRecipesTitle: "Meine Rezepte - Rezepte-App",
            backToAll: "Zurück zu allen Rezepten",
            searchPlaceholder: "Suche nach Zutaten...",
            filterAll: "Alle",
            filterVegan: "Vegan",
            filterVegetarian: "Vegetarisch",
            filterQuick: "Schnell",
            filterLowCarb: "Low Carb",
            filterHighProtein: "Proteinreich",
            modalIngredients: "Zutaten",
            modalInstructions: "Anleitung",
            modalNutrition: "Nährwerte",
            nutritionServingNote: "(Werte pro Portion)",
            calories: "Kalorien",
            carbs: "Kohlenhydrate",
            protein: "Protein",
            deleteRecipeBtn: "Rezept löschen",
            deleteConfirmMessage: "Sind Sie sicher, dass Sie dieses Rezept löschen möchten?",
            deleteConfirmYes: "Ja, löschen",
            deleteConfirmCancel: "Abbrechen",
            noUserRecipes: "Noch keine Rezepte",
            noUserRecipesDesc: "Sie haben noch keine Rezepte hinzugefügt. Klicken Sie auf die Schaltfläche unten, um Ihr erstes Rezept hinzuzufügen!",
            addFirstRecipe: "Erstes Rezept hinzufügen",
            langEN: "Englisch",
            langDE: "Deutsch",
            closeModal: "×",
            copiedToClipboard: "Einkaufsliste in die Zwischenablage kopiert!",
            newRecipeTitle: "Neues Rezept hinzufügen",
            recipeName: "Rezeptname",
            description: "Beschreibung",
            imageUrl: "Bild-URL",
            ingredients: "Zutaten (durch Kommas getrennt)",
            instructions: "Anweisungen",
            tags: "Tags (durch Kommas getrennt)",
            saveRecipe: "Rezept speichern",
            addYourOwnRecipe: "Eigenes Rezept hinzufügen"
        }
    };

    // --- Initial Recipes (for tag selection) ---
    const initialRecipes = [
        {
            id: 'template-1',
            tags: { en: ['breakfast', 'healthy', 'quick', 'vegetarian', 'vegan'], de: ['frühstück', 'gesund', 'schnell', 'vegetarisch', 'vegan'] }
        },
        {
            id: 'template-2', 
            tags: { en: ['lunch', 'dinner', 'high protein', 'low carb', 'gluten-free'], de: ['mittagessen', 'abendessen', 'proteinreich', 'kohlenhydratarm', 'glutenfrei'] }
        },
        {
            id: 'template-3',
            tags: { en: ['dessert', 'sweet', 'baking', 'italian', 'mexican', 'asian', 'american'], de: ['dessert', 'süß', 'backen', 'italienisch', 'mexikanisch', 'asiatisch', 'amerikanisch'] }
        }
    ];

    // --- DOM Elements ---
    const searchBar = document.getElementById('search-bar');
    const filterTagsContainer = document.getElementById('filter-tags');
    const recipeGrid = document.getElementById('recipe-grid');
    const detailModal = document.getElementById('detail-modal');
    const modalContent = document.getElementById('modal-content');
    const emptyState = document.getElementById('empty-state');
    const languageSwitcher = document.querySelector('.language-switcher');
    const addRecipeModal = document.getElementById('add-recipe-modal');
    const closeAddModalBtn = document.querySelector('#add-recipe-modal .close-btn');
    const addRecipeForm = document.getElementById('add-recipe-form');
    const addFirstRecipeBtn = document.getElementById('add-first-recipe-btn');
    
    // Tag selection elements
    const existingTagsContainer = document.getElementById('existing-tags');
    const selectedTagsContainer = document.getElementById('selected-tags');
    const addCustomTagBtn = document.getElementById('add-custom-tag-btn');
    
    // Track selected tags
    let selectedTags = [];

    // --- State ---
    let currentLanguage = localStorage.getItem('recipeAppLanguage') || 'en';
    let favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];

    // --- Functions ---
    const getUserRecipes = () => {
        return JSON.parse(localStorage.getItem('customRecipes')) || [];
    };

    const createRecipeCard = (recipe) => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.dataset.id = recipe.id;
        
        const isFavorite = favoriteRecipes.includes(recipe.id.toString());
        const lang = currentLanguage;

        // Helper function to get localized content with fallback
        const getLocalizedContent = (field) => {
            if (recipe[field] && recipe[field][lang]) {
                return recipe[field][lang];
            }
            // Fallback to English
            return recipe[field] && recipe[field].en ? recipe[field].en : '';
        };

        const title = getLocalizedContent('title');
        const description = getLocalizedContent('description');

        card.innerHTML = `
            <img src="${recipe.image}" alt="${title}">
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="card-icons">
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-recipe-id="${recipe.id}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="delete-btn" data-recipe-id="${recipe.id}" title="${translations[lang].deleteRecipeBtn}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        return card;
    };

    const renderRecipes = (recipes) => {
        recipeGrid.innerHTML = '';
        
        if (recipes.length === 0) {
            emptyState.style.display = 'block';
            recipeGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            recipeGrid.style.display = 'grid';
            recipes.forEach(recipe => {
                const card = createRecipeCard(recipe);
                recipeGrid.appendChild(card);
            });
        }
    };
    
    const setLanguage = (lang) => {
        currentLanguage = lang;
        localStorage.setItem('recipeAppLanguage', lang);
        document.documentElement.lang = lang;
        // Update all elements with data-key
        const elementsToTranslate = document.querySelectorAll('[data-key]');
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                if (el.placeholder !== undefined) {
                    el.placeholder = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });
        // Update <title> if it has data-key
        const titleEl = document.querySelector('title[data-key]');
        if (titleEl) {
            const key = titleEl.getAttribute('data-key');
            if (translations[lang][key]) {
                titleEl.textContent = translations[lang][key];
            }
        }
        // Update <option> elements in language switcher
        const optionEls = document.querySelectorAll('option[data-key]');
        optionEls.forEach(option => {
            const key = option.getAttribute('data-key');
            if (translations[lang][key]) {
                option.textContent = translations[lang][key];
            }
        });
        // Re-render recipes to update their text
        applyCurrentFilter();
    };

    const applyCurrentFilter = () => {
        const searchTerm = searchBar.value.toLowerCase();
        const activeFilterTag = filterTagsContainer.querySelector('.filter-tag.active');
        if (!activeFilterTag) return;
        const activeFilter = activeFilterTag.dataset.filter;

        let filteredRecipes = getUserRecipes();

        // Helper function to get localized content with fallback
        const getLocalizedContent = (recipe, field) => {
            if (recipe[field] && recipe[field][currentLanguage]) {
                return recipe[field][currentLanguage];
            }
            // Fallback to English
            return recipe[field] && recipe[field].en ? recipe[field].en : '';
        };

        // Search filter
        if (searchTerm) {
            filteredRecipes = filteredRecipes.filter(recipe => {
                const ingredients = getLocalizedContent(recipe, 'ingredients');
                const title = getLocalizedContent(recipe, 'title');
                
                const ingredientsMatch = ingredients.some(ing => ing.toLowerCase().includes(searchTerm));
                const titleMatch = title.toLowerCase().includes(searchTerm);
                return ingredientsMatch || titleMatch;
            });
        }

        // Tag filter - case-insensitive matching based on current language
        if (activeFilter !== 'all') {
            filteredRecipes = filteredRecipes.filter(recipe => {
                const tags = getLocalizedContent(recipe, 'tags');
                return tags.some(tag => tag.toLowerCase() === activeFilter.toLowerCase());
            });
        }
        
        renderRecipes(filteredRecipes);
    };

    const openDetailModal = (recipe) => {
        const lang = currentLanguage;
        
        // Helper function to get localized content with fallback
        const getLocalizedContent = (field) => {
            if (recipe[field] && recipe[field][lang]) {
                return recipe[field][lang];
            }
            // Fallback to English
            return recipe[field] && recipe[field].en ? recipe[field].en : '';
        };

        const title = getLocalizedContent('title');
        const ingredients = getLocalizedContent('ingredients');
        const instructions = getLocalizedContent('instructions');

        // Ensure ingredients is an array
        const ingredientsArray = Array.isArray(ingredients) ? ingredients : [];

        modalContent.innerHTML = `
            <span class="close-btn">&times;</span>
            <h2>${title}</h2>
            <img src="${recipe.image}" alt="${title}" style="width:100%; max-width:400px; border-radius:8px;">
            
            <h3 data-key="modalIngredients">${translations[lang].modalIngredients}</h3>
            <ul class="ingredients-list">
                ${ingredientsArray.map(ing => `
                    <li>
                        <span>${ing}</span>
                        <button class="add-ingredient-btn" data-ingredient="${ing}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </li>
                `).join('')}
            </ul>
            
            <button class="add-all-ingredients-btn" data-recipe-id="${recipe.id}">
                <i class="fas fa-shopping-cart"></i>
                <span>Add All Ingredients to Shopping List</span>
            </button>

            <h3 data-key="modalInstructions">${translations[lang].modalInstructions}</h3>
            <p>${instructions}</p>

            <h3 data-key="modalNutrition">${translations[lang].modalNutrition}</h3>
            <p class="nutrition-note" data-key="nutritionServingNote">${translations[lang].nutritionServingNote}</p>
            <ul>
                <li><span data-key="calories">${translations[lang].calories}</span>: ${recipe.calories} kcal</li>
                <li><span data-key="carbs">${translations[lang].carbs}</span>: ${recipe.carbs}g</li>
                <li><span data-key="protein">${translations[lang].protein}</span>: ${recipe.protein}g</li>
            </ul>
        `;
        
        detailModal.style.display = 'block';
        
        // Add event listener for the close button
        modalContent.querySelector('.close-btn').addEventListener('click', closeDetailModal);
        
        // Add event listeners for individual ingredient buttons
        const addIngredientBtns = modalContent.querySelectorAll('.add-ingredient-btn');
        addIngredientBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const ingredient = btn.dataset.ingredient;
                
                // Get current shopping list
                let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
                
                if (!shoppingList.includes(ingredient)) {
                    shoppingList.push(ingredient);
                    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
                    
                    // Visual feedback - change button to show added
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    btn.classList.add('added');
                    btn.disabled = true;
                } else {
                    // Just show visual feedback for already added items
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    btn.classList.add('added');
                    btn.disabled = true;
                }
            });
        });
        
        // Add event listener for the "Add All Ingredients" button
        const addAllBtn = modalContent.querySelector('.add-all-ingredients-btn');
        if (addAllBtn) {
            addAllBtn.addEventListener('click', () => {
                // Get current shopping list
                let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
                
                // Add each ingredient to shopping list
                ingredientsArray.forEach(ingredient => {
                    if (!shoppingList.includes(ingredient)) {
                        shoppingList.push(ingredient);
                    }
                });
                
                // Save to localStorage
                localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
                
                // Update all individual buttons to show added
                addIngredientBtns.forEach(btn => {
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    btn.classList.add('added');
                    btn.disabled = true;
                });
                
                // Show confirmation
                alert('All ingredients added to shopping list!');
            });
        }
    };

    const closeDetailModal = () => {
        detailModal.style.display = 'none';
    };

    const toggleFavorite = (recipeId) => {
        const id = recipeId.toString();
        const index = favoriteRecipes.indexOf(id);
        if (index > -1) {
            favoriteRecipes.splice(index, 1);
        } else {
            favoriteRecipes.push(id);
        }
        localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
        
        // Update just the one button
        const btn = recipeGrid.querySelector(`.favorite-btn[data-recipe-id="${id}"]`);
        if(btn) {
            btn.classList.toggle('active');
        }
    };

    const deleteRecipe = (recipeId) => {
        const lang = currentLanguage;
        const confirmMessage = translations[lang].deleteConfirmMessage;
        const confirmYes = translations[lang].deleteConfirmYes;
        const confirmCancel = translations[lang].deleteConfirmCancel;
        
        if (confirm(`${confirmMessage}\n\n${confirmYes} / ${confirmCancel}`)) {
            // Remove from user recipes in localStorage
            const userRecipes = getUserRecipes();
            const updatedUserRecipes = userRecipes.filter(recipe => recipe.id !== recipeId);
            localStorage.setItem('customRecipes', JSON.stringify(updatedUserRecipes));
            
            // Remove from favorites if it was favorited
            const favoriteIndex = favoriteRecipes.indexOf(recipeId.toString());
            if (favoriteIndex > -1) {
                favoriteRecipes.splice(favoriteIndex, 1);
                localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
            }
            
            // Re-render recipes
            applyCurrentFilter();
        }
    };

    // Tag selection functions
    const getAllExistingTags = () => {
        const allTags = new Set();
        
        // Get tags from initial recipes (common tags)
        initialRecipes.forEach(recipe => {
            if (recipe.tags && recipe.tags.en) {
                recipe.tags.en.forEach(tag => allTags.add(tag.toLowerCase()));
            }
        });
        
        // Get tags from all recipes in localStorage (both initial and custom)
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
        customRecipes.forEach(recipe => {
            if (recipe.tags && recipe.tags.en) {
                recipe.tags.en.forEach(tag => allTags.add(tag.toLowerCase()));
            }
        });
        
        return Array.from(allTags).sort();
    };

    const populateExistingTags = () => {
        const existingTags = getAllExistingTags();
        existingTagsContainer.innerHTML = '';
        
        existingTags.forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.type = 'button';
            tagButton.className = 'tag-option';
            tagButton.textContent = tag;
            tagButton.dataset.tag = tag;
            
            tagButton.addEventListener('click', () => {
                toggleTagSelection(tag);
            });
            
            existingTagsContainer.appendChild(tagButton);
        });
    };

    const toggleTagSelection = (tag) => {
        const tagIndex = selectedTags.indexOf(tag);
        
        if (tagIndex > -1) {
            // Remove tag
            selectedTags.splice(tagIndex, 1);
        } else {
            // Add tag
            selectedTags.push(tag);
        }
        
        updateTagDisplay();
        updateExistingTagButtons();
    };

    const updateTagDisplay = () => {
        selectedTagsContainer.innerHTML = '';
        
        selectedTags.forEach(tag => {
            const selectedTag = document.createElement('div');
            selectedTag.className = 'selected-tag';
            selectedTag.innerHTML = `
                <span>${tag}</span>
                <button type="button" class="remove-tag-btn" data-tag="${tag}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            selectedTag.querySelector('.remove-tag-btn').addEventListener('click', () => {
                toggleTagSelection(tag);
            });
            
            selectedTagsContainer.appendChild(selectedTag);
        });
    };

    const updateExistingTagButtons = () => {
        existingTagsContainer.querySelectorAll('.tag-option').forEach(button => {
            const tag = button.dataset.tag;
            if (selectedTags.includes(tag)) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
    };

    const resetTagSelection = () => {
        selectedTags = [];
        updateTagDisplay();
        updateExistingTagButtons();
    };

    const addCustomTag = () => {
        const customTag = prompt('Enter a new tag:');
        if (customTag && customTag.trim()) {
            const tag = customTag.trim().toLowerCase();
            if (!selectedTags.includes(tag)) {
                selectedTags.push(tag);
                updateTagDisplay();
                updateExistingTagButtons();
            }
        }
    };

    // --- Event Listeners ---
    searchBar.addEventListener('input', applyCurrentFilter);

    filterTagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-tag')) {
            filterTagsContainer.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');
            applyCurrentFilter();
        }
    });

    // Add first recipe button
    addFirstRecipeBtn.addEventListener('click', () => {
        addRecipeModal.style.display = 'block';
        populateExistingTags();
        resetTagSelection();
    });

    // Floating add button
    const floatingAddBtn = document.getElementById('floating-add-btn');
    if (floatingAddBtn) {
        floatingAddBtn.addEventListener('click', () => {
            addRecipeModal.style.display = 'block';
            populateExistingTags();
            resetTagSelection();
        });
    }

    // Custom tag button event listener
    addCustomTagBtn.addEventListener('click', addCustomTag);

    // Form submission
    addRecipeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newRecipe = {
            id: Date.now(),
            isUserRecipe: true,
            image: document.getElementById('form-image-url').value || 'images/placeholder.jpg',
            calories: parseInt(document.getElementById('form-calories').value, 10) || 0,
            carbs: parseInt(document.getElementById('form-carbs').value, 10) || 0,
            protein: parseInt(document.getElementById('form-protein').value, 10) || 0,
            title: {
                en: document.getElementById('form-title').value,
                de: document.getElementById('form-title').value
            },
            description: {
                en: document.getElementById('form-desc').value,
                de: document.getElementById('form-desc').value
            },
            ingredients: {
                en: document.getElementById('form-ingredients').value.split(',').map(i => i.trim()),
                de: document.getElementById('form-ingredients').value.split(',').map(i => i.trim())
            },
            instructions: {
                en: document.getElementById('form-instructions').value.replace(/\n/g, '<br>'),
                de: document.getElementById('form-instructions').value.replace(/\n/g, '<br>')
            },
            tags: {
                en: selectedTags,
                de: selectedTags
            }
        };
        
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
        customRecipes.push(newRecipe);
        localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
        
        addRecipeForm.reset();
        resetTagSelection();
        addRecipeModal.style.display = 'none';
        
        // Refresh the page to show the new recipe
        window.location.reload();
    });

    // Modal close event listeners
    closeAddModalBtn.addEventListener('click', () => {
        addRecipeModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === addRecipeModal) {
            addRecipeModal.style.display = 'none';
        }
    });

    recipeGrid.addEventListener('click', (e) => {
        const button = e.target.closest('.favorite-btn');
        if (button) {
            const recipeId = button.dataset.recipeId;
            toggleFavorite(recipeId);
            return; 
        }

        const deleteButton = e.target.closest('.delete-btn');
        if (deleteButton) {
            const recipeId = parseInt(deleteButton.dataset.recipeId);
            deleteRecipe(recipeId);
            return;
        }

        const card = e.target.closest('.recipe-card');
        if (card) {
            const recipeId = card.dataset.id;
            const userRecipes = getUserRecipes();
            const recipe = userRecipes.find(r => r.id.toString() === recipeId);
            if (recipe) {
                openDetailModal(recipe);
            }
        }
    });
    
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            closeDetailModal();
        }
    });
    
    languageSwitcher.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });

    // --- Initialization ---
    const init = () => {
        languageSwitcher.value = currentLanguage;
        setLanguage(currentLanguage);
        applyCurrentFilter();
    };

    init();
});

