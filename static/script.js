document.addEventListener("DOMContentLoaded", () => {
    const ingredientInput = document.getElementById("ingredientInput");
    const chipContainer = document.getElementById("chipContainer");
    const searchBtn = document.getElementById("searchBtn");
    const resultsGrid = document.getElementById("resultsGrid");
    const loading = document.getElementById("loading");
    const resultsSection = document.getElementById("resultsSection");
    const resultsCount = document.getElementById("resultsCount");
    const rerankBtn = document.getElementById("rerankBtn");

    if (!ingredientInput) return; // This script only runs on the search page.

    const quickIngredientButtons = document.querySelectorAll("[data-ingredient]");
    let ingredients = [];
    let currentResults = [];

    function renderChips() {
        chipContainer.querySelectorAll(".chip").forEach(chip => chip.remove());

        ingredients.forEach(ingredient => {
            const chip = document.createElement("div");
            chip.className = "chip";

            const text = document.createElement("span");
            text.textContent = ingredient;

            const closeBtn = document.createElement("button");
            closeBtn.type = "button";
            closeBtn.className = "chip-close";
            closeBtn.setAttribute("aria-label", `Remove ${ingredient}`);
            closeBtn.textContent = "×";
            closeBtn.onclick = () => {
                ingredients = ingredients.filter(item => item !== ingredient);
                renderChips();
            };

            chip.appendChild(text);
            chip.appendChild(closeBtn);
            chipContainer.insertBefore(chip, ingredientInput);
        });
    }

    function addIngredient(rawValue) {
        const ingredient = rawValue.trim().replace(/,/g, "").toLowerCase();
        if (ingredient && !ingredients.includes(ingredient)) {
            ingredients.push(ingredient);
            renderChips();
        }
        ingredientInput.value = "";
    }

    function readFilters() {
        return {
            diet: document.getElementById("filterDiet").value,
            intolerances: document.getElementById("filterIntolerances").value,
            type: document.getElementById("filterType").value,
            maxMissing: parseInt(document.getElementById("filterMaxMissing").value, 10),
            maxReadyTime: parseInt(document.getElementById("filterMaxReadyTime").value, 10),
            sortBy: document.getElementById("filterSort").value
        };
    }

    function score(recipe, field) {
        return Number(recipe[field] || 0);
    }

    function applyResultPreferences(results) {
        const filters = readFilters();
        let ranked = [...results];

        if (filters.maxMissing !== -1) {
            ranked = ranked.filter(recipe => recipe.missedIngredientCount <= filters.maxMissing);
        }

        if (filters.maxReadyTime !== -1) {
            ranked = ranked.filter(recipe => !recipe.readyInMinutes || recipe.readyInMinutes <= filters.maxReadyTime);
        }

        ranked.sort((a, b) => {
            if (filters.sortBy === "fastest") {
                return score(a, "readyInMinutes") - score(b, "readyInMinutes");
            }
            if (filters.sortBy === "healthiest") {
                return score(b, "healthScore") - score(a, "healthScore");
            }
            if (filters.sortBy === "popular") {
                return score(b, "spoonacularScore") - score(a, "spoonacularScore");
            }
            if (filters.sortBy === "fewest-missing") {
                return a.missedIngredientCount - b.missedIngredientCount;
            }

            // Best match favors recipes that use more of the user's ingredients,
            // need fewer missing ingredients, and have stronger API scores.
            return (
                (a.missedIngredientCount - b.missedIngredientCount) ||
                (b.usedIngredientCount - a.usedIngredientCount) ||
                (score(b, "healthScore") - score(a, "healthScore")) ||
                (score(b, "spoonacularScore") - score(a, "spoonacularScore"))
            );
        });

        return ranked;
    }

    function updateResultsCount(visibleCount, totalCount) {
        if (totalCount === 0) {
            resultsCount.textContent = "No recipes matched your search.";
            return;
        }
        resultsCount.textContent = `Showing ${visibleCount} of ${totalCount} recipe matches`;
    }

    function formatIngredientNames(items) {
        if (!items || items.length === 0) return "None listed";
        return items.slice(0, 3).map(item => item.name).join(", ");
    }

    function renderRecipes(recipes) {
        resultsGrid.innerHTML = "";
        resultsSection.classList.remove("hidden");
        rerankBtn.classList.toggle("hidden", currentResults.length === 0);
        updateResultsCount(recipes.length, currentResults.length);

        if (recipes.length === 0) {
            resultsGrid.innerHTML = "<div class='empty-state'>No recipes found with those filters. Try a different ingredient mix or loosen the advanced filters.</div>";
            return;
        }

        recipes.forEach(recipe => {
            const card = document.createElement("div");
            card.className = "recipe-card";

            const backdrop = document.createElement("div");
            backdrop.className = "recipe-backdrop";

            const img = document.createElement("img");
            img.src = recipe.image;
            img.className = "recipe-img";
            img.alt = recipe.title;

            const content = document.createElement("div");
            content.className = "recipe-content";

            const matchBadge = document.createElement("p");
            matchBadge.className = "match-badge";
            matchBadge.textContent = recipe.missedIngredientCount === 0 ? "Ready from your fridge" : `Needs ${recipe.missedIngredientCount} more`;

            const title = document.createElement("h3");
            title.className = "recipe-title";
            title.textContent = recipe.title;

            const facts = document.createElement("div");
            facts.className = "recipe-card-facts";
            facts.innerHTML = `
                <span>${recipe.readyInMinutes || "?"} min</span>
                <span>${recipe.servings || "?"} servings</span>
                <span>${Math.round(recipe.healthScore || 0)}/100 health</span>
            `;

            const usedCount = document.createElement("p");
            usedCount.className = "used-ingredients";
            usedCount.textContent = `Using ${recipe.usedIngredientCount} ingredient(s): ${formatIngredientNames(recipe.usedIngredients)}`;

            const missedCount = document.createElement("p");
            missedCount.className = "missing-ingredients";
            missedCount.textContent = `Missing: ${formatIngredientNames(recipe.missedIngredients)}`;

            const actions = document.createElement("div");
            actions.className = "card-actions";

            const viewLink = document.createElement("a");
            viewLink.className = "btn-fresh";
            viewLink.href = `/recipe/${recipe.id}`;
            viewLink.setAttribute("aria-label", `View recipe for ${recipe.title}`);
            viewLink.innerHTML = `
                <span class="btn-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 5c-4.5 0-8.3 2.8-10 7 1.7 4.2 5.5 7 10 7s8.3-2.8 10-7c-1.7-4.2-5.5-7-10-7zm0 11.5A4.5 4.5 0 1 1 12 7a4.5 4.5 0 0 1 0 9.5zm0-1.8A2.7 2.7 0 1 0 12 9a2.7 2.7 0 0 0 0 5.7z"/></svg>
                </span>
                View Recipe
            `;

            const favBtn = document.createElement("button");
            favBtn.type = "button";
            favBtn.className = "btn-pill btn-save";
            favBtn.textContent = "Save";
            favBtn.onclick = () => saveFavourite(recipe, favBtn);

            actions.appendChild(viewLink);
            actions.appendChild(favBtn);

            content.appendChild(matchBadge);
            content.appendChild(title);
            content.appendChild(facts);
            content.appendChild(usedCount);
            content.appendChild(missedCount);
            content.appendChild(actions);

            card.appendChild(img);
            card.appendChild(backdrop);
            card.appendChild(content);
            resultsGrid.appendChild(card);
        });
    }

    async function saveFavourite(recipe, btnElement) {
        try {
            const res = await fetch("/api/favourite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipe_id: recipe.id,
                    title: recipe.title,
                    image: recipe.image
                })
            });
            const data = await res.json();
            if (data.success) {
                btnElement.textContent = "Saved!";
                btnElement.disabled = true;
                btnElement.classList.add("saved");
            } else {
                alert(data.message);
            }
        } catch (e) {
            alert("Failed to save recipe");
        }
    }

    ingredientInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addIngredient(ingredientInput.value);
        }
    });

    quickIngredientButtons.forEach(button => {
        button.addEventListener("click", () => addIngredient(button.dataset.ingredient));
    });

    rerankBtn.addEventListener("click", () => {
        renderRecipes(applyResultPreferences(currentResults));
    });

    searchBtn.addEventListener("click", async () => {
        addIngredient(ingredientInput.value);

        if (ingredients.length === 0) {
            alert("Please add at least one ingredient");
            return;
        }

        const filters = readFilters();
        loading.classList.remove("hidden");
        resultsGrid.innerHTML = "";
        resultsCount.textContent = "Searching the recipe database...";

        try {
            const res = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ingredients,
                    diet: filters.diet,
                    intolerances: filters.intolerances,
                    type: filters.type,
                    maxReadyTime: filters.maxReadyTime === -1 ? null : filters.maxReadyTime
                })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch recipes");
            }

            currentResults = data;
            renderRecipes(applyResultPreferences(currentResults));
            resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            loading.classList.add("hidden");
        }
    });
});
