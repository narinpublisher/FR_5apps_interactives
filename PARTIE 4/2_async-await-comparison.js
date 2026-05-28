// ================================
// Version Promises (.then/.catch)
// ================================

function chargerMeteo() {

  fetch("https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=CLE")

    .then(reponse => reponse.json())

    .then(donnees => {

      afficherMeteo(donnees);

    })

    .catch(erreur => {

      afficherErreur(erreur.message);

    });

}



// ================================
// Version async/await
// ================================

async function chargerMeteoAsync() {

  try {

    const reponse = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=CLE"
    );

    const donnees = await reponse.json();

    afficherMeteo(donnees);

  } catch (erreur) {

    afficherErreur(erreur.message);

  }

}