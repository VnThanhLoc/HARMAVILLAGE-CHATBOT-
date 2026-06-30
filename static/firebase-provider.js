// Firebase configuration
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

// Grab loading overlay (now guaranteed to exist)
const overlay = document.querySelector('.loading-overlay');

// Initialize Bootstrap toast
const toastEl = document.querySelector('.toast');
const toast = new bootstrap.Toast(toastEl);

// Helper: show toast notification
function showToast(message, isSuccess = true) {
  const body = document.querySelector('.toast-body');
  body.textContent = message;
  body.style.color = isSuccess ? 'green' : 'red';
  toast.show();
}

// Form submission handler
$('#providerForm').on('submit', async function(e) {
  e.preventDefault();

  // Simple client-side validation
  let isValid = true;
  $('input[required], select[required], textarea[required]').each(function() {
    if (!$(this).val()) {
      isValid = false;
      $(this).addClass('is-invalid');
    } else {
      $(this).removeClass('is-invalid');
    }
  });

  if (!isValid) {
    showToast('Please fill in all required fields.', false);
    return;
  }

  // Show overlay
  overlay.style.display = 'flex';

  try {
    // Build the data object
    const productData = {
      providerEmail: $('#providerEmail').val(),
      providerPhone: $('#providerPhone').val(),
      productName: $('#productName').val(),
      productCategory: $('#productCategory').val(),
      activeIngredient: $('#activeIngredient').val(),
      dosage: $('#dosage').val(),
      dosageForm: $('#dosageForm').val(),
      quantity: parseInt($('#quantity').val(), 10),
      price: parseInt($('#price').val(), 10),
      expiryDate: $('#expiryDate').val(),
      description: $('#description').val(),
      certification: $('#certification').is(':checked'),
      termsAccepted: $('#terms').is(':checked'),
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Write to Cloud Firestore
    await db.collection('drugs').add(productData);

    // Hide overlay & show success
    overlay.style.display = 'none';
    showToast('Product submitted successfully! Our team will review it shortly.');

    // Reset form
    $('#providerForm')[0].reset();

  } catch (err) {
    console.error('Error adding document:', err);
    overlay.style.display = 'none';
    showToast('Error submitting product. Please try again.', false);
  }
});

// Append red asterisk to required labels
$('.required').append('<span class="text-danger"> *</span>');

// Real-time email validation
$('#providerEmail').on('input', function() {
    const email = $(this).val().trim();
    if (email.endsWith('@admin.com')) {
        $(this).removeClass('is-invalid').addClass('is-valid');
    } else {
        $(this).removeClass('is-valid').addClass('is-invalid');
    }
});
