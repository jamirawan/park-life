function getTermsCheckbox() {
  return document.getElementById('termsCheckbox') || document.getElementById('accept__checkbox');
}

function isTermsAccepted() {
  const termsCheckbox = getTermsCheckbox();
  return !!(termsCheckbox && termsCheckbox.checked);
}

function checkConnectBtn() {
  const btnConnect = document.getElementById('btnConnect');
  if (!btnConnect) return;
  btnConnect.disabled = !isTermsAccepted();
}

const termsCheckbox = getTermsCheckbox();
if (termsCheckbox) {
  termsCheckbox.addEventListener('change', checkConnectBtn);
}
checkConnectBtn();

function doConnect() {
  if (!isTermsAccepted()) return;

  const dialog = document.querySelector('dialog[id^="getonline"]');
  if (!dialog) return;
  dialog.close();

  const successOverlay = document.getElementById('successOverlay');
  if (successOverlay) {
    successOverlay.classList.add('show');
  }

  const redirectMap = {
    'getonlineWangi':         'https://northernterritory.com/promotions/wifi/wangi?utm_source=tourismnt&utm_medium=wifi&utm_campaign=wangi-falls',
    'getonlineKingsCanyon':   'https://northernterritory.com/promotions/wifi/kings-canyon?utm_source=tourismnt&utm_medium=wifi&utm_campaign=kings-canyon',
    'getonlineDevilsMarbles': 'https://northernterritory.com/promotions/wifi/devils-marbles?utm_source=tourismnt&utm_medium=wifi&utm_campaign=devils-marbles',
  };

  const redirectUrl = redirectMap[dialog.id];
  if (redirectUrl) {
    setTimeout(() => { window.location.href = redirectUrl; }, 3000);
  }
}

// Postcode

  const countrySelect = document.getElementById('country');
  const postcodeField = document.getElementById('postcode-field');
  const postcodeInput = document.getElementById('postcode');

  function togglePostcode() {
    if (!countrySelect || !postcodeField || !postcodeInput) return;
    const isAustralia = countrySelect.value === 'AU';
    postcodeField.style.display = isAustralia ? 'block' : 'none';
    postcodeInput.required = isAustralia;
  }

  // Show postcode immediately since Australia is the default
  togglePostcode();

  if (countrySelect) {
    countrySelect.addEventListener('change', togglePostcode);
  }