

//some sources
/*
https://medium.com/@jackub/writing-custom-ace-editor-mode-5a7aa83dbe50
https://ace.c9.io/#nav=higlighter
https://ace.c9.io/tool/mode_creator.html

and look into the already defined modes e.g.
/node_modules/ace-builds/src/mode-java.js
 */


define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
  "use strict";

  var oop = require("ace/lib/oop");
  var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

  var DocCommentHighlightRules = function() {
    this.$rules = {
      "start" : [ {
        token : "comment.doc.tag",
        regex : "@[\\w\\d_]+" // TODO: fix email addresses
      },
        DocCommentHighlightRules.getTagRule(),
        {
          defaultToken : "comment.doc",
          caseInsensitive: true
        }]
    };
  };

  oop.inherits(DocCommentHighlightRules, TextHighlightRules);

  DocCommentHighlightRules.getTagRule = function(start) {
    return {
      token : "comment.doc.tag.storage.type",
      regex : "\\b(?:TODO|FIXME|XXX|HACK)\\b"
    };
  };

  DocCommentHighlightRules.getStartRule = function(start) {
    return {
      token : "comment.doc", // doc comment
      regex : "\\/\\*(?=\\*)",
      next  : start
    };
  };

  DocCommentHighlightRules.getEndRule = function (start) {
    return {
      token : "comment.doc", // closing comment
      regex : "\\*\\/",
      next  : start
    };
  };


  exports.DocCommentHighlightRules = DocCommentHighlightRules;

});

// This is where we really create the highlighting rules
define('ace/mode/bbgel_highlight_rules', ['require', 'exports', 'ace/lib/oop', 'ace/mode/text_highlight_rules', 'ace/mode/doc_comment_highlight_rules'], (acequire, exports) => {
  const oop = acequire('ace/lib/oop');
  const TextHighlightRules = acequire('ace/mode/text_highlight_rules').TextHighlightRules;
  const DocCommentHighlightRules = acequire("ace/mode/doc_comment_highlight_rules").DocCommentHighlightRules;

  const BbgelHighlightRules = function() {

    var keywords = (
      "if|then|else|end|control|goto|true|false|int|bool|force|" +
      "game|players|return|result"
    );

    var buildinConstants = (
      "" +
      "$leftSteps|$result|$return|cp|np|pp|current_player|next_player|previous_player"
    );


    var langClasses = (
      "choose_bool|sleep|roll|log|move|rollback|game_end|game_start|begin_scope|end_scope|limit_scope|scope_limit|scope_fence"
    );

    var keywordMapper = this.createKeywordMapper({
      "variable.language": "this",
      "keyword": keywords,
      "constant.language": buildinConstants,
      "support.function": langClasses
    }, "identifier");

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
      "start" : [
        DocCommentHighlightRules.getStartRule("doc-start"),
        {
          token : "comment", // multi line comment
          regex : "\\/\\*",
          next : "comment"
        }, {
          token : "constant.numeric",
          regex : /(?:\d+)\b/
        }, {
          token : "constant.language.boolean",
          regex : "(?:true|false)\\b"
        }, {
          token : "keyword.operator",
          regex : "!|%|\\*|\\-\\-|\\-|\\+\\+|\\+|==|=|!=|<=|>=|<>|<|>|!|&&|\/|\\?\\:|or|and|not"
        },
        {
          token : keywordMapper,
          regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        },  {
          token : "lparen",
          regex : "[[({]"
        }, {
          token : "rparen",
          regex : "[\\])}]"
        }, {
          token : "text",
          regex : "\\s+"
        }
      ],
      "comment" : [
        {
          token : "comment", // closing comment
          regex : "\\*\\/",
          next : "start"
        }, {
          defaultToken : "comment"
        }
      ]
    };


    this.embedRules(DocCommentHighlightRules, "doc-",
      [ DocCommentHighlightRules.getEndRule("start") ]);
    this.normalizeRules();
  };

  oop.inherits(BbgelHighlightRules, TextHighlightRules);

  exports.BbgelHighlightRules = BbgelHighlightRules;
});



define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], (acequire, exports) => {
  "use strict";

  var oop = acequire("ace/lib/oop");
  var Range = acequire("ace/range").Range;
  var BaseFoldMode = acequire("ace/mode/folding/fold_mode").FoldMode;

  var FoldMode = exports.FoldMode = function(commentRegex) {
    if (commentRegex) {
      this.foldingStartMarker = new RegExp(
        this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
      );
      this.foldingStopMarker = new RegExp(
        this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
      );
    }
  };
  oop.inherits(FoldMode, BaseFoldMode);

  (function() {

    this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
    this.singleLineBlockCommentRe= /^\s*(\/\*).*\*\/\s*$/;
    this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
    this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
    this._getFoldWidgetBase = this.getFoldWidget;
    this.getFoldWidget = function(session, foldStyle, row) {
      var line = session.getLine(row);

      if (this.singleLineBlockCommentRe.test(line)) {
        if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
          return "";
      }

      var fw = this._getFoldWidgetBase(session, foldStyle, row);

      if (!fw && this.startRegionRe.test(line))
        return "start"; // lineCommentRegionStart

      return fw;
    };

    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
      var line = session.getLine(row);

      if (this.startRegionRe.test(line))
        return this.getCommentRegionBlock(session, line, row);

      var match = line.match(this.foldingStartMarker);
      if (match) {
        var i = match.index;

        if (match[1])
          return this.openingBracketBlock(session, match[1], row, i);

        var range = session.getCommentFoldRange(row, i + match[0].length, 1);

        if (range && !range.isMultiLine()) {
          if (forceMultiline) {
            range = this.getSectionRange(session, row);
          } else if (foldStyle != "all")
            range = null;
        }

        return range;
      }

      if (foldStyle === "markbegin")
        return;

      var match = line.match(this.foldingStopMarker);
      if (match) {
        var i = match.index + match[0].length;

        if (match[1])
          return this.closingBracketBlock(session, match[1], row, i);

        return session.getCommentFoldRange(row, i, -1);
      }
    };

    this.getSectionRange = function(session, row) {
      var line = session.getLine(row);
      var startIndent = line.search(/\S/);
      var startRow = row;
      var startColumn = line.length;
      row = row + 1;
      var endRow = row;
      var maxRow = session.getLength();
      while (++row < maxRow) {
        line = session.getLine(row);
        var indent = line.search(/\S/);
        if (indent === -1)
          continue;
        if  (startIndent > indent)
          break;
        var subRange = this.getFoldWidgetRange(session, "all", row);

        if (subRange) {
          if (subRange.start.row <= startRow) {
            break;
          } else if (subRange.isMultiLine()) {
            row = subRange.end.row;
          } else if (startIndent == indent) {
            break;
          }
        }
        endRow = row;
      }

      return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };
    this.getCommentRegionBlock = function(session, line, row) {
      var startColumn = line.search(/\s*$/);
      var maxRow = session.getLength();
      var startRow = row;

      var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
      var depth = 1;
      while (++row < maxRow) {
        line = session.getLine(row);
        var m = re.exec(line);
        if (!m) continue;
        if (m[1]) depth--;
        else depth++;

        if (!depth) break;
      }

      var endRow = row;
      if (endRow > startRow) {
        return new Range(startRow, startColumn, endRow, line.length);
      }
    };

  }).call(FoldMode.prototype);

});

define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"], function(require, exports, module) {
  "use strict";

  var Range = require("ace/range").Range;

  var MatchingBraceOutdent = function() {};

  (function() {

    this.checkOutdent = function(line, input) {
      if (! /^\s+$/.test(line))
        return false;

      return /^\s*\}/.test(input);
    };

    this.autoOutdent = function(doc, row) {
      var line = doc.getLine(row);
      var match = line.match(/^(\s*\})/);

      if (!match) return 0;

      var column = match[1].length;
      var openBracePos = doc.findMatchingBracket({row: row, column: column});

      if (!openBracePos || openBracePos.row == row) return 0;

      var indent = this.$getIndent(doc.getLine(openBracePos.row));
      doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
      return line.match(/^\s*/)[0];
    };

  }).call(MatchingBraceOutdent.prototype);

  exports.MatchingBraceOutdent = MatchingBraceOutdent;
});


define('ace/mode/bbgel', ['require', 'exports', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/custom_highlight_rules', 'ace/mode/folding/cstyle', 'ace/mode/matching_brace_outdent'], (acequire, exports) => {
  const oop = acequire('ace/lib/oop');
  const TextMode = acequire('ace/mode/text').Mode;
  const CustomHighlightRules = acequire('ace/mode/bbgel_highlight_rules').BbgelHighlightRules;
  const MatchingBraceOutdent = acequire("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
  const CStyleFoldMode = acequire("ace/mode/folding/cstyle").FoldMode;

  const Mode = function() {
    // set everything up
    this.HighlightRules = CustomHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.foldingRules = new CStyleFoldMode();
  };


  oop.inherits(Mode, TextMode); // ACE's way of doing inheritance

  exports.Mode = Mode; // eslint-disable-line no-param-reassign
});

(function() {
  window.require(["ace/mode/bbgel"], function(m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();