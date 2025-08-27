// Load meals from API
const loadData = (global) => {
  const searchText = document.getElementById("search-box").value.trim();

  fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${
      searchText ? searchText : global
    }`
  )
    .then((res) => res.json())
    .then((data) => displayData(data.meals))
    .catch((err) => console.log("Error loading meals:", err));
};

// Display meals as cards
const displayData = (data) => {
  const mealsContainer = document.getElementById("meals-container");
  mealsContainer.innerHTML = ""; // Clear previous results

  if (!data) {
    document.getElementById("total-product").innerText = 0;
    mealsContainer.innerHTML =
      "<h3 class='text-center text-danger'>No meals found ❌</h3>";
    return;
  }

  document.getElementById("total-product").innerText = data.length;

  data.forEach((meal) => {
    const card = document.createElement("div");
    card.classList.add("col-md-4", "col-sm-6", "col-12");

    card.innerHTML = `
      <div class="box">
        <img class="box-img" src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h2>${meal.strMeal}</h2>
        <p>${meal.strInstructions.slice(0, 70)}...</p>
        <button onclick="displayModal('${meal.idMeal}')"
          type="button"
          class="btn btn-info mb-3"
          data-bs-toggle="modal"
          data-bs-target="#mealModal">
          🍽️ Details
        </button>
      </div>
    `;

    mealsContainer.appendChild(card);
  });
};

// Show details in modal
const displayModal = async (id) => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await response.json();
    const meal = data.meals[0];

    // Fill modal content
    document.getElementById("mealModalLabel").innerText = meal.strMeal;

    document.getElementById("modal-content-body").innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid">
      <p><strong>Category:</strong> ${meal.strCategory}</p>
      <p><strong>Area:</strong> ${meal.strArea}</p>
      <p><strong>Instructions:</strong> ${meal.strInstructions.slice(0, 200)}...</p>
      ${
        meal.strYoutube
          ? `<a href="${meal.strYoutube}" target="_blank" class="btn btn-danger mt-2">▶ Watch on YouTube</a>`
          : ""
      }
    `;
  } catch (err) {
    console.log("Error loading modal data:", err);
  }
};

// Load default meals (letter "a")
loadData("b");
