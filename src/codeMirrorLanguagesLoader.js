/**
 * CodeMirror NPM dynamic language module loader.
 * To be used with WebPack.
 *
 * @example
 * loadCodeMirrorModule(codeMirrorLanguages[0].codeMirrorMode)
 *
 * @author rigwild <https://github.com/rigwild>
 * @see https://gist.github.com/rigwild/ce6b4c6a893c3a95f75cc0aca633f037
 * @license MIT
 */

/* eslint-disable */
/**
 * Dynamically load the corresponding language module.
 *
 * @param {String} codeMirrorLanguage The name of the module language (codeMirrorMode object property of codeMirrorLanguages)
 * @throws An Unknown CodeMirror language type was specified or language mode module not found
 * @returns {Promise} a Promise containing a module asynchronously loading
 */
export const loadCodeMirrorModule = async codeMirrorLanguage => {
  const temp = codeMirrorLanguages[codeMirrorLanguage]
  if (temp) {
    try {
      await modules[temp.codeMirrorMode]()
    } catch (err) {
      throw new Error('Could not load the language mode module.')
    }
    return temp
  }
  throw new Error('Unknown CodeMirror language.')
}

export default loadCodeMirrorModule

// prettier-ignore
/**
 * All CodeMirror languages and additional data.
 *
 * Extracted from Digipres
 * @see https://github.com/digipres/digipres.github.io
 * @see https://raw.githubusercontent.com/digipres/digipres.github.io/master/_data/formats/githublinguist.yml
 */
export const codeMirrorLanguages = {
  'AGS Script': {
    color: '#B9D9FF',
    codeMirrorMode: 'clike',
    extensions: ['*.asc', '*.ash'],
    mimetypes: ['text/x-c++src']
  },
  'APL': {
    color: '#5A8164',
    codeMirrorMode: 'apl',
    extensions: ['*.apl', '*.dyalog'],
    mimetypes: ['text/apl']
  },
  'ASN.1': {
    color: null,
    codeMirrorMode: 'asn.1',
    extensions: ['*.asn', '*.asn1'],
    mimetypes: ['text/x-ttcn-asn']
  },
  'ASP': {
    color: '#6a40fd',
    codeMirrorMode: 'htmlembedded',
    extensions: ['*.asp', '*.asax', '*.ascx', '*.ashx', '*.asmx', '*.aspx', '*.axd'],
    mimetypes: ['application/x-aspx']
  },
  'Alpine Abuild': {
    color: null,
    codeMirrorMode: 'shell',
    extensions: [],
    mimetypes: ['text/x-sh']
  },
  'Ant Build System': {
    color: null,
    codeMirrorMode: 'xml',
    extensions: [],
    mimetypes: ['application/xml']
  },
  'Apex': {
    color: null,
    codeMirrorMode: 'clike',
    extensions: ['*.cls'],
    mimetypes: ['text/x-java']
  },
  'Brainfuck': {
    color: '#2F2530',
    codeMirrorMode: 'brainfuck',
    extensions: ['*.b', '*.bf'],
    mimetypes: ['text/x-brainfuck']
  },
  'C': {
    color: '#555555',
    codeMirrorMode: 'clike',
    extensions: ['*.c', '*.cats', '*.h', '*.idc'],
    mimetypes: ['text/x-csrc']
  },
  'C#': {
    color: '#178600',
    codeMirrorMode: 'clike',
    extensions: ['*.cs', '*.cake', '*.csx'],
    mimetypes: ['text/x-csharp']
  },
  'C++': {
    color: '#f34b7d',
    codeMirrorMode: 'clike',
    extensions: ['*.cpp', '*.c++', '*.cc', '*.cp', '*.cxx', '*.h', '*.h++', '*.hh', '*.hpp', '*.hxx', '*.inc', '*.inl', '*.ino', '*.ipp', '*.re', '*.tcc', '*.tpp'],
    mimetypes: ['text/x-c++src']
  },
  'C2hs Haskell': {
    color: null,
    codeMirrorMode: 'haskell',
    extensions: ['*.chs'],
    mimetypes: ['text/x-haskell']
  },
  'CMake': {
    color: null,
    codeMirrorMode: 'cmake',
    extensions: ['*.cmake', '*.cmake.in'],
    mimetypes: ['text/x-cmake']
  },
  'COBOL': {
    color: null,
    codeMirrorMode: 'cobol',
    extensions: ['*.cob', '*.cbl', '*.ccp', '*.cobol', '*.cpy'],
    mimetypes: ['text/x-cobol']
  },
  'COLLADA': {
    color: null,
    codeMirrorMode: 'xml',
    extensions: ['*.dae'],
    mimetypes: ['text/xml']
  },
  'CSS': {
    color: '#563d7c',
    codeMirrorMode: 'css',
    extensions: ['*.css'],
    mimetypes: ['text/css']
  },
  'ChucK': {
    color: null,
    codeMirrorMode: 'clike',
    extensions: ['*.ck'],
    mimetypes: ['text/x-java']
  },
  'Clojure': {
    color: '#db5855',
    codeMirrorMode: 'clojure',
    extensions: ['*.clj', '*.boot', '*.cl2', '*.cljc', '*.cljs', '*.cljs.hl', '*.cljscm', '*.cljx', '*.hic'],
    mimetypes: ['text/x-clojure']
  },
  'CoffeeScript': {
    color: '#244776',
    codeMirrorMode: 'coffeescript',
    extensions: ['*.coffee', '*._coffee', '*.cake', '*.cjsx', '*.iced'],
    mimetypes: ['text/x-coffeescript']
  },
  'Common Lisp': {
    color: '#3fb68b',
    codeMirrorMode: 'commonlisp',
    extensions: ['*.lisp', '*.asd', '*.cl', '*.l', '*.lsp', '*.ny', '*.podsl', '*.sexp'],
    mimetypes: ['text/x-common-lisp']
  },
  'Component Pascal': {
    color: '#B0CE4E',
    codeMirrorMode: 'pascal',
    extensions: ['*.cp', '*.cps'],
    mimetypes: ['text/x-pascal']
  },
  'Crystal': {
    color: '#000100',
    codeMirrorMode: 'crystal',
    extensions: ['*.cr'],
    mimetypes: ['text/x-crystal']
  },
  'Cuda': {
    color: '#3A4E3A',
    codeMirrorMode: 'clike',
    extensions: ['*.cu', '*.cuh'],
    mimetypes: ['text/x-c++src']
  },
  'Cycript': {
    color: null,
    codeMirrorMode: 'javascript',
    extensions: ['*.cy'],
    mimetypes: ['text/javascript']
  },
  'Cython': {
    color: null,
    codeMirrorMode: 'python',
    extensions: ['*.pyx', '*.pxd', '*.pxi'],
    mimetypes: ['text/x-cython']
  },
  'D': {
    color: '#ba595e',
    codeMirrorMode: 'd',
    extensions: ['*.d', '*.di'],
    mimetypes: ['text/x-d']
  },
  'DTrace': {
    color: null,
    codeMirrorMode: 'clike',
    extensions: ['*.d'],
    mimetypes: ['text/x-csrc']
  },
  'Dart': {
    color: '#00B4AB',
    codeMirrorMode: 'dart',
    extensions: ['*.dart'],
    mimetypes: ['application/dart']
  },
  'Diff': {
    color: null,
    codeMirrorMode: 'diff',
    extensions: ['*.diff', '*.patch'],
    mimetypes: ['text/x-diff']
  },
  'Dockerfile': {
    color: '#384d54',
    codeMirrorMode: 'dockerfile',
    extensions: ['*.dockerfile'],
    mimetypes: ['text/x-dockerfile']
  },
  'Dylan': {
    color: '#6c616e',
    codeMirrorMode: 'dylan',
    extensions: ['*.dylan', '*.dyl', '*.intr', '*.lid'],
    mimetypes: ['text/x-dylan']
  },
  'ECL': {
    color: '#8a1267',
    codeMirrorMode: 'ecl',
    extensions: ['*.ecl', '*.eclxml'],
    mimetypes: ['text/x-ecl']
  },
  'EQ': {
    color: '#a78649',
    codeMirrorMode: 'clike',
    extensions: ['*.eq'],
    mimetypes: ['text/x-csharp']
  },
  'Eagle': {
    color: null,
    codeMirrorMode: 'xml',
    extensions: ['*.sch', '*.brd'],
    mimetypes: ['text/xml']
  },
  'Ecere Projects': {
    color: null,
    codeMirrorMode: 'javascript',
    extensions: ['*.epj'],
    mimetypes: ['application/json']
  },
  'Eiffel': {
    color: '#946d57',
    codeMirrorMode: 'eiffel',
    extensions: ['*.e'],
    mimetypes: ['text/x-eiffel']
  },
  'Elm': {
    color: '#60B5CC',
    codeMirrorMode: 'elm',
    extensions: ['*.elm'],
    mimetypes: ['text/x-elm']
  },
  'Emacs Lisp': {
    color: '#c065db',
    codeMirrorMode: 'commonlisp',
    extensions: ['*.el', '*.emacs', '*.emacs.desktop'],
    mimetypes: ['text/x-common-lisp']
  },
  'EmberScript': {
    color: '#FFF4F3',
    codeMirrorMode: 'coffeescript',
    extensions: ['*.em', '*.emberscript'],
    mimetypes: ['text/x-coffeescript']
  },
  'Erlang': {
    color: '#B83998',
    codeMirrorMode: 'erlang',
    extensions: ['*.erl', '*.app.src', '*.es', '*.escript', '*.hrl', '*.xrl', '*.yrl'],
    mimetypes: ['text/x-erlang']
  },
  'F#': {
    color: '#b845fc',
    codeMirrorMode: 'mllike',
    extensions: ['*.fs', '*.fsi', '*.fsx'],
    mimetypes: ['text/x-fsharp']
  },
  'Fortran': {
    color: '#4d41b1',
    codeMirrorMode: 'fortran',
    extensions: ['*.f90', '*.f', '*.f03', '*.f08', '*.f77', '*.f95', '*.for', '*.fpp'],
    mimetypes: ['text/x-fortran']
  },
  'Factor': {
    color: '#636746',
    codeMirrorMode: 'factor',
    extensions: ['*.factor'],
    mimetypes: ['text/x-factor']
  },
  'Forth': {
    color: '#341708',
    codeMirrorMode: 'forth',
    extensions: ['*.fth', '*.4th', '*.f', '*.for', '*.forth', '*.fr', '*.frt', '*.fs'],
    mimetypes: ['text/x-forth']
  },
  'GCC Machine Description': {
    color: null,
    codeMirrorMode: 'commonlisp',
    extensions: ['*.md'],
    mimetypes: ['text/x-common-lisp']
  },
  'Game Maker Language': {
    color: '#71b417',
    codeMirrorMode: 'clike',
    extensions: ['*.gml'],
    mimetypes: ['text/x-c++src']
  },
  'Genshi': {
    color: null,
    codeMirrorMode: 'xml',
    extensions: ['*.kid'],
    mimetypes: ['text/xml']
  },
  'Gentoo Ebuild': {
    color: null,
    codeMirrorMode: 'shell',
    extensions: ['*.ebuild'],
    mimetypes: ['text/x-sh']
  },
  'Gentoo Eclass': {
    color: null,
    codeMirrorMode: 'shell',
    extensions: ['*.eclass'],
    mimetypes: ['text/x-sh']
  },
  'Glyph': {
    color: '#c1ac7f',
    codeMirrorMode: 'tcl',
    extensions: ['*.glf'],
    mimetypes: ['text/x-tcl']
  },
  'Go': {
    color: '#00ADD8',
    codeMirrorMode: 'go',
    extensions: ['*.go'],
    mimetypes: ['text/x-go']
  },
  'Grammatical Framework': {
    color: '#79aa7a',
    codeMirrorMode: 'haskell',
    extensions: ['*.gf'],
    mimetypes: ['text/x-haskell']
  },
  'Roff': {
    color: '#ecdebe',
    codeMirrorMode: 'troff',
    extensions: ['*.roff', '*.1', '*.1in', '*.1m', '*.1x', '*.2', '*.3', '*.3in', '*.3m', '*.3p', '*.3pm', '*.3qt', '*.3x', '*.4', '*.5', '*.6', '*.7', '*.8', '*.', '*.l', '*.man', '*.mdoc', '*.me', '*.ms', '*.n', '*.nr', '*.rno', '*.tmac'],
    mimetypes: ['text/troff']
  },
  'Groovy': {
    color: '#e69f56',
    codeMirrorMode: 'groovy',
    extensions: ['*.groovy', '*.grt', '*.gtpl', '*.gvy'],
    mimetypes: ['text/x-groovy']
  },
  'Groovy Server Pages': {
    color: null,
    codeMirrorMode: 'htmlembedded',
    extensions: ['*.gsp'],
    mimetypes: ['application/x-jsp']
  },
  'HCL': {
    color: null,
    codeMirrorMode: 'ruby',
    extensions: ['*.hcl', '*.tf', '*.tfvars', '*.workflow'],
    mimetypes: ['text/x-ruby']
  },
  'HTML': {
    color: '#e34c26',
    codeMirrorMode: 'htmlmixed',
    extensions: ['*.html', '*.htm', '*.html.hl', '*.inc', '*.st', '*.xht', '*.xhtml'],
    mimetypes: ['text/html']
  },
  'HTML+Django': {
    color: null,
    codeMirrorMode: 'django',
    extensions: ['*.jinja', '*.jinja2', '*.mustache', '*.njk'],
    mimetypes: ['text/x-django']
  },
  'HTML+ECR': {
    color: null,
    codeMirrorMode: 'htmlmixed',
    extensions: ['*.ecr'],
    mimetypes: ['text/html']
  },
  'HTML+EEX': {
    color: null,
    codeMirrorMode: 'htmlmixed',
    extensions: ['*.eex'],
    mimetypes: ['text/html']
  },
  'HTML+ERB': {
    color: null,
    codeMirrorMode: 'htmlembedded',
    extensions: ['*.erb', '*.erb.deface'],
    mimetypes: ['application/x-erb']
  },
  'HTML+PHP': {
    color: null,
    codeMirrorMode: 'php',
    extensions: ['*.phtml'],
    mimetypes: ['application/x-httpd-php']
  },
  'HTTP': {
    color: null,
    codeMirrorMode: 'http',
    extensions: ['*.http'],
    mimetypes: ['message/http']
  },
  'Hack': {
    color: '#878787',
    codeMirrorMode: 'php',
    extensions: ['*.hh', '*.php'],
    mimetypes: ['application/x-httpd-php']
  },
  'Haml': {
    color: null,
    codeMirrorMode: 'haml',
    extensions: ['*.haml', '*.haml.deface'],
    mimetypes: ['text/x-haml']
  },
  'Haskell': {
    color: '#5e5086',
    codeMirrorMode: 'haskell',
    extensions: ['*.hs', '*.hsc'],
    mimetypes: ['text/x-haskell']
  },
  'Haxe': {
    color: '#df7900',
    codeMirrorMode: 'haxe',
    extensions: ['*.hx', '*.hxsl'],
    mimetypes: ['text/x-haxe']
  },
  'IDL': {
    color: '#a3522f',
    codeMirrorMode: 'idl',
    extensions: ['*.pro', '*.dlm'],
    mimetypes: ['text/x-idl']
  },
  'INI': {
    color: null,
    codeMirrorMode: 'properties',
    extensions: ['*.ini', '*.cfg', '*.lektorproject', '*.prefs', '*.pro', '*.properties'],
    mimetypes: ['text/x-properties']
  },
  'IRC log': {
    color: null,
    codeMirrorMode: 'mirc',
    extensions: ['*.irclog', '*.weechatlog'],
    mimetypes: ['text/mirc']
  },
  'JSON': {
    color: null,
    codeMirrorMode: 'javascript',
    extensions: ['*.json', '*.avsc', '*.geojson', '*.gltf', '*.har', '*.ice', '*.JSON-tmLanguage', '*.jsonl', '*.tfstate', '*.tfstate.backup', '*.topojso', '*.webapp', '*.webmanifest', '*.yy', '*.yyp'],
    mimetypes: ['application/json']
  },
  'JSON5': {
    color: null,
    codeMirrorMode: 'javascript',
    extensions: ['*.json5'],
    mimetypes: ['application/json']
  },
  'JSONLD': {
    color: null,
    codeMirrorMode: 'javascript',
    extensions: ['*.jsonld'],
    mimetypes: ['application/json']
  },
  'JSONiq': {
    color: '#40d47e',
    codeMirrorMode: 'javascript',
    extensions: ['*.jq'],
    mimetypes: ['application/json']
  },
  'JSX': {
    color: null,
    codeMirrorMode: 'jsx',
    extensions: ['*.jsx'],
    mimetypes: ['text/jsx']
  },
  'Pug': {
    color: null,
    codeMirrorMode: 'pug',
    extensions: ['*.jade', '*.pug'],
    mimetypes: ['text/x-pug']
  },
  'Java': {
    color: '#b07219',
    codeMirrorMode: 'clike',
    extensions: ['*.java'],
    mimetypes: ['text/x-java']
  },
  'Java Server Pages': {
    color: null,
    codeMirrorMode: 'htmlembedded',
    extensions: ['*.jsp'],
    mimetypes: ['application/x-jsp']
  },
  'JavaScript': {
    color: '#f1e05a',
    codeMirrorMode: 'javascript',
    extensions: ['*.js', '*._js', '*.bones', '*.es', '*.es6', '*.frag', '*.gs', '*.jake', '*.jsb', '*.jscad', '*.jsfl', '*.jsm', '*.jss', '*.mjs', '*.njs', '*.pa', ' *.sjs', '*.ssjs', '*.xsjs', '*.xsjslib'],
    mimetypes: ['text/javascript']
  },
  'Julia': {
    color: '#a270ba',
    codeMirrorMode: 'julia',
    extensions: ['*.jl'],
    mimetypes: ['text/x-julia']
  },
  'Jupyter Notebook': {
    color: '#DA5B0B',
    codeMirrorMode: 'javascript',
    extensions: ['*.ipynb'],
    mimetypes: ['application/json']
  },
  'KiCad Layout': {
    color: null,
    codeMirrorMode: 'commonlisp',
    extensions: ['*.kicad_pcb', '*.kicad_mod', '*.kicad_wks'],
    mimetypes: ['text/x-common-lisp']
  },
  'Kit': {
    color: null,
    codeMirrorMode: 'htmlmixed',
    extensions: ['*.kit'],
    mimetypes: ['text/html']
  },
  'Kotlin': {
    color: '#F18E33',
    codeMirrorMode: 'clike',
    extensions: ['*.kt', '*.ktm', '*.kts'],
    mimetypes: ['text/x-kotlin']
  },
  'LFE': {
    color: '#4C3023',
    codeMirrorMode: 'commonlisp',
    extensions: ['*.lfe'],
    mimetypes: ['text/x-common-lisp']
  },
  'LabVIEW': {
    color: null,
    codeMirrorMode: 'xml',
    extensions: ['*.lvproj'],
    mimetypes: ['text/xml']
  },
  'Latte': {
    color: null,
    codeMirrorMode: 'smarty',
    extensions: ['*.latte'],
    mimetypes: ['text/x-smarty']
  },
  'Less': {
    color: null,
    codeMirrorMode: 'css',
    extensions: ['*.less'],
    mimetypes: ['text/css']
  },
  'Literate Haskell': {
    color: null,
    codeMirrorMode: 'haskell-literate',
    extensions: ['*.lhs'],
    mimetypes: ['text/x-literate-haskell']
  },
  'LiveScript': {
    color: '#499886',
    codeMirrorMode: 'livescript',
    extensions: ['*.ls', '*._ls'],
    mimetypes: ['text/x-livescript']
  },
  'LookML': {
    color: '#652B81',
    codeMirrorMode: 'yaml',
    extensions: ['*.lookml', '*.model.lkml', '*.view.lkml'],
    mimetypes: ['text/x-yaml']
  },
  'Lua': {
    color: '#000080',
    codeMirrorMode: 'lua',
    extensions: ['*.lua', '*.fcgi', '*.nse', '*.p8', '*.pd_lua', '*.rbxs', '*.wlua'],
    mimetypes: ['text/x-lua']
  },
  'M': {
    color: null,
    codeMirrorMode: 'mumps',
    extensions: ['*.mumps', '*.m'],
    mimetypes: ['text/x-mumps']
  },
  'MTML': {
    color: '#b7e1f4',
    codeMirrorMode: 'htmlmixed',
    extensions: ['*.mtml'],
    mimetypes: ['text/html']
  },
  'MUF': {
    color: null,
    codeMirrorMode: 'forth',
    extensions: ['*.muf', '*.m'],
    mimetypes: ['text/x-forth']
  },
  'Makefile': {
    color: '#427819',
    codeMirrorMode: 'cmake',
    extensions: ['*.mak', '*.d', '*.make', '*.mk', '*.mkfile'],
    mimetypes: ['text/x-cmake']
  },
  'Markdown': {
    color: null,
    codeMirrorMode: 'gfm',
    extensions: ['*.md', '*.markdown', '*.mdown', '*.mdwn', '*.mkd', '*.mkdn', '*.mkdown', '*.ronn', '*.workbook'],
    mimetypes: ['text/x-gfm']
  },
  'Mathematica': {
    color: null,
    codeMirrorMode: 'mathematica',
    extensions: ['*.mathematica', '*.cdf', '*.m', '*.ma', '*.mt', '*.nb', '*.nbp', '*.wl', '*.wlt'],
    mimetypes: ['text/x-mathematica']
  },
  'MATLAB': {
    color: '#e16737',
    codeMirrorMode: 'octave',
    extensions: ['*.matlab', '*.m'],
    mimetypes: ['text/x-octave']
  },
  'Maven POM': {
    color: null,
    codeMirrorMode: 'xml',
    extensions: [],
    mimetypes: ['text/xml']
  },
  'Max': {
    color: '#c4a79c',
    codeMirrorMode: 'javascript',
    extensions: ['*.maxpat', '*.maxhelp', '*.maxproj', '*.mxt', '*.pat'],
    mimetypes: ['application/json']
  },
  'Metal': {
    color: '#8f14e9',
    codeMirrorMode: 'clike',
    extensions: ['*.metal'],
    mimetypes: ['text/x-c++src']
  },
  'Mirah': {
    color: '#c7a938',
    codeMirrorMode: 'ruby',
    extensions: ['*.druby', '*.duby', '*.mirah'],
    mimetypes: ['text/x-ruby']
  },
  'Modelica': {
    color: null,
    codeMirrorMode: 'modelica',
    extensions: ['*.mo'],
    mimetypes: ['text/x-modelica']
  },
  'NSIS': {
    color: null,
    codeMirrorMode: 'nsis',
    extensions: ['*.nsi', '*.nsh'],
    mimetypes: ['text/x-nsis']
  },
  'NetLogo': {
    color: '#ff6375',
    codeMirrorMode: 'commonlisp',
    extensions: ['*.nlogo'],
    mimetypes: ['text/x-common-lisp']
  },
  'NewLisp': {
    color: '#87AED7',
    codeMirrorMode: 'commonlisp',
    extensions: ['*.nl', '*.lisp', '*.lsp'],
    mimetypes: ['text/x-common-lisp']
  },
  'Nginx': {
    color: null,
    codeMirrorMode: 'nginx',
    extensions: ['*.nginxconf', '*.vhost'],
    mimetypes: ['text/x-nginx-conf']
  },
  'Nu': {
    color: '#c9df40',
    codeMirrorMode: 'scheme',
    extensions: ['*.nu'],
    mimetypes: ['text/x-scheme']
  },
  'NumPy': {
    color: null,
    codeMirrorMode: 'python',
    extensions: ['*.numpy', '*.numpyw', '*.numsc'],
    mimetypes: ['text/x-python']
  },
  'OCaml': {
    color: '#3be133',
    codeMirrorMode: 'mllike',
    extensions: ['*.ml', '*.eliom', '*.eliomi', '*.ml4', '*.mli', '*.mll', '*.mly'],
    mimetypes: ['text/x-ocaml']
  },
  'Objective-C': {
    color: '#438eff',
    codeMirrorMode: 'clike',
    extensions: ['*.m', '*.h'],
    mimetypes: ['text/x-objectivec']
  },
  'Objective-C++': {
    color: '#6866fb',
    codeMirrorMode: 'clike',
    extensions: ['*.mm'],
    mimetypes: ['text/x-objectivec']
  },
  'OpenCL': {
    color: null,
    codeMirrorMode: 'clike',
    extensions: ['*.cl', '*.opencl'],
    mimetypes: ['text/x-csrc']
  },
  'OpenRC runscript': {
    color: null,
    codeMirrorMode: 'shell',
    extensions: [],
    mimetypes: ['text/x-sh']
  },
  'Oz': {
    color: '#fab738',
    codeMirrorMode: 'oz',
    extensions: ['*.oz'],
    mimetypes: ['text/x-oz']
  },
  'PHP': {
    color: '#4F5D95',
    codeMirrorMode: 'php',
    extensions: ['*.php', '*.aw', '*.ctp', '*.fcgi', '*.inc', '*.php3', '*.php4', '*.php5', '*.phps', '*.phpt'],
    mimetypes: ['application/x-httpd-php']
  },
  'PLSQL': {
    color: '#dad8d8',
    codeMirrorMode: 'sql',
    extensions: ['*.pls', '*.bdy', '*.ddl', '*.fnc', '*.pck', '*.pkb', '*.pks', '*.plb', '*.plsql', '*.prc', '*.spc', '*.sql', '*.tpb', '*.tps', '*.trg', '*.vw'],
    mimetypes: ['text/x-plsql']
  },
  'PLpgSQL': {
    color: null,
    codeMirrorMode: 'sql',
    extensions: ['*.pgsql', '*.sql'],
    mimetypes: ['text/x-sql']
  },
  'Pascal': {
    color: '#E3F171',
    codeMirrorMode: 'pascal',
    extensions: ['*.pas', '*.dfm', '*.dpr', '*.inc', '*.lpr', '*.pascal', '*.pp'],
    mimetypes: ['text/x-pascal']
  },
  'Perl': {
    color: '#0298c3',
    codeMirrorMode: 'perl',
    extensions: ['*.pl', '*.al', '*.cgi', '*.fcgi', '*.perl', '*.ph', '*.plx', '*.pm', '*.psgi', '*.t'],
    mimetypes: ['text/x-perl']
  },
  'Perl 6': {
    color: '#0000fb',
    codeMirrorMode: 'perl',
    extensions: ['*.6pl', '*.6pm', '*.nqp', '*.p6', '*.p6l', '*.p6m', '*.pl', '*.pl6', '*.pm', '*.pm6', '*.t'],
    mimetypes: ['text/x-perl']
  },
  'Pod': {
    color: null,
    codeMirrorMode: 'perl',
    extensions: ['*.pod'],
    mimetypes: ['text/x-perl']
  },
  'PowerShell': {
    color: '#012456',
    codeMirrorMode: 'powershell',
    extensions: ['*.ps1', '*.psd1', '*.psm1'],
    mimetypes: ['application/x-powershell']
  },
  'Protocol Buffer': {
    color: null,
    codeMirrorMode: 'protobuf',
    extensions: ['*.proto'],
    mimetypes: ['text/x-protobuf']
  },
  'Public Key': {
    color: null,
    codeMirrorMode: 'asciiarmor',
    extensions: ['*.asc', '*.pub'],
    mimetypes: ['application/pgp']
  },
  'Puppet': {
    color: '#302B6D',
    codeMirrorMode: 'puppet',
    extensions: ['*.pp'],
    mimetypes: ['text/x-puppet']
  },
  'PureScript': {
    color: '#1D222D',
    codeMirrorMode: 'haskell',
    extensions: ['*.purs'],
    mimetypes: ['text/x-haskell']
  },
  'Python': {
    color: '#3572A5',
    codeMirrorMode: 'python',
    extensions: ['*.py', '*.bzl', '*.cgi', '*.fcgi', '*.gyp', '*.gypi', '*.lmi', '*.py3', '*.pyde', '*.pyi', '*.pyp', '*.pyt', '*.pyw', '*.rpy', '*.spec', '*.ta', ' *.wsgi', '*.xpy'],
    mimetypes: ['text/x-python']
  },
  'R': {
    color: '#198CE7',
    codeMirrorMode: 'r',
    extensions: ['*.r', '*.rd', '*.rsx'],
    mimetypes: ['text/x-rsrc']
  },
  'RAML': {
    color: '#77d9fb',
    codeMirrorMode: 'yaml',
    extensions: ['*.raml'],
    mimetypes: ['text/x-yaml']
  },
  'RHTML': {
    color: null,
    codeMirrorMode: 'htmlembedded',
    extensions: ['*.rhtml'],
    mimetypes: ['application/x-erb']
  },
  'RMarkdown': {
    color: null,
    codeMirrorMode: 'gfm',
    extensions: ['*.rmd'],
    mimetypes: ['text/x-gfm']
  },
  'RPM Spec': {
    color: null,
    codeMirrorMode: 'rpm',
    extensions: ['*.spec'],
    mimetypes: ['text/x-rpm-spec']
  },
  'Rouge': {
    color: '#cc0088',
    codeMirrorMode: 'clojure',
    extensions: ['*.rg'],
    mimetypes: ['text/x-clojure']
  },
  'Ruby': {
    color: '#701516',
    codeMirrorMode: 'ruby',
    extensions: ['*.rb', '*.builder', '*.eye', '*.fcgi', '*.gemspec', '*.god', '*.jbuilder', '*.mspec', '*.pluginspec', '*.podspec', '*.rabl', '*.rake', '*.rbuil', ' *.rbw', '*.rbx', '*.ru', '*.ruby', '*.spec', '*.thor', '*.watchr'],
    mimetypes: ['text/x-ruby']
  },
  'Rust': {
    color: '#dea584',
    codeMirrorMode: 'rust',
    extensions: ['*.rs', '*.rs.in'],
    mimetypes: ['text/x-rustsrc']
  },
  'SAS': {
    color: '#B34936',
    codeMirrorMode: 'sas',
    extensions: ['*.sas'],
    mimetypes: ['text/x-sas']
  },
  'SCSS': {
    color: null,
    codeMirrorMode: 'css',
    extensions: ['*.scss'],
    mimetypes: ['text/x-scss']
  },
  'SPARQL': {
    color: null,
    codeMirrorMode: 'sparql',
    extensions: ['*.sparql', '*.rq'],
    mimetypes: ['application/sparql-query']
  },
  'SQL': {
    color: null,
    codeMirrorMode: 'sql',
    extensions: ['*.sql', '*.cql', '*.ddl', '*.inc', '*.mysql', '*.prc', '*.tab', '*.udf', '*.viw'],
    mimetypes: ['text/x-sql']
  },
  'SQLPL': {
    color: null,
    codeMirrorMode: 'sql',
    extensions: ['*.sql', '*.db2'],
    mimetypes: ['text/x-sql']
  },
  'SRecode Template': {
    color: '#348a34',
    codeMirrorMode: 'commonlisp',
    extensions: ['*.srt'],
    mimetypes: ['text/x-common-lisp']
  },
  'SVG': {
    color: null,
    codeMirrorMode: 'xml',
    extensions: ['*.svg'],
    mimetypes: ['text/xml']
  },
  'Sage': {
    color: null,
    codeMirrorMode: 'python',
    extensions: ['*.sage', '*.sagews'],
    mimetypes: ['text/x-python']
  },
  'SaltStack': {
    color: '#646464',
    codeMirrorMode: 'yaml',
    extensions: ['*.sls'],
    mimetypes: ['text/x-yaml']
  },
  'Sass': {
    color: null,
    codeMirrorMode: 'sass',
    extensions: ['*.sass'],
    mimetypes: ['text/x-sass']
  },
  'Scala': {
    color: '#c22d40',
    codeMirrorMode: 'clike',
    extensions: ['*.scala', '*.kojo', '*.sbt', '*.sc'],
    mimetypes: ['text/x-scala']
  },
  'Scheme': {
    color: '#1e4aec',
    codeMirrorMode: 'scheme',
    extensions: ['*.scm', '*.sch', '*.sld', '*.sls', '*.sps', '*.ss'],
    mimetypes: ['text/x-scheme']
  },
  'Shell': {
    color: '#89e051',
    codeMirrorMode: 'shell',
    extensions: ['*.sh', '*.bash', '*.bats', '*.cgi', '*.command', '*.fcgi', '*.ksh', '*.sh.in', '*.tmux', '*.tool', '*.zsh'],
    mimetypes: ['text/x-sh']
  },
  'ShellSession': {
    color: null,
    codeMirrorMode: 'shell',
    extensions: ['*.sh-session'],
    mimetypes: ['text/x-sh']
  },
  'Slim': {
    color: null,
    codeMirrorMode: 'slim',
    extensions: ['*.slim'],
    mimetypes: ['text/x-slim']
  },
  'Smalltalk': {
    color: '#596706',
    codeMirrorMode: 'smalltalk',
    extensions: ['*.st', '*.cs'],
    mimetypes: ['text/x-stsrc']
  },
  'Smarty': {
    color: null,
    codeMirrorMode: 'smarty',
    extensions: ['*.tpl'],
    mimetypes: ['text/x-smarty']
  },
  'Squirrel': {
    color: '#800000',
    codeMirrorMode: 'clike',
    extensions: ['*.nut'],
    mimetypes: ['text/x-c++src']
  },
  'Standard ML': {
    color: '#dc566d',
    codeMirrorMode: 'mllike',
    extensions: ['*.ML', '*.fun', '*.sig', '*.sml'],
    mimetypes: ['text/x-ocaml']
  },
  'Swift': {
    color: '#ffac45',
    codeMirrorMode: 'swift',
    extensions: ['*.swift'],
    mimetypes: ['text/x-swift']
  },
  'SystemVerilog': {
    color: '#DAE1C2',
    codeMirrorMode: 'verilog',
    extensions: ['*.sv', '*.svh', '*.vh'],
    mimetypes: ['text/x-systemverilog']
  },
  'TOML': {
    color: null,
    codeMirrorMode: 'toml',
    extensions: ['*.toml'],
    mimetypes: ['text/x-toml']
  },
  'Tcl': {
    color: '#e4cc98',
    codeMirrorMode: 'tcl',
    extensions: ['*.tcl', '*.adp', '*.tm'],
    mimetypes: ['text/x-tcl']
  },
  'Tcsh': {
    color: null,
    codeMirrorMode: 'shell',
    extensions: ['*.tcsh', '*.csh'],
    mimetypes: ['text/x-sh']
  },
  'TeX': {
    color: '#3D6117',
    codeMirrorMode: 'stex',
    extensions: ['*.tex', '*.aux', '*.bbx', '*.bib', '*.cbx', '*.cls', '*.dtx', '*.ins', '*.lbx', '*.ltx', '*.mkii', '*.mkiv', '*.mkvi', '*.sty', '*.toc'],
    mimetypes: ['text/x-stex']
  },
  'Terra': {
    color: '#00004c',
    codeMirrorMode: 'lua',
    extensions: ['*.t'],
    mimetypes: ['text/x-lua']
  },
  'Textile': {
    color: null,
    codeMirrorMode: 'textile',
    extensions: ['*.textile'],
    mimetypes: ['text/x-textile']
  },
  'Turtle': {
    color: null,
    codeMirrorMode: 'turtle',
    extensions: ['*.ttl'],
    mimetypes: ['text/turtle']
  },
  'Twig': {
    color: null,
    codeMirrorMode: 'twig',
    extensions: ['*.twig'],
    mimetypes: ['text/x-twig']
  },
  'TypeScript': {
    color: '#2b7489',
    codeMirrorMode: 'javascript',
    extensions: ['*.ts', '*.tsx'],
    mimetypes: ['application/typescript']
  },
  'Unified Parallel C': {
    color: null,
    codeMirrorMode: 'clike',
    extensions: ['*.upc'],
    mimetypes: ['text/x-csrc']
  },
  'Unity3D Asset': {
    color: null,
    codeMirrorMode: 'yaml',
    extensions: ['*.anim', '*.asset', '*.mat', '*.meta', '*.prefab', '*.unity'],
    mimetypes: ['text/x-yaml']
  },
  'Uno': {
    color: null,
    codeMirrorMode: 'clike',
    extensions: ['*.uno'],
    mimetypes: ['text/x-csharp']
  },
  'UnrealScript': {
    color: '#a54c4d',
    codeMirrorMode: 'clike',
    extensions: ['*.uc'],
    mimetypes: ['text/x-java']
  },
  'VHDL': {
    color: '#adb2cb',
    codeMirrorMode: 'vhdl',
    extensions: ['*.vhdl', '*.vhd', '*.vhf', '*.vhi', '*.vho', '*.vhs', '*.vht', '*.vhw'],
    mimetypes: ['text/x-vhdl']
  },
  'Verilog': {
    color: '#b2b7f8',
    codeMirrorMode: 'verilog',
    extensions: ['*.v', '*.veo'],
    mimetypes: ['text/x-verilog']
  },
  'Visual Basic': {
    color: '#945db7',
    codeMirrorMode: 'vb',
    extensions: ['*.vb', '*.bas', '*.cls', '*.frm', '*.frx', '*.vba', '*.vbhtml', '*.vbs'],
    mimetypes: ['text/x-vb']
  },
  'Volt': {
    color: '#1F1F1F',
    codeMirrorMode: 'd',
    extensions: ['*.volt'],
    mimetypes: ['text/x-d']
  },
  'WebIDL': {
    color: null,
    codeMirrorMode: 'webidl',
    extensions: ['*.webidl'],
    mimetypes: ['text/x-webidl']
  },
  'XC': {
    color: '#99DA07',
    codeMirrorMode: 'clike',
    extensions: ['*.xc'],
    mimetypes: ['text/x-csrc']
  },
  'XML': {
    color: null,
    codeMirrorMode: 'xml',
    extensions: ['*.xml', '*.adml', '*.admx', '*.ant', '*.axml', '*.builds', '*.ccproj', '*.ccxml', '*.clixml', '*.cproject', '*.cscfg', '*.csdef', '*.cs', '*.csproj', '*.ct', '*.depproj', '*.dita', '*.ditamap', '*.ditaval', '*.dll.config', '*.dotsettings', '*.filters', '*.fsproj', '*.fxml', '*.glad', '*.gml', '*.gmx', '*.grxml', '*.iml', '*.ivy', '*.jelly', '*.jsproj', '*.kml', '*.launch', '*.mdpolicy', '*.mjml', '*.mm', '*.mod', '*.mxm', '*.natvis', '*.ncl', '*.ndproj', '*.nproj', '*.nuspec', '*.odd', '*.osm', '*.pkgproj', '*.plist', '*.pluginspec', '*.proj', '*.props', '*.ps1xm', '*.psc1', '*.pt', '*.rdf', '*.resx', '*.rss', '*.sch', '*.scxml', '*.sfproj', '*.shproj', '*.srdf', '*.storyboard', '*.stTheme', '*.sublime-snippe', '*.targets', '*.tmCommand', '*.tml', '*.tmLanguage', '*.tmPreferences', '*.tmSnippet', '*.tmTheme', '*.ts', '*.tsx', '*.ui', '*.urdf', '*.u', '*.vbproj', '*.vcxproj', '*.vsixmanifest', '*.vssettings', '*.vstemplate', '*.vxml', '*.wixproj', '*.workflow', '*.wsdl', '*.wsf', '*.wxi', '*.wx', '*.wxs', '*.x3d', '*.xacro', '*.xaml', '*.xib', '*.xlf', '*.xliff', '*.xmi', '*.xml.dist', '*.xproj', '*.xsd', '*.xspec', '*.xul', '*.zcml'],
    mimetypes: ['text/xml']
  },
  'XPages': {
    color: null,
    codeMirrorMode: 'xml',
    extensions: ['*.xsp-config', '*.xsp.metadata'],
    mimetypes: ['text/xml']
  },
  'XProc': {
    color: null,
    codeMirrorMode: 'xml',
    extensions: ['*.xpl', '*.xproc'],
    mimetypes: ['text/xml']
  },
  'XQuery': {
    color: '#5232e7',
    codeMirrorMode: 'xquery',
    extensions: ['*.xquery', '*.xq', '*.xql', '*.xqm', '*.xqy'],
    mimetypes: ['application/xquery']
  },
  'XS': {
    color: null,
    codeMirrorMode: 'clike',
    extensions: ['*.xs'],
    mimetypes: ['text/x-csrc']
  },
  'XSLT': {
    color: '#EB8CEB',
    codeMirrorMode: 'xml',
    extensions: ['*.xslt', '*.xsl'],
    mimetypes: ['text/xml']
  },
  'YAML': {
    color: null,
    codeMirrorMode: 'yaml',
    extensions: ['*.yml', '*.mir', '*.reek', '*.rviz', '*.sublime-syntax', '*.syntax', '*.yaml', '*.yaml-tmlanguage', '*.yml.mysql'],
    mimetypes: ['text/x-yaml']
  },
  'edn': {
    color: null,
    codeMirrorMode: 'clojure',
    extensions: ['*.edn'],
    mimetypes: ['text/x-clojure']
  },
  'reStructuredText': {
    color: null,
    codeMirrorMode: 'rst',
    extensions: ['*.rst', '*.rest', '*.rest.txt', '*.rst.txt'],
    mimetypes: ['text/x-rst']
  },
  'wisp': {
    color: '#7582D1',
    codeMirrorMode: 'clojure',
    extensions: ['*.wisp'],
    mimetypes: ['text/x-clojure']
  },
  'JSON with Comments': {
    color: null,
    codeMirrorMode: 'javascript',
    extensions: ['*.sublime-build', '*.sublime-commands', '*.sublime-completions', '*.sublime-keymap', '*.sublime-macro', '*.sublime-menu', '*.sublime-mousema', ' *.sublime-project', '*.sublime-settings', '*.sublime-theme', '*.sublime-workspace', '*.sublime_metrics', '*.sublime_session'],
    mimetypes: ['text/javascript']
  },
  'CSON': {
    color: null,
    codeMirrorMode: 'coffeescript',
    extensions: ['*.cson'],
    mimetypes: ['text/x-coffeescript']
  },
  'Pic': {
    color: null,
    codeMirrorMode: 'troff',
    extensions: ['*.pic', '*.chem'],
    mimetypes: ['text/troff']
  },
  'EBNF': {
    color: null,
    codeMirrorMode: 'ebnf',
    extensions: ['*.ebnf'],
    mimetypes: ['text/x-ebnf']
  },
  'Ignore List': {
    color: null,
    codeMirrorMode: 'shell',
    extensions: ['*.gitignore'],
    mimetypes: ['text/x-sh']
  },
  'GN': {
    color: null,
    codeMirrorMode: 'python',
    extensions: ['*.gn', '*.gni'],
    mimetypes: ['text/x-python']
  },
  'Easybuild': {
    color: null,
    codeMirrorMode: 'python',
    extensions: ['*.eb'],
    mimetypes: ['text/x-python']
  },
  'Edje Data Collection': {
    color: null,
    codeMirrorMode: 'javascript',
    extensions: ['*.edc'],
    mimetypes: ['application/json']
  },
  'Closure Templates': {
    color: null,
    codeMirrorMode: 'soy',
    extensions: ['*.soy'],
    mimetypes: ['text/x-soy']
  },
  'AngelScript': {
    color: '#C7D7DC',
    codeMirrorMode: 'clike',
    extensions: ['*.as', '*.angelscript'],
    mimetypes: ['text/x-c++src']
  },
  'Cloud Firestore Security Rules': {
    color: null,
    codeMirrorMode: 'css',
    extensions: [],
    mimetypes: ['text/css']
  },
  'HTML+Razor': {
    color: null,
    codeMirrorMode: 'htmlmixed',
    extensions: ['*.cshtml'],
    mimetypes: ['text/html']
  },
  'Java Properties': {
    color: null,
    codeMirrorMode: 'properties',
    extensions: ['*.properties'],
    mimetypes: ['text/x-properties']
  },
  'Asymptote': {
    color: '#4a0c0c',
    codeMirrorMode: 'clike',
    extensions: ['*.asy'],
    mimetypes: ['text/x-kotlin']
  },
  'Roff Manpage': {
    color: null,
    codeMirrorMode: 'troff',
    extensions: ['*.1', '*.1in', '*.1m', '*.1x', '*.2', '*.3', '*.3in', '*.3m', '*.3p', '*.3pm', '*.3qt', '*.3x', '*.4', '*.5', '*.6', '*.7', '*.8', '*.9', '*.man', '*.mdoc'],
    mimetypes: ['text/troff']
  },
  'X PixMap': {
    color: null,
    codeMirrorMode: 'clike',
    extensions: ['*.xpm', '*.pm'],
    mimetypes: ['text/x-csrc']
  },
  'X BitMap': {
    color: null,
    codeMirrorMode: 'clike',
    extensions: ['*.xbm'],
    mimetypes: ['text/x-csrc']
  },
  'Git Config': {
    color: null,
    codeMirrorMode: 'properties',
    extensions: ['*.gitconfig'],
    mimetypes: ['text/x-properties']
  },
  'Reason': {
    color: null,
    codeMirrorMode: 'rust',
    extensions: ['*.re', '*.rei'],
    mimetypes: ['text/x-rustsrc']
  },
  'Marko': {
    color: null,
    codeMirrorMode: 'htmlmixed',
    extensions: ['*.marko'],
    mimetypes: ['text/html']
  },
  'Git Attributes': {
    color: null,
    codeMirrorMode: 'shell',
    extensions: [],
    mimetypes: ['text/x-sh']
  },
  'WebAssembly': {
    color: '#04133b',
    codeMirrorMode: 'commonlisp',
    extensions: ['*.wast', '*.wat'],
    mimetypes: ['text/x-common-lisp']
  },
  'Windows Registry Entries': {
    color: null,
    codeMirrorMode: 'properties',
    extensions: ['*.reg'],
    mimetypes: ['text/x-properties']
  },
  'Common Workflow Language': {
    color: '#B5314C',
    codeMirrorMode: 'yaml',
    extensions: ['*.cwl'],
    mimetypes: ['text/x-yaml']
  },
  'LTspice Symbol': {
    color: null,
    codeMirrorMode: 'spreadsheet',
    extensions: ['*.asy'],
    mimetypes: ['text/x-spreadsheet']
  }
}

const modules = {
  apl: () => import('codemirror/mode/apl/apl.js'),
  asciiarmor: () => import('codemirror/mode/asciiarmor/asciiarmor.js'),
  'asn.1': () => import('codemirror/mode/asn.1/asn.1.js'),
  brainfuck: () => import('codemirror/mode/brainfuck/brainfuck.js'),
  clike: () => import('codemirror/mode/clike/clike.js'),
  clojure: () => import('codemirror/mode/clojure/clojure.js'),
  cmake: () => import('codemirror/mode/cmake/cmake.js'),
  cobol: () => import('codemirror/mode/cobol/cobol.js'),
  coffeescript: () => import('codemirror/mode/coffeescript/coffeescript.js'),
  commonlisp: () => import('codemirror/mode/commonlisp/commonlisp.js'),
  crystal: () => import('codemirror/mode/crystal/crystal.js'),
  css: () => import('codemirror/mode/css/css.js'),
  d: () => import('codemirror/mode/d/d.js'),
  dart: () => import('codemirror/mode/dart/dart.js'),
  diff: () => import('codemirror/mode/diff/diff.js'),
  django: () => import('codemirror/mode/django/django.js'),
  dockerfile: () => import('codemirror/mode/dockerfile/dockerfile.js'),
  dylan: () => import('codemirror/mode/dylan/dylan.js'),
  ebnf: () => import('codemirror/mode/ebnf/ebnf.js'),
  ecl: () => import('codemirror/mode/ecl/ecl.js'),
  eiffel: () => import('codemirror/mode/eiffel/eiffel.js'),
  elm: () => import('codemirror/mode/elm/elm.js'),
  erlang: () => import('codemirror/mode/erlang/erlang.js'),
  factor: () => import('codemirror/mode/factor/factor.js'),
  forth: () => import('codemirror/mode/forth/forth.js'),
  fortran: () => import('codemirror/mode/fortran/fortran.js'),
  gfm: () => import('codemirror/mode/gfm/gfm.js'),
  go: () => import('codemirror/mode/go/go.js'),
  groovy: () => import('codemirror/mode/groovy/groovy.js'),
  haml: () => import('codemirror/mode/haml/haml.js'),
  haskell: () => import('codemirror/mode/haskell/haskell.js'),
  'haskell-literate': () => import('codemirror/mode/haskell-literate/haskell-literate.js'),
  haxe: () => import('codemirror/mode/haxe/haxe.js'),
  htmlembedded: () => import('codemirror/mode/htmlembedded/htmlembedded.js'),
  htmlmixed: () => import('codemirror/mode/htmlmixed/htmlmixed.js'),
  http: () => import('codemirror/mode/http/http.js'),
  idl: () => import('codemirror/mode/idl/idl.js'),
  javascript: () => import('codemirror/mode/javascript/javascript.js'),
  jsx: () => import('codemirror/mode/jsx/jsx.js'),
  julia: () => import('codemirror/mode/julia/julia.js'),
  livescript: () => import('codemirror/mode/livescript/livescript.js'),
  lua: () => import('codemirror/mode/lua/lua.js'),
  mathematica: () => import('codemirror/mode/mathematica/mathematica.js'),
  mirc: () => import('codemirror/mode/mirc/mirc.js'),
  mllike: () => import('codemirror/mode/mllike/mllike.js'),
  modelica: () => import('codemirror/mode/modelica/modelica.js'),
  mumps: () => import('codemirror/mode/mumps/mumps.js'),
  nginx: () => import('codemirror/mode/nginx/nginx.js'),
  nsis: () => import('codemirror/mode/nsis/nsis.js'),
  octave: () => import('codemirror/mode/octave/octave.js'),
  oz: () => import('codemirror/mode/oz/oz.js'),
  pascal: () => import('codemirror/mode/pascal/pascal.js'),
  perl: () => import('codemirror/mode/perl/perl.js'),
  php: () => import('codemirror/mode/php/php.js'),
  powershell: () => import('codemirror/mode/powershell/powershell.js'),
  properties: () => import('codemirror/mode/properties/properties.js'),
  protobuf: () => import('codemirror/mode/protobuf/protobuf.js'),
  pug: () => import('codemirror/mode/pug/pug.js'),
  puppet: () => import('codemirror/mode/puppet/puppet.js'),
  python: () => import('codemirror/mode/python/python.js'),
  r: () => import('codemirror/mode/r/r.js'),
  rpm: () => import('codemirror/mode/rpm/rpm.js'),
  rst: () => import('codemirror/mode/rst/rst.js'),
  ruby: () => import('codemirror/mode/ruby/ruby.js'),
  rust: () => import('codemirror/mode/rust/rust.js'),
  sas: () => import('codemirror/mode/sas/sas.js'),
  sass: () => import('codemirror/mode/sass/sass.js'),
  scheme: () => import('codemirror/mode/scheme/scheme.js'),
  shell: () => import('codemirror/mode/shell/shell.js'),
  slim: () => import('codemirror/mode/slim/slim.js'),
  smalltalk: () => import('codemirror/mode/smalltalk/smalltalk.js'),
  smarty: () => import('codemirror/mode/smarty/smarty.js'),
  soy: () => import('codemirror/mode/soy/soy.js'),
  sparql: () => import('codemirror/mode/sparql/sparql.js'),
  spreadsheet: () => import('codemirror/mode/spreadsheet/spreadsheet.js'),
  sql: () => import('codemirror/mode/sql/sql.js'),
  stex: () => import('codemirror/mode/stex/stex.js'),
  swift: () => import('codemirror/mode/swift/swift.js'),
  tcl: () => import('codemirror/mode/tcl/tcl.js'),
  textile: () => import('codemirror/mode/textile/textile.js'),
  toml: () => import('codemirror/mode/toml/toml.js'),
  troff: () => import('codemirror/mode/troff/troff.js'),
  turtle: () => import('codemirror/mode/turtle/turtle.js'),
  twig: () => import('codemirror/mode/twig/twig.js'),
  vb: () => import('codemirror/mode/vb/vb.js'),
  verilog: () => import('codemirror/mode/verilog/verilog.js'),
  vhdl: () => import('codemirror/mode/vhdl/vhdl.js'),
  webidl: () => import('codemirror/mode/webidl/webidl.js'),
  xml: () => import('codemirror/mode/xml/xml.js'),
  xquery: () => import('codemirror/mode/xquery/xquery.js'),
  yaml: () => import('codemirror/mode/yaml/yaml.js')
}
