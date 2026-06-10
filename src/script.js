document.getElementById('termsBox').addEventListener('scroll', function(){
  document.getElementById('scrollNote').style.opacity = this.scrollTop > 20 ? '0' : '1';
});

let accepted = false;
let accepted2 = false;

function checkConnectBtn() {
  // const email = document.getElementById('email').value.trim();
 // const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  document.getElementById('btnConnect').disabled = !(accepted);
}

function toggleAccept() {
  accepted = !accepted;
  document.getElementById('acceptRow').classList.toggle('checked', accepted);
  checkConnectBtn();
}

function toggleAccept2() {
  accepted2 = !accepted2;
  document.getElementById('acceptRow2').classList.toggle('checked', accepted2);
  
}

// Re-check button when email is typed
document.getElementById('email').addEventListener('input', checkConnectBtn);

/*function doConnect() {
  if (!accepted) return;
  document.getElementById('getonline').close();
  document.getElementById('successOverlay').classList.add('show');
  setTimeout(() => { window.location.href = 'https://northernterritory.com/promotions/wifi/wangi'; }, 3000);
} */
function doConnect() {
  if (!accepted) return;

  const dialog = document.querySelector('dialog[id^="getonline"]');
  dialog.close();
  document.getElementById('successOverlay').classList.add('show');

  const redirectMap = {
    'getonlineWangi':         'https://northernterritory.com/promotions/wifi/wangi',
    'getonlineKingsCanyon':   'https://northernterritory.com/promotions/wifi/kings-canyon',
    'getonlineDevilsMarbles': 'https://northernterritory.com/promotions/wifi/devils-marbles',
  };

  setTimeout(() => { window.location.href = redirectMap[dialog.id]; }, 3000);
}

function doGuest() {
  const o = document.getElementById('successOverlay');
  o.querySelector('p').textContent = 'Connected with limited access. Accept the Terms of Use for full park services.';
  o.classList.add('show');
}

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

// Post code

  const countrySelect = document.getElementById('country');
  const postcodeField = document.getElementById('postcode-field');
  const postcodeInput = document.getElementById('postcode');

  function togglePostcode() {
    const isAustralia = countrySelect.value === 'AU';
    postcodeField.style.display = isAustralia ? 'block' : 'none';
    postcodeInput.required = isAustralia;
  }

  // Show postcode immediately since Australia is the default
  togglePostcode();

  countrySelect.addEventListener('change', togglePostcode);