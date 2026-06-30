// Firebase configuration (same as provider)
const firebaseConfig = {
  apiKey: "AIzaSyCshphcyfrOnutpKfBdsFfMgnGwtPO29SM",
  authDomain: "logintest-84c5d.firebaseapp.com",
  projectId: "logintest-84c5d",
  storageBucket: "logintest-84c5d.appspot.com",
  messagingSenderId: "651006093167",
  appId: "1:651006093167:web:3a1bf962be99e496e66a9a"
};

// Initialize Firebase & Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM elements
const drugsContainer = document.getElementById('drugsContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const categoryFilter = document.getElementById('categoryFilter');

// Fetch and display drugs
function fetchDrugs(searchTerm = '', category = '') {
    loadingSpinner.classList.remove('d-none');
    drugsContainer.innerHTML = '';
    noResults.classList.add('d-none');

    let query = db.collection('drugs');
    
    // Apply search filter
    if (searchTerm) {
        query = query.where('productName', '>=', searchTerm)
                    .where('productName', '<=', searchTerm + '\uf8ff');
    }
    
    // Apply category filter
    if (category) {
        query = query.where('productCategory', '==', category);
    }

    query.get()
        .then((querySnapshot) => {
            loadingSpinner.classList.add('d-none');
            
            if (querySnapshot.empty) {
                noResults.classList.remove('d-none');
                return;
            }

            querySnapshot.forEach((doc) => {
                const drug = doc.data();
                createDrugCard(drug);
            });
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
            loadingSpinner.classList.add('d-none');
            drugsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h3>Error loading products</h3>
                    <p>Please try again later</p>
                </div>
            `;
        });
}

// Create drug card HTML
function createDrugCard(drug) {
    const card = document.createElement('div');
    card.className = 'col';
    
    // Format price with commas
    const formattedPrice = new Intl.NumberFormat('vi-VN').format(drug.price);
    
    card.innerHTML = `
        <div class="card h-100 drug-card">
            <div class="card-header bg-light py-3">
                <h5 class="card-title mb-0">${drug.productName}</h5>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                    <span class="badge bg-primary">${drug.productCategory}</span>
                    <span class="badge bg-secondary">${drug.dosageForm}</span>
                </div>
                
                <ul class="list-group list-group-flush mb-3">
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Active Ingredient:</span>
                        <strong>${drug.activeIngredient}</strong>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Dosage:</span>
                        <strong>${drug.dosage}</strong>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Package Quantity:</span>
                        <strong>${drug.quantity} units</strong>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Price:</span>
                        <strong>₫${formattedPrice}</strong>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Expiry:</span>
                        <strong>${new Date(drug.expiryDate).toLocaleDateString()}</strong>
                    </li>
                </ul>
                
                <p class="card-text">${drug.description.substring(0, 100)}...</p>
            </div>
            <div class="card-footer bg-white border-0">
                <div class="d-grid">
                    <button class="btn btn-outline-primary">
                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    drugsContainer.appendChild(card);
}

// Event Listeners
searchButton.addEventListener('click', () => {
    fetchDrugs(searchInput.value.trim(), categoryFilter.value);
});

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        fetchDrugs(searchInput.value.trim(), categoryFilter.value);
    }
});

categoryFilter.addEventListener('change', () => {
    fetchDrugs(searchInput.value.trim(), categoryFilter.value);
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    fetchDrugs();
});