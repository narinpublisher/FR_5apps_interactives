const montantInput = document.getElementById('montant');

const pourcentageSelect =
  document.getElementById('pourcentage');

const bouton =
  document.getElementById('calculer');

const tipElement =
  document.getElementById('tip');

const totalElement =
  document.getElementById('total');

bouton.addEventListener('click', () => {

  const montant =
    parseFloat(montantInput.value);

  const pourcentage =
    parseFloat(pourcentageSelect.value);

  if (isNaN(montant) || montant <= 0) {

    alert('Veuillez entrer un montant valide.');

    return;
  }

  const tip =
    montant * (pourcentage / 100);

  const total =
    montant + tip;

  tipElement.textContent =
    tip.toFixed(2) + ' €';

  totalElement.textContent =
    total.toFixed(2) + ' €';
});