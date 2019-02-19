/**
 * Tester la validité d'une adresse email.
 *
 * @param {string} email la chaîne à vérifier
 * @returns {boolean} la chaîne est une adresse email valide
 */
const isEmail = email => /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(email)

/**
 * Activer/Désactiver l'état d'erreur sur un champs de formulaire.
 * @requires Semantic-Ui
 *
 * @param {boolean} activerErreur l'erreur doit-elle être activée
 * @param  {...any} id les id de DOMElement des inputs visés
 * @returns {void}
 */
const setErreurInput = (activerErreur, ...id) =>
  id.forEach(input => {
    activerErreur
      ? document.getElementById(input).parentElement.classList.add('error')
      : document.getElementById(input).parentElement.classList.remove('error')
  })

/** Liste des mimes types disponibles pour l'éditeur de code avec leur chemin */
const mimes = [
  { text: 'application/dart', value: 'codemirror/mode/dart/dart.js' },
  { text: 'application/ecmascript', value: 'codemirror/mode/javascript/javascript.js' },
  { text: 'application/edn', value: 'codemirror/mode/clojure/clojure.js' },
  { text: 'application/javascript', value: 'codemirror/mode/javascript/javascript.js' },
  { text: 'application/json', value: 'codemirror/mode/javascript/javascript.js' },
  { text: 'application/ld+json', value: 'codemirror/mode/javascript/javascript.js' },
  { text: 'application/mbox', value: 'codemirror/mode/mbox/mbox.js' },
  { text: 'application/n-quads', value: 'codemirror/mode/ntriples/ntriples.js' },
  { text: 'application/n-triples', value: 'codemirror/mode/ntriples/ntriples.js' },
  { text: 'application/pgp', value: 'codemirror/mode/asciiarmor/asciiarmor.js' },
  { text: 'application/pgp-encrypted', value: 'codemirror/mode/asciiarmor/asciiarmor.js' },
  { text: 'application/pgp-keys', value: 'codemirror/mode/asciiarmor/asciiarmor.js' },
  { text: 'application/pgp-signature', value: 'codemirror/mode/asciiarmor/asciiarmor.js' },
  { text: 'application/sieve', value: 'codemirror/mode/sieve/sieve.js' },
  { text: 'application/sparql-query', value: 'codemirror/mode/sparql/sparql.js' },
  { text: 'application/typescript', value: 'codemirror/mode/javascript/javascript.js' },
  { text: 'application/vnd.coffeescript', value: 'codemirror/mode/coffeescript/coffeescript.js' },
  { text: 'application/x-aspx', value: 'codemirror/mode/htmlembedded/htmlembedded.js' },
  { text: 'application/x-cypher-query', value: 'codemirror/mode/cypher/cypher.js' },
  { text: 'application/x-ejs', value: 'codemirror/mode/htmlembedded/htmlembedded.js' },
  { text: 'application/x-erb', value: 'codemirror/mode/htmlembedded/htmlembedded.js' },
  { text: 'application/x-httpd-php', value: 'codemirror/mode/php/php.js' },
  { text: 'application/x-httpd-php-open', value: 'codemirror/mode/php/php.js' },
  { text: 'application/x-javascript', value: 'codemirror/mode/javascript/javascript.js' },
  { text: 'application/x-json', value: 'codemirror/mode/javascript/javascript.js' },
  { text: 'application/x-jsp', value: 'codemirror/mode/htmlembedded/htmlembedded.js' },
  { text: 'application/x-slim', value: 'codemirror/mode/slim/slim.js' },
  { text: 'application/xml', value: 'codemirror/mode/xml/xml.js' },
  { text: 'application/xml-dtd', value: 'codemirror/mode/dtd/dtd.js' },
  { text: 'application/xquery', value: 'codemirror/mode/xquery/xquery.js' },
  { text: 'message/http', value: 'codemirror/mode/http/http.js' },
  { text: 'script/x-vue', value: 'codemirror/mode/vue/vue.js' },
  { text: 'text/apl', value: 'codemirror/mode/apl/apl.js' },
  { text: 'text/coffeescript', value: 'codemirror/mode/coffeescript/coffeescript.js' },
  { text: 'text/css', value: 'codemirror/mode/css/css.js' },
  { text: 'text/ecmascript', value: 'codemirror/mode/javascript/javascript.js' },
  { text: 'text/html', value: 'codemirror/mode/xml/xml.js' },
  { text: 'text/javascript', value: 'codemirror/mode/javascript/javascript.js' },
  { text: 'text/jinja2', value: 'codemirror/mode/jinja2/jinja2.js' },
  { text: 'text/jsx', value: 'codemirror/mode/jsx/jsx.js' },
  { text: 'text/markdown', value: 'codemirror/mode/markdown/markdown.js' },
  { text: 'text/mirc', value: 'codemirror/mode/mirc/mirc.js' },
  { text: 'text/n-triples', value: 'codemirror/mode/ntriples/ntriples.js' },
  { text: 'text/rust', value: 'codemirror/mode/rust/rust.js' },
  { text: 'text/tiki', value: 'codemirror/mode/tiki/tiki.js' },
  { text: 'text/turtle', value: 'codemirror/mode/turtle/turtle.js' },
  { text: 'text/typescript', value: 'codemirror/mode/javascript/javascript.js' },
  { text: 'text/typescript-jsx', value: 'codemirror/mode/jsx/jsx.js' },
  { text: 'text/vbscript', value: 'codemirror/mode/vbscript/vbscript.js' },
  { text: 'text/velocity', value: 'codemirror/mode/velocity/velocity.js' },
  { text: 'text/x-asterisk', value: 'codemirror/mode/asterisk/asterisk.js' },
  { text: 'text/x-brainfuck', value: 'codemirror/mode/brainfuck/brainfuck.js' },
  { text: 'text/x-cassandra', value: 'codemirror/mode/sql/sql.js' },
  { text: 'text/x-clojure', value: 'codemirror/mode/clojure/clojure.js' },
  { text: 'text/x-clojurescript', value: 'codemirror/mode/clojure/clojure.js' },
  { text: 'text/x-cmake', value: 'codemirror/mode/cmake/cmake.js' },
  { text: 'text/x-cobol', value: 'codemirror/mode/cobol/cobol.js' },
  { text: 'text/x-coffeescript', value: 'codemirror/mode/coffeescript/coffeescript.js' },
  { text: 'text/x-common-lisp', value: 'codemirror/mode/commonlisp/commonlisp.js' },
  { text: 'text/x-crystal', value: 'codemirror/mode/crystal/crystal.js' },
  { text: 'text/x-cython', value: 'codemirror/mode/python/python.js' },
  { text: 'text/x-d', value: 'codemirror/mode/d/d.js' },
  { text: 'text/x-diff', value: 'codemirror/mode/diff/diff.js' },
  { text: 'text/x-django', value: 'codemirror/mode/django/django.js' },
  { text: 'text/x-dockerfile', value: 'codemirror/mode/dockerfile/dockerfile.js' },
  { text: 'text/x-dylan', value: 'codemirror/mode/dylan/dylan.js' },
  { text: 'text/x-ebnf', value: 'codemirror/mode/ebnf/ebnf.js' },
  { text: 'text/x-ecl', value: 'codemirror/mode/ecl/ecl.js' },
  { text: 'text/x-eiffel', value: 'codemirror/mode/eiffel/eiffel.js' },
  { text: 'text/x-elm', value: 'codemirror/mode/elm/elm.js' },
  { text: 'text/x-erlang', value: 'codemirror/mode/erlang/erlang.js' },
  { text: 'text/x-esper', value: 'codemirror/mode/sql/sql.js' },
  { text: 'text/x-ez80', value: 'codemirror/mode/z80/z80.js' },
  { text: 'text/x-factor', value: 'codemirror/mode/factor/factor.js' },
  { text: 'text/x-fcl', value: 'codemirror/mode/fcl/fcl.js' },
  { text: 'text/x-feature', value: 'codemirror/mode/gherkin/gherkin.js' },
  { text: 'text/x-forth', value: 'codemirror/mode/forth/forth.js' },
  { text: 'text/x-fortran', value: 'codemirror/mode/fortran/fortran.js' },
  { text: 'text/x-gfm', value: 'codemirror/mode/gfm/gfm.js' },
  { text: 'text/x-go', value: 'codemirror/mode/go/go.js' },
  { text: 'text/x-gpsql', value: 'codemirror/mode/sql/sql.js' },
  { text: 'text/x-gql', value: 'codemirror/mode/sql/sql.js' },
  { text: 'text/x-groovy', value: 'codemirror/mode/groovy/groovy.js' },
  { text: 'text/x-gss', value: 'codemirror/mode/css/css.js' },
  { text: 'text/x-haml', value: 'codemirror/mode/haml/haml.js' },
  { text: 'text/x-handlebars-template', value: 'codemirror/mode/handlebars/handlebars.js' },
  { text: 'text/x-haskell', value: 'codemirror/mode/haskell/haskell.js' },
  { text: 'text/x-haxe', value: 'codemirror/mode/haxe/haxe.js' },
  { text: 'text/x-hive', value: 'codemirror/mode/sql/sql.js' },
  { text: 'text/x-hxml', value: 'codemirror/mode/haxe/haxe.js' },
  { text: 'text/x-ini', value: 'codemirror/mode/properties/properties.js' },
  { text: 'text/x-julia', value: 'codemirror/mode/julia/julia.js' },
  { text: 'text/x-latex', value: 'codemirror/mode/stex/stex.js' },
  { text: 'text/x-less', value: 'codemirror/mode/css/css.js' },
  {
    text: 'text/x-literate-haskell',
    value: 'codemirror/mode/haskell-literate/haskell-literate.js'
  },
  { text: 'text/x-lua', value: 'codemirror/mode/lua/lua.js' },
  { text: 'text/x-mariadb', value: 'codemirror/mode/sql/sql.js' },
  { text: 'text/x-markdown', value: 'codemirror/mode/markdown/markdown.js' },
  { text: 'text/x-mscgen', value: 'codemirror/mode/mscgen/mscgen.js' },
  { text: 'text/x-msgenny', value: 'codemirror/mode/mscgen/mscgen.js' },
  { text: 'text/x-mssql', value: 'codemirror/mode/sql/sql.js' },
  { text: 'text/x-mumps', value: 'codemirror/mode/mumps/mumps.js' },
  { text: 'text/x-mysql', value: 'codemirror/mode/sql/sql.js' },
  { text: 'text/x-nginx-conf', value: 'codemirror/mode/nginx/nginx.js' },
  { text: 'text/x-nsis', value: 'codemirror/mode/nsis/nsis.js' },
  { text: 'text/x-octave', value: 'codemirror/mode/octave/octave.js' },
  { text: 'text/x-oz', value: 'codemirror/mode/oz/oz.js' },
  { text: 'text/x-pascal', value: 'codemirror/mode/pascal/pascal.js' },
  { text: 'text/x-perl', value: 'codemirror/mode/perl/perl.js' },
  { text: 'text/x-pgsql', value: 'codemirror/mode/sql/sql.js' },
  { text: 'text/x-php', value: 'codemirror/mode/php/php.js' },
  { text: 'text/x-pig', value: 'codemirror/mode/pig/pig.js' },
  { text: 'text/x-plsql', value: 'codemirror/mode/sql/sql.js' },
  { text: 'text/x-properties', value: 'codemirror/mode/properties/properties.js' },
  { text: 'text/x-protobuf', value: 'codemirror/mode/protobuf/protobuf.js' },
  { text: 'text/x-puppet', value: 'codemirror/mode/puppet/puppet.js' },
  { text: 'text/x-python', value: 'codemirror/mode/python/python.js' },
  { text: 'text/x-q', value: 'codemirror/mode/q/q.js' },
  { text: 'text/x-rpm-changes', value: 'codemirror/mode/rpm/rpm.js' },
  { text: 'text/x-rpm-spec', value: 'codemirror/mode/rpm/rpm.js' },
  { text: 'text/x-rsrc', value: 'codemirror/mode/r/r.js' },
  { text: 'text/x-ruby', value: 'codemirror/mode/ruby/ruby.js' },
  { text: 'text/x-rustsrc', value: 'codemirror/mode/rust/rust.js' },
  { text: 'text/x-sas', value: 'codemirror/mode/sas/sas.js' },
  { text: 'text/x-sass', value: 'codemirror/mode/sass/sass.js' },
  { text: 'text/x-scheme', value: 'codemirror/mode/scheme/scheme.js' },
  { text: 'text/x-scss', value: 'codemirror/mode/css/css.js' },
  { text: 'text/x-slim', value: 'codemirror/mode/slim/slim.js' },
  { text: 'text/x-smarty', value: 'codemirror/mode/smarty/smarty.js' },
  { text: 'text/x-solr', value: 'codemirror/mode/solr/solr.js' },
  { text: 'text/x-soy', value: 'codemirror/mode/soy/soy.js' },
  { text: 'text/x-sparksql', value: 'codemirror/mode/sql/sql.js' },
  { text: 'text/x-spreadsheet', value: 'codemirror/mode/spreadsheet/spreadsheet.js' },
  { text: 'text/x-sql', value: 'codemirror/mode/sql/sql.js' },
  { text: 'text/x-sqlite', value: 'codemirror/mode/sql/sql.js' },
  { text: 'text/x-stex', value: 'codemirror/mode/stex/stex.js' },
  { text: 'text/x-styl', value: 'codemirror/mode/stylus/stylus.js' },
  { text: 'text/x-swift', value: 'codemirror/mode/swift/swift.js' },
  { text: 'text/x-systemverilog', value: 'codemirror/mode/verilog/verilog.js' },
  { text: 'text/x-tcl', value: 'codemirror/mode/tcl/tcl.js' },
  { text: 'text/x-textile', value: 'codemirror/mode/textile/textile.js' },
  { text: 'text/x-tiddlywiki', value: 'codemirror/mode/tiddlywiki/tiddlywiki.js' },
  { text: 'text/x-tlv', value: 'codemirror/mode/verilog/verilog.js' },
  { text: 'text/x-tornado', value: 'codemirror/mode/tornado/tornado.js' },
  { text: 'text/x-ttcn-asn', value: 'codemirror/mode/asn.1/asn.1.js' },
  { text: 'text/x-ttcn-cfg', value: 'codemirror/mode/ttcn-cfg/ttcn-cfg.js' },
  { text: 'text/x-twig', value: 'codemirror/mode/twig/twig.js' },
  { text: 'text/x-vb', value: 'codemirror/mode/vb/vb.js' },
  { text: 'text/x-verilog', value: 'codemirror/mode/verilog/verilog.js' },
  { text: 'text/x-vhdl', value: 'codemirror/mode/vhdl/vhdl.js' },
  { text: 'text/x-vue', value: 'codemirror/mode/vue/vue.js' },
  { text: 'text/x-webidl', value: 'codemirror/mode/webidl/webidl.js' },
  { text: 'text/x-xu', value: 'codemirror/mode/mscgen/mscgen.js' },
  { text: 'text/x-yaml', value: 'codemirror/mode/yaml/yaml.js' },
  { text: 'text/x-z80', value: 'codemirror/mode/z80/z80.js' },
  { text: 'text/xml', value: 'codemirror/mode/xml/xml.js' },
  { text: 'text/yaml', value: 'codemirror/mode/yaml/yaml.js' }
]

export { isEmail, setErreurInput, mimes }
