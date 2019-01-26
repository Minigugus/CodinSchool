<template>
  <div class="ui text vertical segment container">
    <h1 class="ui center aligned">Aide sur le langage C</h1>
    <h2 class="ui header">Programmer en C à la Maison</h2>
    <p>
      Il est utile de pouvoir développer en C sur votre machine personnelle pour pouvoir vous exercer hors de la plateforme, mais également pour pouvoir tester vos solutions avant de les soumettre à la correction.
      <br>
      L'outil C le plus pratique sous Windows est <strong>Code::Blocks</strong>.
      <br>
      Sous Linux, vous devrez installer la bibliothèque <strong>gcc</strong>.
      <br>
      Vous trouverez ci-dessous deux tutoriels qui vous aideront à installer et utiliser les outils sur Windows et Linux.
    </p>

    <!-- Partie tutoriel Windows -->
    <h3 class="ui header titreToggledSection" @click="visible.windows = !visible.windows">
      1. Sous Windows
      <span class="arrow" :class="{ flip : visible.windows }">⯅</span>
    </h3>
    <transition name="fade">
      <div v-if="visible.windows">
        <h4 class="ui header">1.1. Télécharger Code::Blocks</h4>
        <p>
          La première étape consiste à télécharger l'installateur de Code::Blocks.
          <br>
          Ce logiciel vous permet d'écrire du code source, de gérer vos fichiers et de simplifier la compilation du code source, c'est-à-dire le passage du code source lisible à un code binaire exécutable par votre machine.
          <br>
          Vous pouvez <strong>télécharger Code::Blocks</strong> ici : <a href="http://www.codeblocks.org/downloads/26" target="_blank" rel="noopener noreferrer">http://www.codeblocks.org/downloads/26</a>
          <br>
          Le fichier à télécharger est sous la forme <strong>codeblocks-<small>[VERSION]</small> mingw-setup.exe</strong>, où <small>[VERSION]</small> est le numéro de version de Code::Blocks (s'apparente à la date de sortie du logiciel).
          <br>
          Choisissez simplement le fichier avec le numéro de version le plus élevé.
          <img src="@/assets/LangageC/telechargerCodeblocks.png">
        </p>


        <h4 class="ui header justifié">1.2. Installer Code::Blocks</h4>
        <p>
          Après avoir téléchargé le programme d’installation, lancez le et cliquez sur « Next » pour passer le message de bienvenue.
          <img src="@/assets/LangageC/welcomeCodeblocks.png">

          Cliquez ensuite sur « I Agree » après avoir lu les conditions d’utilisation pour passer à la suite.
          <img src="@/assets/LangageC/acceptCodeblocks.png">

          Sélectionnez « Full » dans le menu déroulant et cliquez sur « Next ».
          <img src="@/assets/LangageC/pluginsCodeblocks.png">

          Sélectionnez le dossier ou vous souhaitez installer Code::Blocks (en cliquant sur « Browse »), puis cliquez sur « Install ».
          <img src="@/assets/LangageC/folderCodeblocks.png">

          Le logiciel va mettre quelques minutes a s’installer, une fois cela fait, il vous demandera si vous souhaitez lancer le logiciel, cliquez sur « Oui ». Cliquez ensuite sur « Next » puis sur « Finish ».
          <img src="@/assets/LangageC/runCodeblocks.png">

          Code::Blocks est maintenant installé et lancé sur votre machine. Vous pouvez maintenant creer votre premier projet.
        </p>


        <h3 class="ui header justifié">1.3. Utiliser Code::Bocks</h3>
        <p>
          Code::Blocks est maintenant installé et lancé sur votre machine. Il est maintenant temps de créer votre premier projet.
          <img src="@/assets/LangageC/codeblocks.png">

          Pour cela, allez dans le menu « File », puis « New » et cliquez sur « Project.. ».
          <img src="@/assets/LangageC/newProjectCodeblocks.png">

          Sélectionnez « Console application » en double cliquant.
          <img src="@/assets/LangageC/consoleAppCodeblocks.png">

          Sélectionnez ensuite le Langage « C » et cliquez sur « Next ».
          <img src="@/assets/LangageC/langageCodeblocks.png">

          Il est maintenant temps de donner un nom a votre projet et de sélectionner le dossier ou vous souhaitez l’enregistrer. Cliquez ensuite sur « Next ».
          <img src="@/assets/LangageC/projectTitleCodeblocks.png">

          Sélectionnez « GNU CC Compiler » dans le menu déroulant et cliquez sur « Finish ».
          <img src="@/assets/LangageC/compilerCodeblocks.png">

          Voila, votre premier projet est créé ! Bravo ! Il faut maintenant sélectionner votre fichier « main.c » dans le menu à gauche pour l’afficher dans la fenêtre principale après avoir déroulé le dossier « source ».
          <img src="@/assets/LangageC/projetCreeCodeblocks.png">

          Cliquez sur « main.c », et voilà, le code de base, un simple « Hello World » s’affiche.
          <img src="@/assets/LangageC/premierMainCodeblocks.png">

          Pour compiler et exécuter ce code, il suffit de cliquer sur l’icône ci-après et le programme se lance dans une console de commande.
          <img class="miniImage" src="@/assets/LangageC/compileAndExecute.png">
        </p>
      </div>
    </transition>
    <!--/ Partie tutoriel Windows -->
  </div>
</template>

<script>
export default {
  name: 'langagec',
  data() {
    return {
      visible: {
        windows: false
      }
    }
  }
}
</script>

<style scoped>
.miniImage {
  width: 2em;
}
img {
  width: 100%;
  display: block;
  margin: 20px 0px;
  border: 2px solid #848484;
  border-radius: 5px;
}
.header p {
  text-align: justify !important;
}

.titreToggledSection {
  cursor: pointer;
  border-radius: 10px;
  padding: 0px 10px;
  width: fit-content;
  transition-duration: 0.3s
}
.titreToggledSection:hover {
  background-color: #e4e4e4;
}
.arrow {
  user-select: none;
  display: inline-block;
  transition-duration: 0.4s;
}
.flip {
  transform: rotate(180deg);
}
</style>
