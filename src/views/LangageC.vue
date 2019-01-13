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

      <h1 class="ui center aligned header">Aide sur le langage C</h1>
      <h2 class="ui header">Programmer en C à la Maison</h2>
      <p>
        Ce document est un tutoriel d'installation des outils nécessaires à la programmation en C.<br>
        Ce guide explique comment installer Code::Blocks et comment l'utiliser pour programmer en C.
      </p>
      <p>
      </p>

      <h3 class="ui header">1. Télécharger Code::Blocks</h3>
      <p>
        La première étape conciste à télécharger l'installateur de Code::Blocks.
      </p>
      <p>
        Ce logiciel vous permet d'écrire du code source, de gérer vos fichiers et de simplifier la compilation du code source, c'est-à-dire le passage du code source lisible à un code binaire éxécutable par votre machine.
      </p>
      <p>
        Cependant, la compilation n'est pas effectuée par ce logiciel. Il dépend donc d'outils externes pour pouvoir compiler votre code. <em>Il est donc recommandé de <strong>télécharger la version incluant MinGW</strong>, un compilateur très connu</em>.
      </p>
      <p>
        Vous pouvez <strong>télécharger Code::Blocks</strong> ici : <a href="http://www.codeblocks.org/downloads/26" target="_blank" rel="noopener noreferrer">http://www.codeblocks.org/downloads/26</a>
      </p>
      <p>
        Le fichier à télécharger est sous la forme <strong>codeblocks-<small>[VERSION]</small>  mingw-setup.exe</strong>, où <small>[VERSION]</small> est le numéro de version de Code::Blocks (s'apparente à la date de sortie du logiciel). Choisissez simplement le fichier avec le numéro de version le plus élevé.
      </p>

      <h3 class="ui header">2. Installer Code::Blocks</h3>
      <p>
        Exécutez le fichier téléchargé précédement et suivez toutes les étapes indiquées.
      </p>

      <h3 class="ui header">3. Utiliser Code::Bocks</h3>
    </div>
  </div>
</template>

<script>

export default {
  name: 'langagec'
}
</script>

<style scoped>
</style>
