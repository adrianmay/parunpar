(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//This is for efficiently serialising objects you know the contents of.

//It's not a JSON replacement. It's for when you want to control exactly 
//  how things are encoded, want to do that hierarchially, and want to 
//  write the en- and decoding code near each other for each bit of the
//  hierarchy.

"use strict"

//Functional basics...

var typeOf = function(x) { return x===null ? "null" : typeof x}
var id = function(x) { return x;}
var konst = function(k) { return function (x) {return k;}}
var eq = function(a) { return function (b) { return a===b; }}
var map = function (horse) { return function (cart) { return cart.map(horse); }}

//Slightly less basic...
var runSnd = function(fs) { return function (x) { return fs[1]!==undefined ? [fs[0], fs[1](x)] : [fs[0]]}}
var thru = function (dir) { return function (ps) { return function (xs) {  
  var res = [];
  for (var i=0; i<ps.length && i<xs.length; i++) res[i] = ps[i](dir)(xs[i]);
  return res;
}}}

//A parunpar is a function of boolean that returns an encoder or decoder for true and false respectively.
//A valid one obeys the laws:
//  pp(false)( pp(true)(x) ) === x
//  pp(true)( pp(false)(x) ) === x

//Template
var id_pp    = function (dir) { return dir ? function (x) { return x; } : function (x) { return x; } ;}

//Fundamental parunpars...
var string_pp    = function (dir) { return function (x)  { return x.toString(); }}
var number_pp    = function (dir) { return dir ? function (x) { return x.toString(); } : function (x) { return Number(x); } ;}
var boolean_pp   = function (dir) { return dir ? function (x) { return x?'t':'f'; } : function (x) { return x==='t'; } ;}
var null_pp      = function (dir) { return dir ? konst('') : konst(null);}
var undefined_pp = function (dir) { return dir ? konst('') : konst(undefined);}

//Compose two parunpars. p2 is closest to the encoded text.
var pipe = function (p1) { return function (p2) { return function (dir) { return function (x) { 
  return dir ? p2(dir)(p1(dir)(x)) : p1(dir)(p2(dir)(x)) ;
}}}}

//Chops a string into fields by column widths. Result always has cols.length+1 elements.
var chop = function(cols) { return function (s) {
  var res = [], i=0;
  for ( var i=0; i<cols.length && s.length; s=s.substring(cols[i++]) )
    res.push(s.substring(0, cols[i]));
  res.push(s);  
  return res;
}}

//Maps a column list and a list of parunpars onto a parunpar that allocates a fixed width to each parunpar...
var fixedWidth = function (cols) { return function (ps) { return function (dir) { return dir ? 
  function (x) { return thru(true) (ps)(x).join('') ; } :
  function (x) { return thru(false)(ps)(chop(cols)(x)) ; }
}}}

//Maps a separator and a list of parunpars onto a parunpar that serialises each with the sep in between
//Doesn't think about what happens if the sep occurs in the serialisation of any field.
var sepBy = function (sep) { return function (ps) { return function (dir) { return dir ?
  function (x) { return thru(true) (ps)(x).join(sep); } :
  function (x) { return thru(false)(ps)(x.split(sep)) ; }
}}}

//Maps one parunpar onto one that uses esc to POST-escape occurences of sep.
//Doesn't work if sep or esc are special characters in regex syntax, so certainly not /, \ or ^
//Feel free to use borng alphanumeric characters for either.
var escape = function (sep, esc) { return function (p) { return function (dir) { return dir ?
  function (x) { return  p(true)(x).replace(RegExp(sep,'g'),sep+esc); } :
  function (x) { return  p(false)(x.replace(RegExp(sep+esc,'g'), sep)); }
}}}

//Like sepBy except that all fields are escaped to avoid conflict with the separator.
var sepByEsc = function (sep, esc) { return function (ps) { return function (dir) { return function (x) { 
  return sepBy (dir ? sep : RegExp(sep+"(?!"+esc+")","g")) ( map (escape(sep,esc)) (ps) ) (dir) (x) 
}}}}

//You can use this for everything...
var tuple = sepByEsc(';',':');

//Exercise for the reader: write something for arrays of unnknown length but homogeneous contents.

module.exports = { typeOf:typeOf, id:id, konst:konst, eq:eq, map:map, runSnd:runSnd, 
  string_pp:string_pp, number_pp:number_pp, boolean_pp:boolean_pp, null_pp:null_pp, 
  undefined_pp:undefined_pp, thru:thru, chop:chop, fixedWidth:fixedWidth, sepBy:sepBy, 
  escape:escape, sepByEsc:sepByEsc, tuple:tuple, pipe:pipe  }


},{}],2:[function(require,module,exports){
(function (global){
global.Parunpar = require('./parunpar');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./parunpar":1}]},{},[2]);
