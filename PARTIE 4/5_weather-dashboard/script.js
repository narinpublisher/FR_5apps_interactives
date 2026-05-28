// Démonstration simple pour le livre

const champVille =
  document.querySelector("#champ-ville");

const btnRechercher =
  document.querySelector("#btn-rechercher");

btnRechercher.addEventListener("click", () => {

  const ville =
    champVille.value.trim();

  if (ville) {

    alert(
      `Recherche météo pour : ${ville}`
    );

  }

});

champVille.addEventListener("keydown", (event) => {

  if (event.key === "Enter") {

    const ville =
      champVille.value.trim();

    if (ville) {

      alert(
        `Recherche météo pour : ${ville}`
      );

    }

  }

});