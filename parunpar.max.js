(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict"

var typeOf = function(x) { return x===null ? 'null' : typeof x}
var id = function(x) { return x;}
var konst = function(k) { return function (x) {return k;}}
var eq = function(a) { return function (b) { return a===b; }}
var map = function (horse) { return function (cart) { return cart.map(horse); }}
var runSnd = function(fs) { return function (x) { return fs[1]!==undefined ? [fs[0], fs[1](x)] : [fs[0]]}}

var string_pp    = function (dir) { return function (x)  { return x; }}
var number_pp    = function (dir) { return function (x)  { return dir ? x.toString() : Number(x); }}
var boolean_pp   = function (dir) { return function (x)  { return dir ? (x ? 't' : 'f') : (x==='t'); }}
var null_pp      = function (dir) { return function (x)  { return dir ? '' : null; }}
var undefined_pp = function (dir) { return function (x)  { return dir ? '' : undefined; }}

var thru = function (dir) { return function (ps) { return function (xs) {  
  var res = [];
  for (var i=0; i<ps.length && i<xs.length; i++) res[i] = ps[i](dir)(xs[i]);
  return res;
}}}

var chop = function(cols) { return function (s) {
  var res = [], i=0;
  for ( var i=0; i<cols.length && s.length; s=s.substring(cols[i++]) )
    res.push(s.substring(0, cols[i]));
  if (s.length) res.push(s);  
  return res;
}}

var fixedWidth = function (cols) { return function (ps) { return function (dir) { return function (x) { 
  return dir ? thru(dir)(ps)(x).join('') : thru(dir)(ps)(chop(cols)(x)) ;
}}}}

var sepBy = function (sep) { return function (ps) { return function (dir) { return function (x) { 
  return dir ? thru(dir)(ps)(x).join(sep) : thru(dir)(ps)(x.split(sep)) ;
}}}}

var escape = function (sep, esc) { return function (p) { return function (dir) { return function (x) { 
  return dir ? p(dir)(x).replace(RegExp(sep,'g'),sep+esc) : p(dir)(x.replace(RegExp(sep+esc,'g'), sep));
}}}}

var sepByEsc = function (sep, esc) { return function (ps) { return function (dir) { return function (x) { 
  return sepBy (dir ? sep : RegExp(sep+"(?!"+esc+")","g")) ( map (escape(sep,esc)) (ps) ) (dir) (x) 
}}}}

var tuple = sepByEsc(';',':');

var pipe = function (p1) { return function (p2) { return function (dir) { return function (x) { 
  return dir ? p2(dir)(p1(dir)(x)) : p1(dir)(p2(dir)(x)) ;
}}}}

module.exports = { typeOf:typeOf, id:id, konst:konst, eq:eq, map:map, runSnd:runSnd, 
  string_pp:string_pp, number_pp:number_pp, boolean_pp:boolean_pp, null_pp:null_pp, 
  undefined_pp:undefined_pp, thru:thru, chop:chop, fixedWidth:fixedWidth, sepBy:sepBy, 
  escape:escape, sepByEsc:sepByEsc, tuple:tuple, pipe:pipe  }


},{}],2:[function(require,module,exports){
(function (global){
global.Parunpar = require('./parunpar');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./parunpar":1}]},{},[2]);
