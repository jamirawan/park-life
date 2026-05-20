document.getElementById('termsBox').addEventListener('scroll', function(){
  document.getElementById('scrollNote').style.opacity = this.scrollTop > 20 ? '0' : '1';
});

let accepted = false;
let accepted2 = false;

function checkConnectBtn() {
  const email = document.getElementById('email').value.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  document.getElementById('btnConnect').disabled = !(accepted && accepted2 && validEmail);
}

function toggleAccept() {
  accepted = !accepted;
  document.getElementById('acceptRow').classList.toggle('checked', accepted);
  checkConnectBtn();
}

function toggleAccept2() {
  accepted2 = !accepted2;
  document.getElementById('acceptRow2').classList.toggle('checked', accepted2);
  checkConnectBtn();
}

// Re-check button when email is typed
document.getElementById('email').addEventListener('input', checkConnectBtn);

function doConnect() {
  if (!accepted || !accepted2) return;
  document.getElementById('getonline').close();
  document.getElementById('successOverlay').classList.add('show');
  setTimeout(() => { window.location.href = 'https://northernterritory.com/promotions/wifi/wangi'; }, 3000);
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