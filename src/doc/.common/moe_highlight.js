/*
	Language: Lofn
	Author: Belleve Invis
*/
var scope = exports.scope = {};
scope.moe = function(){
	var OPERATOR = 'operator',
		PUNCTOR = 'punctor',
		ID = 'identifier',
		NUMBER = 'number literal',
		STRING = 'string literal',
		COMMENT = 'comment',
		FLOWCTRL = 'keyword flowctrl',
		FUNCTION = 'keyword function',
		KEYWORD = 'keyword',
		LITERAL = 'literal',
		OPTION = 'preprocessor option';
	var nameTypes = {
		'is': OPERATOR, 'and': OPERATOR, 'not': OPERATOR, 'or': OPERATOR, 'in': OPERATOR,
		'as': OPERATOR, 'then': OPERATOR,
		'if': FLOWCTRL,
		'for': FLOWCTRL,
		'while': FLOWCTRL,
		'repeat': FLOWCTRL,
		'until': FLOWCTRL,
		'case': FLOWCTRL,
		'piecewise': FLOWCTRL,
		'when': FLOWCTRL,
		'function': FUNCTION,
		'return': FLOWCTRL,
		'throw': FLOWCTRL,
		'break': FLOWCTRL,
		'label': FLOWCTRL,
		'else': FLOWCTRL,
		'otherwise': FLOWCTRL,
		'var': KEYWORD,
		'def': KEYWORD,
		'this': KEYWORD,
		'true': LITERAL,
		'false': LITERAL,
		'null': LITERAL,
		'undefined': LITERAL,
		'fallthrough': KEYWORD,
		'arguments': KEYWORD,
		'callee': KEYWORD,
		'do': KEYWORD,
		'try': FLOWCTRL,
		'catch': FLOWCTRL,
		'finally': KEYWORD,
		'using': KEYWORD,
		'resend': KEYWORD,
		'new': KEYWORD,
		'wait': KEYWORD,
		'let': KEYWORD,
		'where': KEYWORD
	};
	var nameType = function (m) {
		if (nameTypes[m] > '')
			return nameTypes[m]
		else
			return ID
	};
	var symbolTypes = {
		'(': PUNCTOR,
		'[': PUNCTOR,
		'{': PUNCTOR,
		'}': PUNCTOR,
		']': PUNCTOR,
		')': PUNCTOR,
		',': PUNCTOR,
		':': PUNCTOR,
		'.': PUNCTOR,
		';': PUNCTOR,
		'\\': PUNCTOR,
	};
	var symbolType = function (m) {
		if (symbolTypes[m] > '')
			return symbolTypes[m]
		else
			return OPERATOR
	};
	var token_err = function(message, input, position){
		return new Error(message + ' at ' + position);
	}
	return function (input) {
		var entify = this.__lit;
		var make = function(t, v){
			return '<span class="' + t + '">' + v + '</span>'
		}
		var p_symbol = function (s) {
			return make(symbolType(s), entify(s));
		};
		var composeRex = function(r, o){
			var source = r.source;
			var g = r.global;
			var i = r.ignoreCase;
			var m = r.multiline;
			source = source.replace(/#\w+/g, function(word){
				word = word.slice(1);
				if(o[word] instanceof RegExp) return o[word].source
				else return word
			});
			return new RegExp(source, (g ? 'g' : '') + (i ? 'i' : '') + (m ? 'm' : ''));
		};
		var rComment = /(?:\/\/|--).*/;
		var rOption = /^-![ \t]*(.+?)[ \t]*$/;
		var rIdentifier = /[a-zA-Z_$][\w$]*/;
		var rString = composeRex(/`#identifier|'''[\s\S]*?'''|'[^'\n]*(?:''[^'\n]*)*'|"[^\\"\n]*(?:\\.[^\\"\n]*)*"/, {
			identifier: rIdentifier
		});
		var rNumber = /0[xX][a-fA-F0-9]+|\d+(?:\.\d+(?:[eE]-?\d+)?)?/;
		var rSymbol = /\.{1,3}|<-|[+\-*\/<>=!%~|&][<>=~|&]*|:[:>]|[()\[\]\{\}@\\;,#:]/;
		var rToken = composeRex(/(#comment)|(?:#option)|(#identifier)|(#string)|(#number)|(#symbol)/gm, {
			comment: rComment,
			option: rOption,
			identifier: rIdentifier,
			string: rString,
			number: rNumber,
			symbol: rSymbol
		});

		return '<pre class="mghl source moe">' + input.replace(rToken, function (match, comment, option, nme, string, number, symbol) {
			if (comment){
				if(match.slice(0, 3) === '//:'){
					return '<annotation id="' + match.slice(3) + '" />'
				} else
					return make(COMMENT, entify(match));
			} else if(option) {
				return make(OPTION, match);
			} if (nme) {
				return make(nameType(match), match)
			} else if (string) {
				return make(STRING, entify(match));
			} else if (number) {
				return make(NUMBER, match);
			} else if (symbol) {
				return p_symbol(match);
			} else {
				return match
			}
		}).replace(/\t/g, '    ') + '</pre>';
	}
}();
