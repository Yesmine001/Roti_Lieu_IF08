const FIELDS = "product_name,nutriscore_grade,nutriscore_score,image_front_small_url";

// UNCHANGED - convertir le grade nutriscore en chiffre
function gradeToNumber(grade) {
  const mapping = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5 };
  return mapping[grade.toUpperCase()] || 0;
}

// UNCHANGED - calculer la moyenne des nutriscores
function calculateNutriscore(grades) {
  let total = 0;
  let count = 0;
  grades.forEach(grade => {
    if (grade && grade !== '?') {
      total += gradeToNumber(grade);
      count++;
    }
  });
  if (count === 0) return 0;
  return total / count;
}

// UNCHANGED - convertir la moyenne en grade
function numberToGrade(avg) {
  if (avg <= 1.5) return 'A';
  if (avg <= 2.5) return 'B';
  if (avg <= 3.5) return 'C';
  if (avg <= 4.5) return 'D';
  return 'E';
}

// UNCHANGED - afficher le score nutriscore dans le header
function displayNutriscoreScore(avgScore) {
  const grade = numberToGrade(avgScore);
  const scoreDiv = document.getElementById('nutrition-score');

  let color = '#28a745';
  if (grade === 'B') color = '#85bb2f';
  if (grade === 'C') color = '#ffc107';
  if (grade === 'D') color = '#fd7e14';
  if (grade === 'E') color = '#dc3545';

  scoreDiv.innerHTML = `
    <div class="d-inline-block p-3 rounded-circle" style="background-color: ${color}; width: 100px; height: 100px;">
      <div style="color: white; font-size: 3rem; font-weight: bold;">${grade}</div>
    </div>
    <p class="mt-2" style="color: var(--ocean-dark);">Score nutritionnel moyen</p>
  `;
}

// CHANGED - fetch API Open Food Facts par barcode pour récupérer image + nutriscore réel
async function fetchProduct(barcode) {
  const url = `https://world.openfoodfacts.net/api/v2/product/${barcode}?fields=${FIELDS}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.product || {};
}

// CHANGED - afficher les ingrédients avec image depuis l'API + étapes (étapes inchangées)
async function displayRecipe(recipe, products) {
  const productList = document.getElementById('productList');
  const grades = [];

  // Fetch tous les produits en parallèle
  const apiResults = await Promise.all(
    products.map(p => fetchProduct(p.barcode).catch(() => ({})))
  );

  products.forEach((p, i) => {
    const apiData  = apiResults[i];
    const grade    = (apiData.nutriscore_grade || '?').toUpperCase();
    const img      = apiData.image_front_small_url || '';
    const name     = apiData.product_name || p.name;

    if (grade !== '?') grades.push(grade);

    let color = '#999';
    if (grade === 'A') color = '#28a745';
    if (grade === 'B') color = '#85bb2f';
    if (grade === 'C') color = '#ffc107';
    if (grade === 'D') color = '#fd7e14';
    if (grade === 'E') color = '#dc3545';

    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4';
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        ${img
          ? `<img src="${img}" alt="${name}" class="card-img-top"
                 style="height:160px; object-fit:contain; padding:8px;">`
          : `<div class="card-img-top d-flex align-items-center justify-content-center bg-light"
                  style="height:160px; color:#aaa; font-size:2rem;">📦</div>`
        }
        <div class="card-body">
          <h5 class="card-title text-capitalize">${name}</h5>
          <div class="d-flex align-items-center gap-2">
            <span>Nutriscore :</span>
            <span class="badge" style="background-color: ${color}; font-size: 1rem;">${grade}</span>
          </div>
        </div>
      </div>
    `;
    productList.appendChild(card);
  });

  // Nutriscore moyen
  const avgScore = calculateNutriscore(grades);
  displayNutriscoreScore(avgScore);

  // UNCHANGED - afficher les étapes
  const stepsList = document.getElementById('steps');
  recipe.steps.forEach((step, index) => {
    const item = document.createElement('div');
    item.className = 'list-group-item';
    item.innerHTML = `<strong>Étape ${index + 1} :</strong> ${step}`;
    stepsList.appendChild(item);
  });
}

// CHANGED - loadData lit products.json (barcodes) + recipe.json (étapes)
async function loadData() {
  try {
    const recipeRes = await fetch('data/recipe.json');
    const recipe = await recipeRes.json();

    const productsRes = await fetch('data/products.json');
    const data = await productsRes.json();

    await displayRecipe(recipe, data.products);

  } catch (error) {
    console.error('Erreur lors du chargement:', error);
  }
}

// UNCHANGED
document.addEventListener('DOMContentLoaded', loadData);