// récup les données des fichiers JSON
async function loadData() {
  try {
    const recipeRes = await fetch('data/recipe.json');
    const recipe = await recipeRes.json();
    
    const productsRes = await fetch('data/products.json');
    const products = await productsRes.json();
    
    // afficher la recette
    displayRecipe(recipe, products);
    
    // calculer et afficher le nutriscore moyen
    const avgScore = calculateNutriscore(recipe.ingredients, products);
    displayNutriscoreScore(avgScore);
    
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
  }
}

// convertir le grade nutriscore en chiffre
function gradeToNumber(grade) {
  const mapping = {
    'A': 1,
    'B': 2,
    'C': 3,
    'D': 4,
    'E': 5
  };
  return mapping[grade.toUpperCase()] || 0;
}

// calculer la moyenne des nutriscores
function calculateNutriscore(ingredients, products) {
  let total = 0;
  let count = 0;
  
  ingredients.forEach(ingredientName => {
    const product = products.find(p => p.name.toLowerCase() === ingredientName.toLowerCase());
    if (product) {
      total += gradeToNumber(product.nutriscore);
      count++;
    }
  });
  
  if (count === 0) return 0;
  return total / count;
}

// convertir la moyenne en grade
function numberToGrade(avg) {
  if (avg <= 1.5) return 'A';
  if (avg <= 2.5) return 'B';
  if (avg <= 3.5) return 'C';
  if (avg <= 4.5) return 'D';
  return 'E';
}

// afficher le score nutriscore dans le header
function displayNutriscoreScore(avgScore) {
  const grade = numberToGrade(avgScore);
  const scoreDiv = document.getElementById('nutrition-score');
  
  // définir couleur selon le grade
  let color = '#28a745'; // A - vert
  if (grade === 'B') color = '#ffc107';
  if (grade === 'C') color = '#fd7e14';
  if (grade === 'D') color = '#dc3545';
  if (grade === 'E') color = '#721c24';
  
  scoreDiv.innerHTML = `
    <div class="d-inline-block p-3 rounded-circle" style="background-color: ${color}; width: 100px; height: 100px;">
      <div style="color: white; font-size: 3rem; font-weight: bold;">
        ${grade}
      </div>
    </div>
    <p class="mt-2" style="color: var(--ocean-dark);">Score nutritionnel moyen</p>
  `;
}

// afficher la liste des ingrédients
function displayRecipe(recipe, products) {
  const productList = document.getElementById('productList');
  
  recipe.ingredients.forEach(ingredientName => {
    const product = products.find(p => p.name.toLowerCase() === ingredientName.toLowerCase());
    
    let grade = 'N/A';
    let color = '#999';
    if (product) {
      grade = product.nutriscore;
      // couleur selon le grade
      if (grade === 'A') color = '#28a745';
      if (grade === 'B') color = '#ffc107';
      if (grade === 'C') color = '#fd7e14';
      if (grade === 'D') color = '#dc3545';
      if (grade === 'E') color = '#721c24';
    }
    
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4';
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title text-capitalize">${ingredientName}</h5>
          <div class="d-flex align-items-center gap-2">
            <span>Nutriscore:</span>
            <span class="badge" style="background-color: ${color}; font-size: 1rem;">
              ${grade}
            </span>
          </div>
        </div>
      </div>
    `;
    productList.appendChild(card);
  });
  
  // afficher les étapes
  const stepsList = document.getElementById('steps');
  recipe.steps.forEach((step, index) => {
    const item = document.createElement('div');
    item.className = 'list-group-item';
    item.innerHTML = `
      <strong>Étape ${index + 1}:</strong> ${step}
    `;
    stepsList.appendChild(item);
  });
}

// lancer au chargement de la page
document.addEventListener('DOMContentLoaded', loadData);
