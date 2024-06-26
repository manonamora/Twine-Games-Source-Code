Config.passages.nobr = true;
Config.saves.slots = 3;

var settingFontFamily = ["Serif", "Sans Serif", "Monospace"]; 
var fontFamily = function() {
var $html = $("html"); 
    $html.removeClass("serif sansserif monospace");
switch (settings.fontFamily) { 
    case "Serif":
        $html.addClass("serif");
        break;
    case "Sans Serif":
        $html.addClass("sansserif");
        break;
    case "Monospace":
        $html.addClass("monospace");
        break;
}};
Setting.addList("fontFamily", {
    label		: "Change font type",
    list		: settingFontFamily,
    default     : "Monospace", 
    onInit		: fontFamily,
    onChange	: fontFamily
});	


var settingFontSize = ["75%", "100%", "125%", "150%"];
var resizeFont = function() {
var size = document.getElementById("passages"); 
switch (settings.fontSize) {
    case "100%":
        size.style.fontSize = "100%";
        break;
    case "75%":
        size.style.fontSize = "75%";
        break;
    case "125%":
        size.style.fontSize = "125%";
        break;
    case "150%":
        size.style.fontSize = "150%";
        break;
}
};
Setting.addList("fontSize", {
    label		: "Change Font Size",
    list		: settingFontSize,
    default     : "100%",
    onInit		: resizeFont,
    onChange	: resizeFont
});


// continue.min.js, for SugarCube 2, by Chapel
// v1.0.1, 2024-02-20, 1d7a524b6004aa67a99f9037e0c3bf2b537193d5
;!function(){"use strict";var n=["a",":button",'*[role="button"]',".continue-macro-ignore","#ui-bar","#ui-dialog"],t=0;function o(){$(document).on("click.continue-macro keyup.continue-macro",n.join(", "),(function(n){n.stopPropagation()}))}function e(){if(State.length>0)return!1;var t=[].slice.call(arguments).flatten();return n=n.concat(t),!0}function c(n,o){var e=function(){var n="."+Date.now().toString(36)+"-"+t;return t++,n}();if(o&&"function"==typeof o){var c="click.continue-macro"+e;n&&(c=c+" keyup.continue-macro"+e),$(document).one(c,(function(){o.call(),$(document).off(e)}))}}prehistory["%%continue-expiration"]=function(){t=0},$(document).one(":passagerender",(function(){o()})),Macro.add("ignore",{handler:function(){if(!e(this.args))return this.error("the <<ignore>> macro should only be run from StoryInit or equivalent.")}}),Macro.add("cont",{tags:null,handler:function(){var n,t=this.args.includes("append"),o=this.args.includesAny("key","keypress","press","button"),e=this.payload[0].contents;t&&(n=$(document.createElement("span")).addClass("macro-"+this.name).appendTo(this.output)),c(o,this.createShadowWrapper((function(){t&&n&&n instanceof $?n.wiki(e):$.wiki(e)})))}}),setup.cont=c,setup.cont.ignore=e,setup.cont.reset=function(){var t=[].slice.call(arguments).flatten();n=n.concat(t),$(document).off(".continue-macro"),o()},window.cont=window.cont||setup.cont}();
// end continue.min.js
// dialog-api-macro-set.min.js, for SugarCube 2, by Chapel
// v1.3.0, 2024-02-20, 1d7a524b6004aa67a99f9037e0c3bf2b537193d5
;Macro.add("dialog",{tags:["onopen","onclose"],handler:function(){var t="",s=null,n=null,o=this.args.length>0?this.args[0]:"",e=this.args.length>1?this.args.slice(1).flatten():[];this.payload.forEach((function(o,e){0===e?t=o.contents:"onopen"===o.name?s=s?s+o.contents:o.contents:n=n?n+o.contents:o.contents})),e.push("macro-"+this.name),Dialog.setup(o,e.join(" ")),Dialog.wiki(t),s&&"string"==typeof s&&s.trim()&&$(document).one(":dialogopened",(function(){$.wiki(s)})),n&&"string"==typeof n&&n.trim()&&$(document).one(":dialogclosed",(function(){$.wiki(n)})),Dialog.open()}}),Macro.add("popup",{handler:function(){if(this.args.length<1)return this.error("need at least one argument; the passage to display");if(!Story.has(this.args[0]))return this.error("the passage "+this.args[0]+"does not exist");var t=this.args[0],s=this.args.length>1?this.args[1]:"",n=this.args.length>2?this.args.slice(2).flatten():[];n.push("macro-"+this.name),Dialog.setup(s,n.join(" ")),Dialog.wiki(Story.get(t).processText()),Dialog.open()}}),Macro.add("dialogclose",{skipArgs:!0,handler:function(){Dialog.close()}});
// end dialog-api-macro-set.min.js
(function () {
	"use strict";

	$(document).on(":liveupdate", function () {
		$(".macro-live").trigger(":liveupdateinternal");
	});

	Macro.add(['update', 'upd'], {
		handler: function handler() {
			$(document).trigger(":liveupdate");
		}
	});

	Macro.add(['live', 'l', 'lh'], {
		skipArgs: true,
		handler: function handler() {
			if (this.args.full.length === 0) {
				return this.error('no expression specified');
			}
			try {
				var statement = this.args.full;
				var result = toStringOrDefault(Scripting.evalJavaScript(statement), null);
				if (result !== null) {
					var lh = this.name === "lh";
					var $el = $("<span></span>").addClass("macro-live").wiki(lh ? Util.escape(result) : result).appendTo(this.output);
					$el.on(":liveupdateinternal", this.createShadowWrapper(function (ev) {
						var out = toStringOrDefault(Scripting.evalJavaScript(statement), null);
						$el.empty().wiki(lh ? Util.escape(out) : out);
					}));
				}
			} catch (ex) {
				return this.error("bad evaluation: " + (_typeof(ex) === 'object' ? ex.message : ex));
			}
		}
	});

	Macro.add(['liveblock', 'lb'], {
		tags: null,
		handler: function handler() {
			try {
				var content = this.payload[0].contents.trim();
				if (content) {
					var $el = $("<span></span>").addClass("macro-live macro-live-block").wiki(content).appendTo(this.output);
					$el.on(":liveupdateinternal", this.createShadowWrapper(function (ev) {
						$el.empty().wiki(content);
					}));
				}
			} catch (ex) {
				return this.error("bad evaluation: " + (_typeof(ex) === 'object' ? ex.message : ex));
			}
		}
	});
})();