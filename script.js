const translations = {
    en: {
        add_all_ingredients: "Add All Ingredients to Shopping List",
        closeModal: "Close",
        modalIngredients: "Ingredients",
        modalInstructions: "Instructions",
        modalNutrition: "Nutrition",
        nutritionServingNote: "Serving Note"
    },
    de: {
        add_all_ingredients: "Alle Zutaten zur Einkaufsliste hinzufügen",
        closeModal: "Schließen",
        modalIngredients: "Zutaten",
        modalInstructions: "Zubereitung",
        modalNutrition: "Nährwerte",
        nutritionServingNote: "Verzehrsanmerkung"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded successfully');
    
    // --- Basic Variables ---
    let currentLanguage = localStorage.getItem('recipeAppLanguage') || 'en';
    let favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    let selectedTags = [];

    // --- DOM Elements ---
    const recipeGrid = document.getElementById('recipe-grid');
    const searchBar = document.getElementById('search-bar');
    const filterTagsContainer = document.querySelector('.filter-container');
    const favoritesBtn = document.getElementById('favorites-btn');
    const detailModal = document.getElementById('detail-modal');
    const modalContent = document.querySelector('#detail-modal .modal-content');
    const closeModalBtn = document.querySelector('#detail-modal .close-btn');
    const addRecipeModal = document.getElementById('add-recipe-modal');
    const closeAddModalBtn = document.querySelector('#add-recipe-modal .close-btn');
    const addRecipeForm = document.getElementById('add-recipe-form');
    const floatingAddBtn = document.getElementById('floating-add-btn');
    const tagsDropdownToggle = document.getElementById('tags-dropdown-toggle');
    const tagsDropdownMenu = document.getElementById('tags-dropdown-menu');
    const existingTagsContainer = document.getElementById('existing-tags');
    const selectedTagsContainer = document.getElementById('selected-tags');
    const addCustomTagBtn = document.getElementById('add-custom-tag-btn');
    const shoppingListContainer = document.getElementById('shopping-list-items');
    const clearListBtn = document.getElementById('clear-list-btn');
    const shareListBtn = document.getElementById('share-list-btn');
    const languageSwitcher = document.getElementById('language-switcher');
    const copyListBtn = document.getElementById('copy-list-btn');
    const popupModal = document.getElementById('popup-modal');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const popupOkBtn = document.getElementById('popup-ok-btn');

    console.log('DOM elements found:', {
        recipeGrid: !!recipeGrid,
        searchBar: !!searchBar,
        filterTagsContainer: !!filterTagsContainer,
        favoritesBtn: !!favoritesBtn,
        floatingAddBtn: !!floatingAddBtn,
        detailModal: !!detailModal,
        modalContent: !!modalContent
    });

    // --- Initial Recipes ---
    const initialRecipes = [
        {
            id: 1,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
            calories: 600,
            carbs: 70,
            protein: 25,
            title: {
                en: 'Spaghetti Carbonara',
                de: 'Spaghetti Carbonara'
            },
            description: {
                en: 'A classic Italian pasta dish, rich and creamy.',
                de: 'Ein klassisches italienisches Nudelgericht, reichhaltig und cremig.'
            },
            ingredients: {
                en: ['200g spaghetti', '100g pancetta or guanciale', '2 large eggs', '50g Pecorino Romano cheese', 'Black pepper', 'Salt'],
                de: ['200g Spaghetti', '100g Pancetta oder Guanciale', '2 große Eier', '50g Pecorino Romano Käse', 'Schwarzer Pfeffer', 'Salz']
            },
            instructions: {
                en: '1. Cook spaghetti according to package directions in salted water. Reserve some pasta water before draining.<br>2. While pasta is cooking, slice pancetta into small lardons and fry in a large skillet over medium heat until crisp.<br>3. In a separate bowl, whisk together the eggs and grated Pecorino cheese. Season generously with freshly ground black pepper.<br>4. Drain the cooked pasta and immediately add it to the skillet with the crispy pancetta. Turn off the heat.<br>5. Quickly pour the egg and cheese mixture over the hot pasta, stirring vigorously. The heat from the pasta will cook the eggs and create a creamy sauce.<br>6. If the sauce is too thick, add a tablespoon or two of the reserved pasta water to reach the desired consistency.<br>7. Serve immediately, topped with extra Pecorino cheese and black pepper.',
                de: '1. Spaghetti nach Packungsanweisung in Salzwasser kochen. Etwas Nudelwasser vor dem Abgießen aufbewahren.<br>2. Während die Nudeln kochen, Pancetta in kleine Würfel schneiden und in einer großen Pfanne bei mittlerer Hitze knusprig braten.<br>3. In einer separaten Schüssel Eier und geriebenen Pecorino-Käse verquirlen. Großzügig mit frisch gemahlenem schwarzem Pfeffer würzen.<br>4. Die gekochten Nudeln abgießen und sofort in die Pfanne mit dem knusprigen Pancetta geben. Die Hitze ausschalten.<br>5. Die Ei-Käse-Mischung schnell über die heißen Nudeln gießen und kräftig umrühren. Die Hitze der Nudeln gart die Eier und erzeugt eine cremige Sauce.<br>6. Wenn die Sauce zu dick ist, ein oder zwei Esslöffel des aufbewahrten Nudelwassers hinzufügen, um die gewünschte Konsistenz zu erreichen.<br>7. Sofort mit extra Pecorino-Käse und Pfeffer servieren.'
            },
            tags: {
                en: ['pasta', 'italian', 'dinner'],
                de: ['nudeln', 'italienisch', 'abendessen']
            }
        },
        {
            id: 2,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
            calories: 750,
            carbs: 20,
            protein: 45,
            title: {
                en: 'Chicken Tikka Masala',
                de: 'Chicken Tikka Masala'
            },
            description: {
                en: 'Creamy and flavorful chicken curry.',
                de: 'Cremiges und geschmackvolles Hähnchencurry.'
            },
            ingredients: {
                en: ['500g chicken breast', '1 cup yogurt', '1 tbsp lemon juice', '2 tsp turmeric', '2 tsp garam masala', '1 tsp chili powder', '1 cup tomato puree', '1 cup heavy cream', '1 onion', '2 cloves garlic', '1 inch ginger'],
                de: ['500g Hähnchenbrust', '1 Tasse Joghurt', '1 EL Zitronensaft', '2 TL Kurkuma', '2 TL Garam Masala', '1 TL Chilipulver', '1 Tasse Tomatenpüree', '1 Tasse Sahne', '1 Zwiebel', '2 Knoblauchzehen', '1 Zoll Ingwer']
            },
            instructions: {
                en: '1. In a bowl, mix chicken with yogurt, lemon juice, turmeric, 1 tsp garam masala, and chili powder. Marinate for at least 1 hour.<br>2. Heat oil in a pan. Sauté onions, garlic, and ginger until soft.<br>3. Add tomato puree and remaining garam masala. Cook for 5 minutes.<br>4. Add marinated chicken and cook until no longer pink.<br>5. Stir in heavy cream and simmer for 10-15 minutes until the sauce thickens.<br>6. Garnish with fresh cilantro and serve with rice or naan bread.',
                de: '1. In einer Schüssel Hähnchen mit Joghurt, Zitronensaft, Kurkuma, 1 TL Garam Masala und Chilipulver mischen. Mindestens 1 Stunde marinieren.<br>2. Öl in einer Pfanne erhitzen. Zwiebeln, Knoblauch und Ingwer weich dünsten.<br>3. Tomatenpüree und restliches Garam Masala hinzufügen. 5 Minuten kochen.<br>4. Mariniertes Hähnchen hinzufügen und kochen, bis es nicht mehr rosa ist.<br>5. Sahne einrühren und 10-15 Minuten köcheln lassen, bis die Sauce eindickt.<br>6. Mit frischem Koriander garnieren und mit Reis oder Naan-Brot servieren.'
            },
            tags: {
                en: ['chicken', 'indian', 'dinner', 'high protein'],
                de: ['hähnchen', 'indisch', 'abendessen', 'proteinreich']
            }
        },
        {
            id: 3,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
            calories: 850,
            carbs: 95,
            protein: 35,
            title: {
                en: 'Margherita Pizza',
                de: 'Pizza Margherita'
            },
            description: {
                en: 'Classic Italian pizza with tomato sauce, mozzarella, and basil.',
                de: 'Klassische italienische Pizza mit Tomatensauce, Mozzarella und Basilikum.'
            },
            ingredients: {
                en: ['Pizza dough', 'Tomato sauce', 'Fresh mozzarella', 'Fresh basil leaves', 'Olive oil', 'Salt'],
                de: ['Pizzateig', 'Tomatensauce', 'Frischer Mozzarella', 'Frische Basilikumblätter', 'Olivenöl', 'Salz']
            },
            instructions: {
                en: '1. Preheat oven to 500°F (260°C) with a pizza stone if available.<br>2. Roll out the pizza dough into a 12-inch circle.<br>3. Spread tomato sauce evenly over the dough.<br>4. Add torn mozzarella pieces.<br>5. Bake for 12-15 minutes until crust is golden and cheese is bubbly.<br>6. Remove from oven and add fresh basil leaves.<br>7. Drizzle with olive oil and serve immediately.',
                de: '1. Ofen auf 260°C vorheizen, falls verfügbar mit einem Pizzastein.<br>2. Pizzateig zu einem 30cm Kreis ausrollen.<br>3. Tomatensauce gleichmäßig auf dem Teig verteilen.<br>4. Mozzarella-Stücke hinzufügen.<br>5. 12-15 Minuten backen, bis der Teig goldbraun und der Käse blubbert.<br>6. Aus dem Ofen nehmen und frische Basilikumblätter hinzufügen.<br>7. Mit Olivenöl beträufeln und sofort servieren.'
            },
            tags: {
                en: ['pizza', 'italian', 'dinner'],
                de: ['pizza', 'italienisch', 'abendessen']
            }
        },
        {
            id: 4,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
            calories: 650,
            carbs: 25,
            protein: 40,
            title: {
                en: 'Beef Tacos',
                de: 'Rindfleisch-Tacos'
            },
            description: {
                en: 'Flavorful beef tacos with fresh vegetables and salsa.',
                de: 'Geschmackvolle Rindfleisch-Tacos mit frischem Gemüse und Salsa.'
            },
            ingredients: {
                en: ['500g ground beef', 'Taco seasoning', 'Taco shells', 'Lettuce', 'Tomatoes', 'Onion', 'Cheese', 'Sour cream', 'Salsa'],
                de: ['500g Hackfleisch', 'Taco-Gewürzmischung', 'Taco-Schalen', 'Salat', 'Tomaten', 'Zwiebel', 'Käse', 'Sauerrahm', 'Salsa']
            },
            instructions: {
                en: '1. Brown ground beef in a large skillet over medium heat.<br>2. Add taco seasoning and water according to package directions.<br>3. Simmer for 5 minutes until thickened.<br>4. Warm taco shells in the oven or microwave.<br>5. Fill shells with beef mixture.<br>6. Top with lettuce, tomatoes, onion, cheese, sour cream, and salsa.',
                de: '1. Hackfleisch in einer großen Pfanne bei mittlerer Hitze anbraten.<br>2. Taco-Gewürzmischung und Wasser nach Packungsanweisung hinzufügen.<br>3. 5 Minuten köcheln lassen, bis eingedickt.<br>4. Taco-Schalen im Ofen oder Mikrowelle erwärmen.<br>5. Schalen mit Rindfleischmischung füllen.<br>6. Mit Salat, Tomaten, Zwiebel, Käse, Sauerrahm und Salsa belegen.'
            },
            tags: {
                en: ['tacos', 'mexican', 'dinner'],
                de: ['tacos', 'mexikanisch', 'abendessen']
            }
        },
        {
            id: 5,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop',
            calories: 450,
            carbs: 15,
            protein: 30,
            title: {
                en: 'Caesar Salad',
                de: 'Caesar Salat'
            },
            description: {
                en: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan.',
                de: 'Frischer Römersalat mit Caesar-Dressing, Croutons und Parmesan.'
            },
            ingredients: {
                en: ['Romaine lettuce', 'Caesar dressing', 'Croutons', 'Parmesan cheese', 'Black pepper', 'Lemon juice'],
                de: ['Römersalat', 'Caesar-Dressing', 'Croutons', 'Parmesankäse', 'Schwarzer Pfeffer', 'Zitronensaft']
            },
            instructions: {
                en: '1. Wash and chop romaine lettuce into bite-sized pieces.<br>2. Toss lettuce with Caesar dressing in a large bowl.<br>3. Add croutons and toss gently.<br>4. Sprinkle with grated parmesan cheese.<br>5. Season with black pepper and a squeeze of lemon juice.<br>6. Serve immediately.',
                de: '1. Römersalat waschen und in mundgerechte Stücke schneiden.<br>2. Salat mit Caesar-Dressing in einer großen Schüssel mischen.<br>3. Croutons hinzufügen und vorsichtig mischen.<br>4. Mit geriebenem Parmesankäse bestreuen.<br>5. Mit schwarzem Pfeffer und einem Spritzer Zitronensaft würzen.<br>6. Sofort servieren.'
            },
            tags: {
                en: ['salad', 'healthy', 'lunch'],
                de: ['salat', 'gesund', 'mittagessen']
            }
        },
        {
            id: 6,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
            calories: 700,
            carbs: 80,
            protein: 20,
            title: {
                en: 'Chocolate Chip Cookies',
                de: 'Schokoladen-Chip-Kekse'
            },
            description: {
                en: 'Classic homemade chocolate chip cookies, soft and chewy.',
                de: 'Klassische hausgemachte Schokoladen-Chip-Kekse, weich und saftig.'
            },
            ingredients: {
                en: ['2 1/4 cups flour', '1 cup butter', '3/4 cup sugar', '3/4 cup brown sugar', '2 eggs', '1 tsp vanilla', '1 tsp baking soda', '1/2 tsp salt', '2 cups chocolate chips'],
                de: ['2 1/4 Tassen Mehl', '1 Tasse Butter', '3/4 Tasse Zucker', '3/4 Tasse brauner Zucker', '2 Eier', '1 TL Vanille', '1 TL Backpulver', '1/2 TL Salz', '2 Tassen Schokoladenchips']
            },
            instructions: {
                en: '1. Preheat oven to 375°F (190°C).<br>2. Cream together butter and sugars until fluffy.<br>3. Beat in eggs and vanilla.<br>4. Mix in flour, baking soda, and salt.<br>5. Stir in chocolate chips.<br>6. Drop rounded tablespoons onto baking sheets.<br>7. Bake for 9-11 minutes until golden brown.',
                de: '1. Ofen auf 190°C vorheizen.<br>2. Butter und Zucker schaumig rühren.<br>3. Eier und Vanille unterrühren.<br>4. Mehl, Backpulver und Salz einmischen.<br>5. Schokoladenchips unterheben.<br>6. Gehäufte Esslöffel auf Backbleche setzen.<br>7. 9-11 Minuten backen, bis goldbraun.'
            },
            tags: {
                en: ['dessert', 'cookies', 'sweet'],
                de: ['dessert', 'kekse', 'süß']
            }
        },
        {
            id: 7,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
            calories: 350,
            carbs: 45,
            protein: 15,
            title: {
                en: 'Greek Yogurt Bowl',
                de: 'Griechischer Joghurt-Becher'
            },
            description: {
                en: 'Healthy breakfast bowl with Greek yogurt, granola, and fresh fruits.',
                de: 'Gesunder Frühstücksbecher mit griechischem Joghurt, Müsli und frischen Früchten.'
            },
            ingredients: {
                en: ['Greek yogurt', 'Granola', 'Honey', 'Fresh berries', 'Banana', 'Nuts', 'Chia seeds'],
                de: ['Griechischer Joghurt', 'Müsli', 'Honig', 'Frische Beeren', 'Banane', 'Nüsse', 'Chiasamen']
            },
            instructions: {
                en: '1. Spoon Greek yogurt into a bowl.<br>2. Top with granola.<br>3. Add fresh berries and sliced banana.<br>4. Drizzle with honey.<br>5. Sprinkle with nuts and chia seeds.<br>6. Serve immediately.',
                de: '1. Griechischen Joghurt in eine Schüssel löffeln.<br>2. Mit Müsli belegen.<br>3. Frische Beeren und geschnittene Banane hinzufügen.<br>4. Mit Honig beträufeln.<br>5. Mit Nüssen und Chiasamen bestreuen.<br>6. Sofort servieren.'
            },
            tags: {
                en: ['breakfast', 'healthy', 'yogurt'],
                de: ['frühstück', 'gesund', 'joghurt']
            }
        },
        {
            id: 8,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1563379091339-03246963d836?w=400&h=300&fit=crop',
            calories: 550,
            carbs: 60,
            protein: 25,
            title: {
                en: 'Chicken Stir Fry',
                de: 'Hähnchen-Pfannengericht'
            },
            description: {
                en: 'Quick and healthy chicken stir fry with vegetables and soy sauce.',
                de: 'Schnelles und gesundes Hähnchen-Pfannengericht mit Gemüse und Sojasauce.'
            },
            ingredients: {
                en: ['400g chicken breast', 'Mixed vegetables', 'Soy sauce', 'Garlic', 'Ginger', 'Sesame oil', 'Rice', 'Cornstarch'],
                de: ['400g Hähnchenbrust', 'Gemischtes Gemüse', 'Sojasauce', 'Knoblauch', 'Ingwer', 'Sesamöl', 'Reis', 'Maisstärke']
            },
            instructions: {
                en: '1. Cut chicken into bite-sized pieces.<br>2. Heat sesame oil in a wok or large pan.<br>3. Stir-fry chicken until cooked through.<br>4. Add vegetables and stir-fry for 3-4 minutes.<br>5. Add soy sauce, garlic, and ginger.<br>6. Thicken with cornstarch if desired.<br>7. Serve over rice.',
                de: '1. Hähnchen in mundgerechte Stücke schneiden.<br>2. Sesamöl in einem Wok oder großer Pfanne erhitzen.<br>3. Hähnchen unter Rühren braten, bis gar.<br>4. Gemüse hinzufügen und 3-4 Minuten braten.<br>5. Sojasauce, Knoblauch und Ingwer hinzufügen.<br>6. Bei Bedarf mit Maisstärke eindicken.<br>7. Über Reis servieren.'
            },
            tags: {
                en: ['chicken', 'asian', 'dinner', 'healthy'],
                de: ['hähnchen', 'asiatisch', 'abendessen', 'gesund']
            }
        },
        {
            id: 9,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
            calories: 600,
            carbs: 70,
            protein: 20,
            title: {
                en: 'Classic Burger',
                de: 'Klassischer Burger'
            },
            description: {
                en: 'Juicy beef burger with lettuce, tomato, and cheese on a toasted bun.',
                de: 'Saftiger Rindfleisch-Burger mit Salat, Tomate und Käse auf einem gerösteten Brötchen.'
            },
            ingredients: {
                en: ['Beef patty', 'Burger bun', 'Lettuce', 'Tomato', 'Cheese', 'Onion', 'Ketchup', 'Mustard', 'Pickles'],
                de: ['Rindfleisch-Patty', 'Burger-Brötchen', 'Salat', 'Tomate', 'Käse', 'Zwiebel', 'Ketchup', 'Senf', 'Gurken']
            },
            instructions: {
                en: '1. Form beef into patty and season with salt and pepper.<br>2. Grill or pan-fry patty to desired doneness.<br>3. Toast burger bun.<br>4. Place patty on bottom bun.<br>5. Add cheese, lettuce, tomato, and onion.<br>6. Top with condiments and top bun.<br>7. Serve with fries.',
                de: '1. Rindfleisch zu Patty formen und mit Salz und Pfeffer würzen.<br>2. Patty grillen oder braten bis gewünschter Garzustand.<br>3. Burger-Brötchen rösten.<br>4. Patty auf unteres Brötchen legen.<br>5. Käse, Salat, Tomate und Zwiebel hinzufügen.<br>6. Mit Gewürzen und oberem Brötchen belegen.<br>7. Mit Pommes servieren.'
            },
            tags: {
                en: ['burger', 'american', 'dinner'],
                de: ['burger', 'amerikanisch', 'abendessen']
            }
        },
        {
            id: 10,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
            calories: 400,
            carbs: 50,
            protein: 15,
            title: {
                en: 'Pancakes',
                de: 'Pfannkuchen'
            },
            description: {
                en: 'Fluffy homemade pancakes served with maple syrup and butter.',
                de: 'Fluffige hausgemachte Pfannkuchen mit Ahornsirup und Butter.'
            },
            ingredients: {
                en: ['2 cups flour', '2 tbsp sugar', '2 tsp baking powder', '1/2 tsp salt', '2 eggs', '1 3/4 cups milk', '1/4 cup melted butter', 'Maple syrup'],
                de: ['2 Tassen Mehl', '2 EL Zucker', '2 TL Backpulver', '1/2 TL Salz', '2 Eier', '1 3/4 Tassen Milch', '1/4 Tasse geschmolzene Butter', 'Ahornsirup']
            },
            instructions: {
                en: '1. Mix dry ingredients in a bowl.<br>2. Whisk wet ingredients in another bowl.<br>3. Combine wet and dry ingredients.<br>4. Heat griddle or pan over medium heat.<br>5. Pour 1/4 cup batter for each pancake.<br>6. Cook until bubbles form, then flip.<br>7. Serve with maple syrup and butter.',
                de: '1. Trockene Zutaten in einer Schüssel mischen.<br>2. Feuchte Zutaten in einer anderen Schüssel verquirlen.<br>3. Feuchte und trockene Zutaten kombinieren.<br>4. Griddle oder Pfanne bei mittlerer Hitze erhitzen.<br>5. 1/4 Tasse Teig für jeden Pfannkuchen gießen.<br>6. Kochen bis Blasen entstehen, dann wenden.<br>7. Mit Ahornsirup und Butter servieren.'
            },
            tags: {
                en: ['breakfast', 'pancakes', 'sweet'],
                de: ['frühstück', 'pfannkuchen', 'süß']
            }
        },
        {
            id: 11,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop',
            calories: 550,
            carbs: 30,
            protein: 35,
            title: {
                en: 'Fish Tacos',
                de: 'Fisch-Tacos'
            },
            description: {
                en: 'Fresh fish tacos with cabbage slaw and chipotle mayo.',
                de: 'Frische Fisch-Tacos mit Krautsalat und Chipotle-Mayo.'
            },
            ingredients: {
                en: ['400g white fish fillets', 'Corn tortillas', 'Cabbage slaw', 'Chipotle mayo', 'Lime', 'Cilantro', 'Avocado', 'Red onion'],
                de: ['400g weiße Fischfilets', 'Mais-Tortillas', 'Krautsalat', 'Chipotle-Mayo', 'Limette', 'Koriander', 'Avocado', 'Rote Zwiebel']
            },
            instructions: {
                en: '1. Season fish with salt, pepper, and lime juice.<br>2. Grill or pan-fry fish until flaky.<br>3. Warm corn tortillas.<br>4. Break fish into chunks.<br>5. Fill tortillas with fish, cabbage slaw, and chipotle mayo.<br>6. Top with avocado, red onion, and cilantro.<br>7. Serve with lime wedges.',
                de: '1. Fisch mit Salz, Pfeffer und Limettensaft würzen.<br>2. Fisch grillen oder braten, bis er flockig ist.<br>3. Mais-Tortillas erwärmen.<br>4. Fisch in Stücke brechen.<br>5. Tortillas mit Fisch, Krautsalat und Chipotle-Mayo füllen.<br>6. Mit Avocado, roter Zwiebel und Koriander belegen.<br>7. Mit Limettenspalten servieren.'
            },
            tags: {
                en: ['tacos', 'fish', 'mexican', 'dinner'],
                de: ['tacos', 'fisch', 'mexikanisch', 'abendessen']
            }
        },
        {
            id: 12,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
            calories: 600,
            carbs: 25,
            protein: 40,
            title: {
                en: 'Chicken Tacos',
                de: 'Hähnchen-Tacos'
            },
            description: {
                en: 'Spicy chicken tacos with fresh salsa and guacamole.',
                de: 'Würzige Hähnchen-Tacos mit frischer Salsa und Guacamole.'
            },
            ingredients: {
                en: ['400g chicken breast', 'Taco seasoning', 'Corn tortillas', 'Fresh salsa', 'Guacamole', 'Lettuce', 'Cheese', 'Sour cream', 'Lime'],
                de: ['400g Hähnchenbrust', 'Taco-Gewürzmischung', 'Mais-Tortillas', 'Frische Salsa', 'Guacamole', 'Salat', 'Käse', 'Sauerrahm', 'Limette']
            },
            instructions: {
                en: '1. Season chicken with taco seasoning.<br>2. Grill or pan-fry chicken until cooked through.<br>3. Shred chicken into pieces.<br>4. Warm corn tortillas.<br>5. Fill with chicken, salsa, and guacamole.<br>6. Top with lettuce, cheese, and sour cream.<br>7. Serve with lime wedges.',
                de: '1. Hähnchen mit Taco-Gewürzmischung würzen.<br>2. Hähnchen grillen oder braten, bis gar.<br>3. Hähnchen in Stücke zerreißen.<br>4. Mais-Tortillas erwärmen.<br>5. Mit Hähnchen, Salsa und Guacamole füllen.<br>6. Mit Salat, Käse und Sauerrahm belegen.<br>7. Mit Limettenspalten servieren.'
            },
            tags: {
                en: ['tacos', 'chicken', 'mexican', 'dinner'],
                de: ['tacos', 'hähnchen', 'mexikanisch', 'abendessen']
            }
        },
        {
            id: 13,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
            calories: 500,
            carbs: 20,
            protein: 25,
            title: {
                en: 'Veggie Tacos',
                de: 'Gemüse-Tacos'
            },
            description: {
                en: 'Delicious vegetarian tacos with roasted vegetables and black beans.',
                de: 'Leckere vegetarische Tacos mit geröstetem Gemüse und schwarzen Bohnen.'
            },
            ingredients: {
                en: ['Bell peppers', 'Zucchini', 'Onion', 'Black beans', 'Corn tortillas', 'Cheese', 'Salsa', 'Sour cream', 'Cilantro'],
                de: ['Paprika', 'Zucchini', 'Zwiebel', 'Schwarze Bohnen', 'Mais-Tortillas', 'Käse', 'Salsa', 'Sauerrahm', 'Koriander']
            },
            instructions: {
                en: '1. Roast bell peppers, zucchini, and onion in the oven.<br>2. Warm black beans in a pan.<br>3. Warm corn tortillas.<br>4. Fill tortillas with roasted vegetables and beans.<br>5. Top with cheese, salsa, and sour cream.<br>6. Garnish with fresh cilantro.<br>7. Serve immediately.',
                de: '1. Paprika, Zucchini und Zwiebel im Ofen rösten.<br>2. Schwarze Bohnen in einer Pfanne erwärmen.<br>3. Mais-Tortillas erwärmen.<br>4. Tortillas mit geröstetem Gemüse und Bohnen füllen.<br>5. Mit Käse, Salsa und Sauerrahm belegen.<br>6. Mit frischem Koriander garnieren.<br>7. Sofort servieren.'
            },
            tags: {
                en: ['tacos', 'vegetarian', 'mexican', 'dinner'],
                de: ['tacos', 'vegetarisch', 'mexikanisch', 'abendessen']
            }
        },
        {
            id: 14,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
            calories: 650,
            carbs: 30,
            protein: 45,
            title: {
                en: 'Shrimp Tacos',
                de: 'Garnelen-Tacos'
            },
            description: {
                en: 'Fresh shrimp tacos with mango salsa and lime crema.',
                de: 'Frische Garnelen-Tacos mit Mango-Salsa und Limetten-Crema.'
            },
            ingredients: {
                en: ['400g shrimp', 'Corn tortillas', 'Mango salsa', 'Lime crema', 'Cabbage slaw', 'Avocado', 'Cilantro', 'Lime'],
                de: ['400g Garnelen', 'Mais-Tortillas', 'Mango-Salsa', 'Limetten-Crema', 'Krautsalat', 'Avocado', 'Koriander', 'Limette']
            },
            instructions: {
                en: '1. Season shrimp with salt, pepper, and lime juice.<br>2. Grill or pan-fry shrimp until pink and curled.<br>3. Warm corn tortillas.<br>4. Fill tortillas with shrimp.<br>5. Top with mango salsa and lime crema.<br>6. Add cabbage slaw and avocado.<br>7. Garnish with cilantro and lime.',
                de: '1. Garnelen mit Salz, Pfeffer und Limettensaft würzen.<br>2. Garnelen grillen oder braten, bis sie rosa und gekrümmt sind.<br>3. Mais-Tortillas erwärmen.<br>4. Tortillas mit Garnelen füllen.<br>5. Mit Mango-Salsa und Limetten-Crema belegen.<br>6. Krautsalat und Avocado hinzufügen.<br>7. Mit Koriander und Limette garnieren.'
            },
            tags: {
                en: ['tacos', 'shrimp', 'mexican', 'dinner'],
                de: ['tacos', 'garnelen', 'mexikanisch', 'abendessen']
            }
        },
        {
            id: 15,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
            calories: 700,
            carbs: 35,
            protein: 50,
            title: {
                en: 'Pork Tacos',
                de: 'Schweinefleisch-Tacos'
            },
            description: {
                en: 'Slow-cooked pork tacos with pineapple salsa and pickled onions.',
                de: 'Langsam gegarte Schweinefleisch-Tacos mit Ananas-Salsa und eingelegten Zwiebeln.'
            },
            ingredients: {
                en: ['500g pork shoulder', 'Corn tortillas', 'Pineapple salsa', 'Pickled onions', 'Cilantro', 'Lime', 'Chipotle sauce', 'Avocado'],
                de: ['500g Schweineschulter', 'Mais-Tortillas', 'Ananas-Salsa', 'Eingelegte Zwiebeln', 'Koriander', 'Limette', 'Chipotle-Sauce', 'Avocado']
            },
            instructions: {
                en: '1. Season pork with spices and slow cook until tender.<br>2. Shred pork into pieces.<br>3. Warm corn tortillas.<br>4. Fill tortillas with shredded pork.<br>5. Top with pineapple salsa and pickled onions.<br>6. Add chipotle sauce and avocado.<br>7. Garnish with cilantro and lime.',
                de: '1. Schweinefleisch mit Gewürzen würzen und langsam garen, bis zart.<br>2. Schweinefleisch in Stücke zerreißen.<br>3. Mais-Tortillas erwärmen.<br>4. Tortillas mit zerriebenem Schweinefleisch füllen.<br>5. Mit Ananas-Salsa und eingelegten Zwiebeln belegen.<br>6. Chipotle-Sauce und Avocado hinzufügen.<br>7. Mit Koriander und Limette garnieren.'
            },
            tags: {
                en: ['tacos', 'pork', 'mexican', 'dinner'],
                de: ['tacos', 'schweinefleisch', 'mexikanisch', 'abendessen']
            }
        },
        {
            id: 16,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
            calories: 450,
            carbs: 25,
            protein: 30,
            title: {
                en: 'Breakfast Tacos',
                de: 'Frühstücks-Tacos'
            },
            description: {
                en: 'Morning tacos with scrambled eggs, bacon, and fresh salsa.',
                de: 'Morgendliche Tacos mit Rührei, Speck und frischer Salsa.'
            },
            ingredients: {
                en: ['Eggs', 'Bacon', 'Corn tortillas', 'Fresh salsa', 'Cheese', 'Avocado', 'Cilantro', 'Hot sauce'],
                de: ['Eier', 'Speck', 'Mais-Tortillas', 'Frische Salsa', 'Käse', 'Avocado', 'Koriander', 'Scharfe Sauce']
            },
            instructions: {
                en: '1. Cook bacon until crispy.<br>2. Scramble eggs in the same pan.<br>3. Warm corn tortillas.<br>4. Fill tortillas with eggs and bacon.<br>5. Top with fresh salsa and cheese.<br>6. Add avocado and cilantro.<br>7. Serve with hot sauce.',
                de: '1. Speck knusprig braten.<br>2. Eier in derselben Pfanne verrühren.<br>3. Mais-Tortillas erwärmen.<br>4. Tortillas mit Eiern und Speck füllen.<br>5. Mit frischer Salsa und Käse belegen.<br>6. Avocado und Koriander hinzufügen.<br>7. Mit scharfer Sauce servieren.'
            },
            tags: {
                en: ['tacos', 'breakfast', 'eggs', 'morning'],
                de: ['tacos', 'frühstück', 'eier', 'morgen']
            }
        },
        {
            id: 17,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1563379091339-03246963d836?w=400&h=300&fit=crop',
            calories: 550,
            carbs: 60,
            protein: 25,
            title: {
                en: 'Pad Thai',
                de: 'Pad Thai'
            },
            description: {
                en: 'Classic Thai stir-fried noodles with shrimp, tofu, and peanuts.',
                de: 'Klassische thailändische Pfannennudeln mit Garnelen, Tofu und Erdnüssen.'
            },
            ingredients: {
                en: ['Rice noodles', 'Shrimp', 'Tofu', 'Bean sprouts', 'Eggs', 'Peanuts', 'Tamarind sauce', 'Fish sauce', 'Lime'],
                de: ['Reisnudeln', 'Garnelen', 'Tofu', 'Sojasprossen', 'Eier', 'Erdnüsse', 'Tamarindensauce', 'Fischsauce', 'Limette']
            },
            instructions: {
                en: '1. Soak rice noodles in warm water.<br>2. Stir-fry shrimp and tofu until cooked.<br>3. Push to side and scramble eggs.<br>4. Add noodles and tamarind sauce.<br>5. Toss with bean sprouts and peanuts.<br>6. Season with fish sauce and lime.<br>7. Serve with extra peanuts and lime.',
                de: '1. Reisnudeln in warmem Wasser einweichen.<br>2. Garnelen und Tofu unter Rühren braten, bis gar.<br>3. Zur Seite schieben und Eier verrühren.<br>4. Nudeln und Tamarindensauce hinzufügen.<br>5. Mit Sojasprossen und Erdnüssen mischen.<br>6. Mit Fischsauce und Limette würzen.<br>7. Mit extra Erdnüssen und Limette servieren.'
            },
            tags: {
                en: ['thai', 'noodles', 'asian', 'dinner'],
                de: ['thai', 'nudeln', 'asiatisch', 'abendessen']
            }
        },
        {
            id: 18,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop',
            calories: 600,
            carbs: 70,
            protein: 30,
            title: {
                en: 'Sushi Roll',
                de: 'Sushi-Rolle'
            },
            description: {
                en: 'Fresh salmon and avocado sushi roll with rice and nori.',
                de: 'Frische Lachs- und Avocado-Sushi-Rolle mit Reis und Nori.'
            },
            ingredients: {
                en: ['Sushi rice', 'Nori sheets', 'Salmon', 'Avocado', 'Cucumber', 'Rice vinegar', 'Wasabi', 'Soy sauce', 'Pickled ginger'],
                de: ['Sushi-Reis', 'Nori-Blätter', 'Lachs', 'Avocado', 'Gurke', 'Reisessig', 'Wasabi', 'Sojasauce', 'Eingelegter Ingwer']
            },
            instructions: {
                en: '1. Prepare sushi rice with rice vinegar.<br>2. Place nori on bamboo mat.<br>3. Spread rice evenly on nori.<br>4. Add salmon, avocado, and cucumber.<br>5. Roll tightly using bamboo mat.<br>6. Cut into pieces with sharp knife.<br>7. Serve with wasabi, soy sauce, and ginger.',
                de: '1. Sushi-Reis mit Reisessig zubereiten.<br>2. Nori auf Bambusmatte legen.<br>3. Reis gleichmäßig auf Nori verteilen.<br>4. Lachs, Avocado und Gurke hinzufügen.<br>5. Mit Bambusmatte fest rollen.<br>6. Mit scharfem Messer in Stücke schneiden.<br>7. Mit Wasabi, Sojasauce und Ingwer servieren.'
            },
            tags: {
                en: ['sushi', 'japanese', 'asian', 'dinner'],
                de: ['sushi', 'japanisch', 'asiatisch', 'abendessen']
            }
        },
        {
            id: 19,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
            calories: 450,
            carbs: 50,
            protein: 20,
            title: {
                en: 'Greek Salad',
                de: 'Griechischer Salat'
            },
            description: {
                en: 'Fresh Greek salad with feta cheese, olives, and Mediterranean vegetables.',
                de: 'Frischer griechischer Salat mit Feta-Käse, Oliven und mediterranem Gemüse.'
            },
            ingredients: {
                en: ['Cucumber', 'Tomatoes', 'Red onion', 'Feta cheese', 'Kalamata olives', 'Olive oil', 'Lemon juice', 'Oregano', 'Salt'],
                de: ['Gurke', 'Tomaten', 'Rote Zwiebel', 'Feta-Käse', 'Kalamata-Oliven', 'Olivenöl', 'Zitronensaft', 'Oregano', 'Salz']
            },
            instructions: {
                en: '1. Chop cucumber, tomatoes, and red onion.<br>2. Combine vegetables in a bowl.<br>3. Add crumbled feta cheese.<br>4. Add kalamata olives.<br>5. Drizzle with olive oil and lemon juice.<br>6. Season with oregano and salt.<br>7. Toss gently and serve.',
                de: '1. Gurke, Tomaten und rote Zwiebel hacken.<br>2. Gemüse in einer Schüssel mischen.<br>3. Zerbröckelten Feta-Käse hinzufügen.<br>4. Kalamata-Oliven hinzufügen.<br>5. Mit Olivenöl und Zitronensaft beträufeln.<br>6. Mit Oregano und Salz würzen.<br>7. Vorsichtig mischen und servieren.'
            },
            tags: {
                en: ['salad', 'greek', 'mediterranean', 'healthy'],
                de: ['salat', 'griechisch', 'mediterran', 'gesund']
            }
        },
        {
            id: 20,
            isUserRecipe: false,
            image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
            calories: 350,
            carbs: 40,
            protein: 10,
            title: {
                en: 'Apple Pie',
                de: 'Apfelkuchen'
            },
            description: {
                en: 'Classic American apple pie with flaky crust and cinnamon-spiced apples.',
                de: 'Klassischer amerikanischer Apfelkuchen mit mürbem Teig und zimtgewürzten Äpfeln.'
            },
            ingredients: {
                en: ['Pie crust', 'Apples', 'Sugar', 'Cinnamon', 'Nutmeg', 'Butter', 'Lemon juice', 'Egg wash'],
                de: ['Kuchenteig', 'Äpfel', 'Zucker', 'Zimt', 'Muskatnuss', 'Butter', 'Zitronensaft', 'Eistreiche']
            },
            instructions: {
                en: '1. Prepare pie crust and chill.<br>2. Peel and slice apples thinly.<br>3. Mix apples with sugar, cinnamon, and nutmeg.<br>4. Line pie dish with crust.<br>5. Fill with apple mixture and dot with butter.<br>6. Cover with top crust and brush with egg wash.<br>7. Bake at 375°F for 45-50 minutes.',
                de: '1. Kuchenteig zubereiten und kühlen.<br>2. Äpfel schälen und dünn schneiden.<br>3. Äpfel mit Zucker, Zimt und Muskatnuss mischen.<br>4. Kuchenform mit Teig auslegen.<br>5. Mit Apfelmischung füllen und mit Butter belegen.<br>6. Mit oberem Teig bedecken und mit Eistreiche bestreichen.<br>7. Bei 190°C 45-50 Minuten backen.'
            },
            tags: {
                en: ['dessert', 'pie', 'american', 'sweet'],
                de: ['dessert', 'kuchen', 'amerikanisch', 'süß']
            }
        }
    ];

    // --- Basic Functions ---
    const createRecipeCard = (recipe) => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.dataset.id = recipe.id;
        
        const isFavorite = favoriteRecipes.includes(recipe.id.toString());
        const title = recipe.title[currentLanguage] || recipe.title.en;
        const description = recipe.description[currentLanguage] || recipe.description.en;

        card.innerHTML = `
            <img src="${recipe.image}" alt="${title}" loading="lazy">
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="card-icons">
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-recipe-id="${recipe.id}">
                    <i class="fas fa-heart"></i>
                </button>
                ${recipe.isUserRecipe ? `<button class="delete-btn" data-recipe-id="${recipe.id}">
                    <i class="fas fa-trash"></i>
                </button>` : ''}
            </div>
        `;

        return card;
    };

    const renderRecipes = (recipes) => {
        console.log('Rendering recipes:', recipes.length);
        console.log('Recipe IDs:', recipes.map(r => r.id));
        
        // Clear the entire grid first
        recipeGrid.innerHTML = '';
        
        // Add all the recipe cards
        recipes.forEach(recipe => {
            const card = createRecipeCard(recipe);
            recipeGrid.appendChild(card);
        });
        
        console.log('Final recipe grid children:', recipeGrid.children.length);
    };

    const renderShoppingList = () => {
        if (!shoppingListContainer) return;
        
        shoppingListContainer.innerHTML = '';
        
        if (shoppingList.length === 0) {
            shoppingListContainer.innerHTML = '<li class="empty-list">Your shopping list is empty</li>';
            return;
        }
        
        shoppingList.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item}</span>
                <button class="remove-item-btn" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            shoppingListContainer.appendChild(li);
        });
    };

    // --- Tag Selection Functions ---
    const getAllExistingTags = () => {
        const allTags = new Set();
        
        // Get tags from initial recipes
        initialRecipes.forEach(recipe => {
            const tags = recipe.tags[currentLanguage] || recipe.tags.en;
            tags.forEach(tag => allTags.add(tag));
        });
        
        // Get tags from custom recipes
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
        customRecipes.forEach(recipe => {
            const tags = recipe.tags[currentLanguage] || recipe.tags.en;
            tags.forEach(tag => allTags.add(tag));
        });
        
        return Array.from(allTags).sort();
    };

    const populateExistingTags = () => {
        if (!existingTagsContainer) return;
        
        existingTagsContainer.innerHTML = '';
        const allTags = getAllExistingTags();
        
        allTags.forEach(tag => {
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
        if (!selectedTagsContainer) return;
        
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
        if (!existingTagsContainer) return;
        
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
    if (searchBar) {
        searchBar.addEventListener('input', () => {
            const searchTerm = searchBar.value.toLowerCase();
            const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
            let filteredRecipes = [...initialRecipes, ...customRecipes];

            if (searchTerm) {
                filteredRecipes = filteredRecipes.filter(recipe => {
                    const title = recipe.title[currentLanguage] || recipe.title.en;
                    const ingredients = recipe.ingredients[currentLanguage] || recipe.ingredients.en;
                    
                    const titleMatch = title.toLowerCase().includes(searchTerm);
                    const ingredientsMatch = ingredients.some(ing => ing.toLowerCase().includes(searchTerm));
                    return titleMatch || ingredientsMatch;
                });
            }
            
            renderRecipes(filteredRecipes);
        });
    }

    // Filter buttons
    if (filterTagsContainer) {
        filterTagsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-tag')) {
                console.log('Filter clicked:', e.target.dataset.filter);
                
                // Remove active class from all filter tags and favorites button
                filterTagsContainer.querySelectorAll('.filter-tag').forEach(tag => {
                    tag.classList.remove('active');
                });
                if (favoritesBtn) {
                    favoritesBtn.classList.remove('active');
                }
                
                // Add active class to clicked tag
                e.target.classList.add('active');
                
                // Simple filter logic
                const filter = e.target.dataset.filter;
                const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
                let filteredRecipes = [...initialRecipes, ...customRecipes];

                if (filter !== 'all') {
                    filteredRecipes = filteredRecipes.filter(recipe => {
                        const tags = recipe.tags[currentLanguage] || recipe.tags.en;
                        return tags.some(tag => tag.toLowerCase() === filter.toLowerCase());
                    });
                }
                // If filter is 'all', show all recipes (no filtering)
                
                console.log('Filtered recipes count:', filteredRecipes.length);
                renderRecipes(filteredRecipes);
            }
        });
    }

    // Favorites button
    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', () => {
            console.log('Favorites clicked');
            const isActive = favoritesBtn.classList.contains('active');
            
            // Remove active class from all filter tags
            if (filterTagsContainer) {
                filterTagsContainer.querySelectorAll('.filter-tag').forEach(tag => {
                    tag.classList.remove('active');
                });
            }
            
            if (!isActive) {
                favoritesBtn.classList.add('active');
                const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
                let filteredRecipes = [...initialRecipes, ...customRecipes];
                filteredRecipes = filteredRecipes.filter(recipe => {
                    return favoriteRecipes.includes(recipe.id.toString());
                });
                renderRecipes(filteredRecipes);
            } else {
                // Switch back to "All"
                const allButton = filterTagsContainer ? filterTagsContainer.querySelector('[data-filter="all"]') : null;
                if (allButton) {
                    allButton.classList.add('active');
                    const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
                    const allRecipes = [...initialRecipes, ...customRecipes];
                    renderRecipes(allRecipes);
                }
            }
        });
    }

    // Recipe grid clicks
    if (recipeGrid) {
        console.log('Recipe grid event listener attached');
        recipeGrid.addEventListener('click', (e) => {
            console.log('Recipe grid clicked, target:', e.target);
            console.log('Closest recipe card:', e.target.closest('.recipe-card'));
            
            const favoriteBtn = e.target.closest('.favorite-btn');
            if (favoriteBtn) {
                console.log('Favorite button clicked');
                const recipeId = favoriteBtn.dataset.recipeId;
                const index = favoriteRecipes.indexOf(recipeId);
                
                if (index > -1) {
                    favoriteRecipes.splice(index, 1);
                    favoriteBtn.classList.remove('active');
                } else {
                    favoriteRecipes.push(recipeId);
                    favoriteBtn.classList.add('active');
                }
                
                localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
                return;
            }

            const card = e.target.closest('.recipe-card');
            console.log('Card found:', card);
            console.log('Card classes:', card ? card.className : 'no card');
            
            if (card) {
                console.log('Recipe card clicked:', card.dataset.id);
                const recipeId = card.dataset.id;
                const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
                const allRecipes = [...initialRecipes, ...customRecipes];
                const recipe = allRecipes.find(r => r.id.toString() === recipeId);
                
                console.log('Found recipe:', recipe);
                console.log('Detail modal exists:', !!detailModal);
                console.log('Modal content exists:', !!modalContent);
                
                if (recipe && detailModal && modalContent) {
                    console.log('=== RECIPE MODAL DEBUG ===');
                    console.log('Recipe type:', recipe.isUserRecipe ? 'USER RECIPE' : 'CORE RECIPE');
                    console.log('Recipe ID:', recipe.id);
                    console.log('Recipe title:', recipe.title[currentLanguage] || recipe.title.en);
                    console.log('Full recipe object:', recipe);
                    console.log('Raw ingredients:', recipe.ingredients);
                    console.log('Ingredients for current language:', recipe.ingredients[currentLanguage]);
                    console.log('Ingredients for English:', recipe.ingredients.en);
                    console.log('Current language:', currentLanguage);
                    
                    const title = recipe.title[currentLanguage] || recipe.title.en;
                    const ingredients = recipe.ingredients[currentLanguage] || recipe.ingredients.en;
                    const instructions = recipe.instructions[currentLanguage] || recipe.instructions.en;
                    
                    console.log('Processed title:', title);
                    console.log('Processed ingredients:', ingredients);
                    console.log('Processed instructions:', instructions);
                    console.log('Ingredients type:', typeof ingredients);
                    console.log('Ingredients is array:', Array.isArray(ingredients));
                    console.log('Ingredients length:', ingredients ? ingredients.length : 'undefined');
                    
                    // Ensure ingredients is an array
                    const ingredientsArray = Array.isArray(ingredients) ? ingredients : [];
                    console.log('Final ingredients array:', ingredientsArray);
                    
                    const modalHTML = `
                        <span class="close-btn">&times;</span>
                        <h2>${title}</h2>
                        <img src="${recipe.image}" alt="${title}" style="width:100%; max-width:400px; border-radius:8px;" loading="lazy">
                        
                        <h3 data-key="modalIngredients">${translations[currentLanguage]?.modalIngredients || translations.en.modalIngredients}</h3>
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
                            <span>${translations[currentLanguage]?.add_all_ingredients || translations.en.add_all_ingredients}</span>
                        </button>

                        <h3 data-key="modalInstructions">${translations[currentLanguage]?.modalInstructions || translations.en.modalInstructions}</h3>
                        <p>${instructions}</p>

                        <h3 data-key="modalNutrition">${translations[currentLanguage]?.modalNutrition || translations.en.modalNutrition}</h3>
                        <p class="nutrition-note" data-key="nutritionServingNote">${translations[currentLanguage]?.nutritionServingNote || translations.en.nutritionServingNote}</p>
                        <ul>
                            <li><span data-key="calories">${translations[currentLanguage]?.calories || translations.en.calories}</span>: ${recipe.calories} kcal</li>
                            <li><span data-key="carbs">${translations[currentLanguage]?.carbs || translations.en.carbs}</span>: ${recipe.carbs}g</li>
                            <li><span data-key="protein">${translations[currentLanguage]?.protein || translations.en.protein}</span>: ${recipe.protein}g</li>
                        </ul>
                    `;
                    
                    console.log('Generated modal HTML:', modalHTML);
                    modalContent.innerHTML = modalHTML;
                    
                    detailModal.style.display = 'block';
                    
                    // Add event listener for the close button (dynamically created)
                    const closeBtn = modalContent.querySelector('.close-btn');
                    if (closeBtn) {
                        closeBtn.addEventListener('click', () => {
                            detailModal.style.display = 'none';
                        });
                    }
                    
                    // Add event listeners for individual ingredient buttons
                    const addIngredientBtns = modalContent.querySelectorAll('.add-ingredient-btn');
                    addIngredientBtns.forEach(btn => {
                        btn.addEventListener('click', () => {
                            const ingredient = btn.dataset.ingredient;
                            
                            if (!shoppingList.includes(ingredient)) {
                                shoppingList.push(ingredient);
                                localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
                                renderShoppingList();
                                
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
                            const recipeId = addAllBtn.dataset.recipeId;
                            const recipeToAdd = allRecipes.find(r => r.id.toString() === recipeId);
                            
                            if (recipeToAdd) {
                                const ingredients = recipeToAdd.ingredients[currentLanguage] || recipeToAdd.ingredients.en;
                                
                                // Add each ingredient to shopping list
                                ingredients.forEach(ingredient => {
                                    if (!shoppingList.includes(ingredient)) {
                                        shoppingList.push(ingredient);
                                    }
                                });
                                
                                // Save to localStorage
                                localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
                                
                                // Update shopping list display
                                renderShoppingList();
                                
                                // Update all individual buttons to show added
                                addIngredientBtns.forEach(btn => {
                                    btn.innerHTML = '<i class="fas fa-check"></i>';
                                    btn.classList.add('added');
                                    btn.disabled = true;
                                });
                                
                                // Show confirmation
                                alert('All ingredients added to shopping list!');
                            }
                        });
                    }
                }
            }
        });
    }

    // Add recipe card click
    if (floatingAddBtn) {
        floatingAddBtn.addEventListener('click', () => {
            if (addRecipeModal) {
                addRecipeModal.style.display = 'block';
                populateExistingTags();
                resetTagSelection();
            }
        });
    }

    if (detailModal) {
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) {
                detailModal.style.display = 'none';
            }
        });
    }

    // Add recipe modal
    if (closeAddModalBtn) {
        closeAddModalBtn.addEventListener('click', () => {
            if (addRecipeModal) {
                addRecipeModal.style.display = 'none';
            }
        });
    }

    if (addRecipeModal) {
        addRecipeModal.addEventListener('click', (e) => {
            if (e.target === addRecipeModal) {
                addRecipeModal.style.display = 'none';
            }
        });
    }

    // Shopping list
    if (clearListBtn) {
        clearListBtn.addEventListener('click', () => {
            shoppingList = [];
            localStorage.removeItem('shoppingList');
            renderShoppingList();
        });
    }

    if (shareListBtn) {
        shareListBtn.addEventListener('click', () => {
            if (shoppingList.length === 0) {
                alert('Your shopping list is empty!');
                return;
            }

            const listText = 'Shopping List:\n' + shoppingList.map((item, index) => `${index + 1}. ${item}`).join('\n');
            
            // Try to use native sharing if available
            if (navigator.share) {
                navigator.share({
                    title: 'My Shopping List',
                    text: listText
                }).catch(err => {
                    // Fallback to clipboard copy
                    copyToClipboard(listText);
                });
            } else {
                // Fallback to clipboard copy
                copyToClipboard(listText);
            }
        });
    }

    // Helper function to copy text to clipboard
    const copyToClipboard = (text) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                // Silent copy - no alert
            }).catch(() => {
                // Fallback for older browsers
                fallbackCopyToClipboard(text);
            });
        } else {
            // Fallback for older browsers
            fallbackCopyToClipboard(text);
        }
    };

    // Silent copy function (no popup)
    const copyToClipboardSilent = (text) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).catch(() => {
                // Fallback for older browsers
                fallbackCopyToClipboardSilent(text);
            });
        } else {
            // Fallback for older browsers
            fallbackCopyToClipboardSilent(text);
        }
    };

    const fallbackCopyToClipboard = (text) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            // Silent copy - no alert
        } catch (err) {
            alert('Could not copy to clipboard. Here is your list:\n\n' + text);
        }
        document.body.removeChild(textArea);
    };

    const fallbackCopyToClipboardSilent = (text) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            // Silent fail
        }
        document.body.removeChild(textArea);
    };

    // Language switcher
    if (languageSwitcher) {
        languageSwitcher.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            localStorage.setItem('recipeAppLanguage', currentLanguage);
            
            // Re-render recipes with new language
            const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
            const allRecipes = [...initialRecipes, ...customRecipes];
            renderRecipes(allRecipes);
        });
    }

    // Helper function to show custom popup
    const showPopup = (title, message) => {
        popupTitle.textContent = title;
        popupMessage.textContent = message;
        popupModal.style.display = 'block';
        document.body.classList.add('popup-open');
    };

    // Helper function to hide custom popup
    const hidePopup = () => {
        popupModal.style.display = 'none';
        document.body.classList.remove('popup-open');
    };

    // Popup close event listeners
    if (popupOkBtn) {
        popupOkBtn.addEventListener('click', hidePopup);
    }

    if (popupModal) {
        popupModal.addEventListener('click', (e) => {
            if (e.target === popupModal) {
                hidePopup();
            }
        });
    }

    if (copyListBtn) {
        copyListBtn.addEventListener('click', () => {
            if (shoppingList.length === 0) {
                showPopup('Empty List', 'Your shopping list is empty!');
                return;
            }

            const listText = 'Shopping List:\n' + shoppingList.map((item, index) => `${index + 1}. ${item}`).join('\n');
            copyToClipboardSilent(listText);
            showPopup('Success!', 'Shopping list copied to clipboard!');
        });
    }

    // Form submission
    if (addRecipeForm) {
        addRecipeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const ingredientsInput = document.getElementById('form-ingredients').value;
            const processedIngredients = ingredientsInput.split(',').map(i => i.trim()).filter(i => i.length > 0);
            
            console.log('Ingredients input:', ingredientsInput);
            console.log('Processed ingredients:', processedIngredients);
            
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
                    en: processedIngredients,
                    de: processedIngredients
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
            
            console.log('New recipe being saved:', newRecipe);
            
            const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
            customRecipes.push(newRecipe);
            localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
            
            addRecipeForm.reset();
            resetTagSelection();
            addRecipeModal.style.display = 'none';
            
            // Re-render recipes to show the new one
            const allRecipes = [...initialRecipes, ...customRecipes];
            renderRecipes(allRecipes);
            
            // Show success message
            alert('Recipe added successfully!');
        });
    }

    // Custom tag button event listener
    if (addCustomTagBtn) {
        addCustomTagBtn.addEventListener('click', addCustomTag);
    }

    // --- Initialization ---
    const init = () => {
        console.log('Initializing app...');
        
        if (languageSwitcher) {
            languageSwitcher.value = currentLanguage;
        }
        
        renderShoppingList();
        
        // Render all recipes initially
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
        const allRecipes = [...initialRecipes, ...customRecipes];
        renderRecipes(allRecipes);
        
        // Test: Check if recipe cards are properly created
        setTimeout(() => {
            const recipeCards = document.querySelectorAll('.recipe-card:not(.add-your-own)');
            console.log('Recipe cards found after render:', recipeCards.length);
            recipeCards.forEach((card, index) => {
                console.log(`Card ${index}:`, {
                    id: card.dataset.id,
                    classes: card.className,
                    hasDataId: !!card.dataset.id
                });
            });
        }, 100);
        
        console.log('App initialized successfully');
    };

    init();
}); 