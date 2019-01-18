<template>
  <div class="ui vertical stripe segment">
    <div class="ui text container">
      <h1>Liens pour Arthur</h1>
      <ul>
        <li>
          <router-link to="/resetMdp">Mot de passe oublié</router-link>
        </li>
        <li>
          <router-link to="/exercice/creer">Créer un exercice</router-link>
        </li>
      </ul>
      <hr>

      <h1 class="ui center aligned">Aide sur le langage C</h1>
      <h2 class="ui header">Programmer en C à la Maison</h2>
      <p>
       Il est utile de pouvoir développer en C sur votre machine personnelle pour pouvoir vous exercer hors de la plateforme, mais également pour pouvoir tester vos solutions avant de les soumettre à la correction.<br>
        L'outil C le plus pratique sous Windows est <strong>Code::Blocks</strong>.<br>
        Sous Linux, vous devrez installer la bibliothèque <strong>gcc</strong>.<br>
        Vous trouverez ci-dessous deux tutoriels qui vous aiderons à installer et utiliser les outils Windows et Linux.
      </p>
      <p>
      </p>

      <h2 class="ui header">Sous Windows</h2>
      <h3 class="ui header">1. Télécharger Code::Blocks</h3>
      <p>
        La première étape consiste à télécharger l'installateur de Code::Blocks.       </p>
      <p>
        Ce logiciel vous permet d'écrire du code source, de gérer vos fichiers et de simplifier la compilation du code source, c'est-à-dire le passage du code source lisible à un code binaire exécutable par votre machine.       </p>
      <p>
        Vous pouvez <strong>télécharger Code::Blocks</strong> ici : <a href="http://www.codeblocks.org/downloads/26" target="_blank" rel="noopener noreferrer">http://www.codeblocks.org/downloads/26</a>
      </p>
      <p>
        Le fichier à télécharger est sous la forme <strong>codeblocks-<small>[VERSION]</small>  mingw-setup.exe</strong>, où <small>[VERSION]</small> est le numéro de version de Code::Blocks (s'apparente à la date de sortie du logiciel). Choisissez simplement le fichier avec le numéro de version le plus élevé.
      </p>

      <h3 class="ui header justifié">2. Installer Code::Blocks</h3>
      <p>
        Exécutez le fichier téléchargé précédement et suivez toutes les étapes indiquées.
      </p>

      <h3 class="ui header justifié">3. Utiliser Code::Bocks</h3>
    </div>
  </div>
</template>

<script>

export default {
  name: 'langagec'
}
</script>

<style scoped>
  .header p{
    text-align: justify !important;
  }
</style>
