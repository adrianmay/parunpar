//Run me with "node.js test/test.js"

var P = require('../src/parunpar.js')

var one_pp = P.tuple([P.string_pp, P.string_pp])
var multi_pp = P.tuple([one_pp, one_pp])
var super_pp = P.tuple([multi_pp, multi_pp])

var right_pp = P.tuple([P.string_pp, P.number_pp])
var left_o_raw_pp = P.tuple([P.string_pp, P.number_pp])
var left_l_raw_pp = P.fixedWidth([1])([P.string_pp, P.string_pp])
var slot_pp  = P.tuple([P.string_pp, right_pp]);
var left_o_pp = P.pipe(
  function (dir) { return function (x) { 
    return dir ? (x.length!==undefined ? [x.constructor.name, x.length] : [x.constructor.name]) 
               : (x[1]!==undefined ? global[x[0]](x[1]) : global[x[0]]() ) 
  }}
)(left_o_raw_pp);
var left_l_pp = P.pipe(
  function (dir) { return function (x) { 
    return dir ? ( P.runSnd({ string:['$', P.id], number:['#',function(x){return x.toString()}], boolean:['?',function (x) {return x?'t':'f'}], 'null':['~'], 'undefined':['_']}[P.typeOf(x)])(x) )
               : (  { '$': P.id, '#': Number, '?': P.eq('true'), '~':P.konst(null), '_':P.konst(undefined) }[x[0]](x[1]))
  }}
)(left_l_raw_pp);

var tests = [
  [P.number_pp, 321 ],
  [right_pp, ["ba;r",456] ],
  [left_o_raw_pp, ["Object"] ],
//  [left_o_raw_pp, ["Object",undefined] ],
  [left_o_raw_pp, ["Array",456] ],
  [left_l_raw_pp, ["#",'foo'] ],
  [slot_pp, ['freddy',["ba;r",456]] ],
  [multi_pp, [['one','two'],['three','four']] ],
  [multi_pp, [['on;e','two'],['three','four']] ],
  [multi_pp, [[';one','t;wo'],['thr;ee','four;']] ],
  [multi_pp, [['/one','t/wo'],['thr/ee','four/']] ],
  [super_pp, [[[';one','t;wo'],['thr;ee','four;']],[['/five','s/ix'],['sev/en','eight/']]] ],
  [left_o_pp, [1,2,4,5] ],
  [left_o_pp, { foo:2, bar:3 }],
  [left_l_pp, 321 ],
  [left_l_pp, true ],
  [left_l_pp, false ],
  [left_l_pp, "popeye" ],
  [left_l_pp, null],
  [left_l_pp, undefined],
]

for (var i=0;i<tests.length;i++) {
  var t = tests[i];
  console.log(t[1]);
  var e = t[0](true)(t[1]);
  console.log(e);
  var r = t[0](false)(e);
  console.log(r);
  console.log("============");
}

console.log(P.chop([1,4,3,5])('IWentOutDoing'));
console.log(P.chop([1,4,3,5])('IWentOutDoingNothing'));

