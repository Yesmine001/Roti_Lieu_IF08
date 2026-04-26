# Recipe Webapp

A responsive static web page displaying a recipe of Roti Lieu from marmiton with dynamic nutriscore data pulled from the OpenFoodFacts API.

## Live site
http://www.orkidees.com/IF08/roti-lieu

## Tech stack
- HTML5 / CSS3
- Bootstrap 5.3 
- Vanilla JavaScript (Fetch API)
- OpenFoodFacts API v2

## Project structure
├── index.html          ← main page - the entire UI
├── README.md           ← documentation
├── .gitignore          ← what Git ignores
├── package.json        ← optional, just for npm start
├── css/
│   └── style.css       ← custom styles on top of Bootstrap
├── js/
│   └── main.js         ← all JavaScript logic
└── data/
    ├── recipe.json     ← title, description, steps
    └── products.json   ← barcodes + nutriscore per ingredient


## How to run locally
No build step needed. Open index.html directly in your browser,
or use a simple local server to avoid CORS issues with the OFF API:

    npx serve .
    # then open http://localhost:3000

## Code best practices
- Indentation: 2 spaces (no tabs)
- All IDs and class names in English (e.g. product-list)
- For inline styles — use css/style.css
- For inline scripts — use js/main.js
- Commit messages in English, imperative mood:
  ✅ "Add nutriscore calculation"
  ❌ "added stuff" / "fix" / "wip"
- One feature or fix per commit — do not bundle unrelated changes
- Always pull before pushing: git pull origin main

## Branch naming
feature/your-feature-name
fix/what-you-are-fixing

Example: feature/ingredient-grid, fix/nutriscore-display


## Key external resources

- Bootstrap 5.3 docs      : https://getbootstrap.com/docs/5.3
- OFF API reference        : https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2
- OFF product search       : https://fr.openfoodfacts.org/cgi/search.pl
