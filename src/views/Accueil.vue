<template>
  <div class="ui vertical stripe segment">
    <div class="ui text container">
      <h1 class="ui inverted header">
        CodinSchool
      </h1>
    </div>
    <div class="ui text container">
      <h3 class="ui header">LA plateforme d'apprentissage du Langage C!</h3>
      <p>Avec CodinSchool, Apprendre et pratiquer le langage C n'a jamais été aussi simple ! Connectez-vous et accédez à une multitude d'exercices qui testeront et amélioreront vos compétences !</p>
      <h4 class="ui horizontal header divider">
        <a href="#"></a>
      </h4>
    </div>
  </div>
</template>

<script>

export default {
  name: 'APropos'
}
</script>

<style scoped>
 .hidden.menu {
  display: none;
}
.masthead.segment {
  min-height: 500px;
  padding: 1em 0em;
}
.masthead .logo.item img {
  margin-right: 1em;
}
.masthead .ui.menu .ui.button {
  margin-left: 0.5em;
}
.masthead h1.ui.header {
  margin-top: 3em;
  margin-bottom: 0em;
  font-size: 4em;
  font-weight: normal;
}
.masthead h2 {
  font-size: 1.7em;
  font-weight: normal;
}


.ui.vertical.stripe {
  padding: 8em 0em;
}
.ui.vertical.stripe h3 {
  font-size: 2em;
}
.ui.vertical.stripe .button + h3,
.ui.vertical.stripe p + h3 {
  margin-top: 3em;
}
.ui.vertical.stripe .floated.image {
  clear: both;
}
.ui.vertical.stripe p {
  font-size: 1.33em;
}
.ui.vertical.stripe .horizontal.divider {
  margin: 3em 0em;
}
.quote.stripe.segment {
  padding: 0em;
}
.quote.stripe.segment .grid .column {
  padding-top: 5em;
  padding-bottom: 5em;
}
.footer.segment {
  padding: 5em 0em;
}
.secondary.pointing.menu .toc.item {
  display: none;
}
</style>
