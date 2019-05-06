function lzw_encode(s) {
    if (!s) return s;
    var dict = new Map(); // Use a Map!
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i = 1; i < data.length; i++) {
        currChar = data[i];
        if (dict.has(phrase + currChar)) {
            phrase += currChar;
        } else {
            out.push(phrase.length > 1 ? dict.get(phrase) : phrase.charCodeAt(0));
            dict.set(phrase + currChar, code);
            code++;
            phrase = currChar;
        }
    }
    out.push(phrase.length > 1 ? dict.get(phrase) : phrase.charCodeAt(0));
    for (var i = 0; i < out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}

function lzw_decode(s) {
    var dict = new Map(); // Use a Map!
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i = 1; i < data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        } else {
            phrase = dict.has(currCode) ? dict.get(currCode) : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict.set(code, oldPhrase + currChar);
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}

function encode_utf8(s) {
    return encodeURIComponent(s).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        });
}

function decode_utf8(s) {
    return decodeURIComponent(s.split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

export {encode_utf8, decode_utf8, lzw_decode, lzw_encode};