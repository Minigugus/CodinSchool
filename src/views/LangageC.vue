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
        <img class="images" src="@/assets/LangageC/telechargercodeblocks.png">
      </p>


      <h3 class="ui header justifié">2. Installer Code::Blocks</h3>

      <p>
        Après avoir téléchargé le programme d’installation, lancez le et cliquez sur « Next » pour passer le message de bienvenue.
      <img class="images" src="@/assets/LangageC/welcomecodeblocks.png">
      </p>
      <p>
        Cliquez ensuite sur « I Agree » après avoir lu les conditions d’utilisation pour passer à la suite.
        <img class="images" src="@/assets/LangageC/agreecodeblocks.png">
      </p>
      <p>
        Sélectionnez « Full » dans le menu déroulant et cliquez sur « Next ».
        <img class="images" src="@/assets/LangageC/pluginscodeblocks.png">
      </p>
      <p>
        Sélectionnez le dossier ou vous souhaitez installer Code::Blocks (en cliquant sur « Browse »), puis cliquez sur « Install ».
        <img class="images" src="@/assets/LangageC/foldercodeblocks.png">
      </p>
      <p>
        Le logiciel va mettre quelques minutes a s’installer, une fois cela fait, il vous demandera si vous souhaitez lancer le logiciel, cliquez sur « Oui ». Cliquez ensuite sur « Next » puis sur « Finish ».
        <img class="images" src="@/assets/LangageC/runcodeblocks.png">
      </p>
      <p>
        Code::Blocks est maintenant installé et lancé sur votre machine. Vous pouvez maintenant creer votre premier projet.
      </p>
      <h3 class="ui header justifié">3. Utiliser Code::Bocks</h3>
      <p>
        Code::Blocks est maintenant installé et lancé sur votre machine. Il est maintenant temps de créer votre premier projet.
        <img class="images" src="@/assets/LangageC/codeblocks.png">
      </p>
      <p>
        Pour cela, allez dans le menu « File », puis « New » et cliquez sur « Project.. »
        <img class="images" src="@/assets/LangageC/newprojectcodeblocks.png">
      </p>
      <p>
        Sélectionnez « Console application » en double cliquant
        <img class="images" src="@/assets/LangageC/consoleappcodeblocks.png">
      </p>
      <p>
        Sélectionnez ensuite le Langage « C » et cliquez sue « Next »
        <img class="images" src="@/assets/LangageC/langagecodeblocks.png">
      </p>
      <p>
        Il est maintenant temps de donner un nom a votre projet et de sélectionner le dossier ou vous souhaitez l’enregistrer. Cliquez ensuite sur « Next »
        <img class="images" src="@/assets/LangageC/projecttitlecodeblocks.png">
      </p>
      <p>
        Sélectionnez « GNU CC Compiler » dans le menu déroulant et cliquez sur « Finish »
        <img class="images" src="@/assets/LangageC/compilercodeblocks.png">
      </p>
      <p>
        Voila, votre premier projet est créé ! Bravo ! Il faut maintenant sélectionner votre fichier « main.c » dans le menu à gauche pour l’afficher dans la fenêtre principale après avoir déroulé le dossier « source ».
        <img class="images" src="@/assets/LangageC/projetcreecodeblocks.png">
      </p>
      <p>
        Cliquez sur « main.c », et voilà, le code de base, un simple « Hello World » s’affiche.
        <img class="images" src="@/assets/LangageC/premiermaincodeblocks.png">
      </p>
      <p>
        Pour compiler et exécuter ce code, il suffit de cliquer sur l’icône ci-aprés et le programme se lance dans une console de commande.
        <img class="miniimages" src="@/assets/LangageC/compileandexecute.png">
      </p>

    </div>
  </div>
</template>

<script>

export default {
  name: 'langagec'
}
</script>

<style scoped>
  .miniimages{
    margin-left: 20px;
  }

  .images{
    width: 40em;
    margin-top: 20px;
  }

  .header p{
    text-align: justify !important;
  }
</style>
