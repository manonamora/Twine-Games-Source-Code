/* ----------------------- UTILITY BUNDLE ----------------------- */
/* ------------------- ONLY ONE COPY NEEDED! -------------------- */

window.MalisMacros={wikiWrapper:function(t,e){const r={};"object"==typeof t&&$.each(t,((t,e)=>{r[t]=State.temporary?.[t],State.temporary[t]=e}));try{e()}finally{$.each(r,((t,e)=>{State.temporary[t]=e}))}},on_macro_events:[],version: '1.0'},Array.prototype.attrFinder=function(t,e){const r=this.indexOf(t);if(-1!==r){const[a]=this.deleteAt(r+1);return this.delete(t),e&&e.attr(`data-${t}`,a),a}return!1},Array.prototype.payloadsToObj=function(){const t={default:this[0].contents};return this.slice(1).forEach((e=>{t[e.name]=e})),t},Array.prototype.unpack=function(){let t=0,e=this;for(;t<e.length;){const r=e[t];Array.isArray(r)?e.deleteAt(t)[0].forEach((t=>e.push(t))):"object"!=typeof r||r.isLink?t++:$.each(e.deleteAt(t)[0],((t,r)=>{e.push(t.toLowerCase()),e.push(r)}))}if(e.length%2)throw new Error("Non-object arguments should always come in pairs. "+(e.includes("disabled")?"Even the 'disabled' attribute.":""));return e},$.fn.extend({applyAttr:function(t){for(let e=0;e<t.length;e+=2)this.attr(t[e],t[e+1]);return this},runOutput:function(t,e){if(e)switch(t){case"rep":$(e.args[0]??this.parent()).empty().wiki(e.contents);break;case"prep":$(document.createDocumentFragment()).wiki(e.contents).prependTo(e.args[0]??this.parent());break;case"app":$(e.args[0]??this.parent()).wiki(e.contents);break;case"diag":Dialog.setup(e.args?.[0],e.args?.[1]),Dialog.wiki(e.contents),Dialog.open();break;case"refresh":this.empty().wiki(e);break;default:$.wiki(e)}},diagFrom:function(t,e){const r=this.offset().top-this.height()/2,a=this.offset().left-this.width()/2;return{distance:Math.hypot(r-e,a-t),top:e-r,left:t-a}}});

/* ------------------- END OF UTILITY BUNDLE -------------------- */

/* Mali's <<listen>> macro for Sgarcube*/

Macro.add('listen', {
	tags: ['when'],
	isAsync : true,
	handler() {
		
	if (window.MalisMacros === undefined) return this.error(`<<${this.name}>> needs a utility bundle to function! It can be downloaded there: https://github.com/MalifaciousGames/Mali-s-Macros/blob/main/utility-bundle/utility-bundle-min.js . Much love, Maliface!`);
	const payloads = {}, events = [],
              wrapper = $(document.createElement(this.args[0] || 'span')).applyAttr(this.args.slice(1).unpack());
      
      	this.payload.slice(1).forEach(tag => {
          	const event = tag.args[0]?.toLowerCase() ?? 'change';
          	event.split(/\s|,/g).forEach(e => {
              		if (e) { //Not empty string
        			payloads[e] = tag.contents;
          			events.push(e);
                	}
            	});
        });

	wrapper.on(events.join(' '), this.createShadowWrapper(
        	(e) => {MalisMacros.wikiWrapper({event : e},
                	() => {$.wiki(payloads[e.type])}
		)}
        )).wiki(this.payload[0].contents).appendTo(this.output);
}});


  // SETTING ORIENTATION AND POSITIONING TEXT

  // force fullscreen portrait mode on mobile
  function lock(orientation) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
        .catch((err) => {
          console.error('Error attempting to enable full-screen mode:', err);
        });
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen()
        .catch((err) => {
          console.error('Error attempting to enable full-screen mode:', err);
        });
    }
  
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock(orientation)
        .catch((err) => {
          console.error('Error attempting to lock screen orientation:', err);
        });
    } else if (screen.lockOrientation) {
      screen.lockOrientation(orientation)
        .catch((err) => {
          console.error('Error attempting to lock screen orientation:', err);
        });
    }
  };
  // end force fullscreen
// fs.js v1.1.0; for SugarCube 2, by chapel

//MALIFACE EDIT OF EXPORT
Macro.add('export', {
    handler () {
       saveAs(new Blob([JSON.stringify(this.args)], { type : 'text/plain;charset=UTF-8'}), 'TheRoadsNotTakenTranscript.txt');
    }
  });

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

// dialog API macro set, by chapel; for sugarcube 2
// version 1.3.0
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#dialog-api-macros

// <<dialog>> macro
Macro.add('dialog', {
    tags : ['onopen', 'onclose'],
 handler : function () {
     
     // handle args (if any)
     var errors = [];
     var content = '', onOpen = null, onClose = null;
     var title = (this.args.length > 0) ? this.args[0] : '';
     var classes = (this.args.length > 1) ? this.args.slice(1).flatten() : [];

     this.payload.forEach( function (pl, idx) {
         if (idx === 0) {
             content = pl.contents;
         } else {
             if (pl.name === 'onopen') {
                 onOpen = onOpen ? onOpen + pl.contents : pl.contents;
             } else {
                 onClose = onClose ? onClose + pl.contents : pl.contents;
             }
         }
     });
     
     // add the macro- class
     classes.push('macro-' + this.name);
     
     // dialog box
     Dialog.setup(title, classes.join(' '));
     Dialog.wiki(content);

     // should these be shadowWrapper-aware?
     if (onOpen && typeof onOpen === 'string' && onOpen.trim()) {
         $(document).one(':dialogopened', function () {
             $.wiki(onOpen);
         });
     }

     if (onClose && typeof onClose === 'string' && onClose.trim()) {
         $(document).one(':dialogclosed', function () {
             $.wiki(onClose);
         });
     }

     Dialog.open();
     
 }

});

// <<popup>> macro
Macro.add('popup', {
 handler : function () {
     
     // errors
     if (this.args.length < 1) {
         return this.error('need at least one argument; the passage to display');
     }
     if (!Story.has(this.args[0])) {
         return this.error('the passage ' + this.args[0] + 'does not exist');
     }
     
     // passage name and title
     var psg   = this.args[0];
     var title = (this.args.length > 1) ? this.args[1] : '';
     var classes = (this.args.length > 2) ? this.args.slice(2).flatten() : [];
     
     // add the macro- class
     classes.push('macro-' + this.name);
     
     // dialog box
     Dialog.setup(title, classes.join(' '));
     Dialog.wiki(Story.get(psg).processText());
     Dialog.open();
     
 }

});

// <<dialogclose>> macro
Macro.add('dialogclose', { 
 skipArgs : true, 
 handler : function () {
     Dialog.close();
 } 
});
// event macro set, by chapel; for sugarcube 2
// version 2.0.0

(function () {
    setup.eventMacroNamespace = 'macro-event';

    // the <<trigger>> macro
    Macro.add('trigger', {
        handler : function () {
            
            // declare vars
            var evt, $el;
            
            // check for errors
            if (this.args.length > 2 || this.args.length === 0) {
                return this.error('incorrect number of arguments');
            }
            if (typeof this.args[0] != 'string') {
                return this.error('first argument should be a string and a valid event type');
            }
            
            // some setup
            evt = this.args[0];
            $el = (this.args.length === 1 ||
                (this.args[1] && typeof this.args[1] === 'string' &&
                this.args[1].toLowerCase().trim() === 'document')) ?
                $(document) : $(this.args[1]);
            
            // fire the event
            $el.trigger(evt);
            
        }
    });

    // the <<event>> macro: <<event type [selector] [once]>>
    Macro.add(['event', 'on', 'one'], {
           tags : ['which'],
        handler : function () {
            
            var payload = this.payload;
            var method = 'on';
            var evt, sel = '', code = '', i;
            
            if (this.args.length > 3 || this.args.length === 0) {
                return this.error('incorrect number of arguments');
            }
            if (typeof this.args[0] != 'string') {
                return this.error('first argument should be a string and a valid event type');
            }
            if (this.args.length === 2 && typeof this.args[1] == 'string' && this.args[1] !== 'once') {
                sel = this.args[1];
            }
            
            if (this.args.includes('once') || this.name === 'one') {
                method = 'one';
            }

            evt = this.args[0];
            
            $(document)[method](evt + '.' + setup.eventMacroNamespace, sel, this.createShadowWrapper(function (e) {
                code = payload[0].contents;
                if (payload.length > 1) {
                    for (i = 1; i < payload.length; i++) {
                        if (payload[i].args.includes(e.which)) {
                            code = code + payload[i].contents;
                        }
                    }
                }
                new Wikifier(null, code);
            }));
            
        }
    });

    Macro.add('off', {
        handler : function () {
            
            // declare vars
            var evt, $el;
            
            // check for errors
            if (this.args.length > 2 || this.args.length === 0) {
                return this.error('incorrect number of arguments');
            }
            if (typeof this.args[0] != 'string') {
                return this.error('first argument should be a string and a valid event type or namespace');
            }
            
            // some setup
            evt = this.args[0];
            $el = (this.args.length === 1 ||
                (this.args[1] && typeof this.args[1] === 'string' &&
                this.args[1].toLowerCase().trim() === 'document')) ?
                $(document) : $(this.args[1]);
            
            // fire the event
            $el.off(evt);
            
        }
    });

}());

// fading macro set, by chapel; for SugarCube 2
// version 1.1.0
// see the documentation: https://github.com/ChapelR/custom-macros-for-sugarcube-2#fading-macros

// <<fadein>> macro
Macro.add('fadein', {
    tags : null,
 handler : function () {

     var $wrapper = $(document.createElement('span'));
     var content  = this.payload[0].contents, time, delay;

     if (this.args.length === 0) {
         return this.error('no arguments given');
     }
     
     time  = Util.fromCssTime(this.args[0]);
     delay = (this.args.length > 1) ?  Util.fromCssTime(this.args[1]) : 0;

     $wrapper
         .wiki(content)
         .addClass('macro-' + this.name)
         .appendTo(this.output)
         .hide()
         .delay(delay)
         .fadeIn(time);

 }
});

// <<fadeout>> macro
Macro.add('fadeout', {
    tags : null,
 handler : function () {

     var $wrapper = $(document.createElement('span'));
     var content  = this.payload[0].contents, time, delay;

     if (this.args.length === 0) {
         return this.error('no arguments given');
     }
     
     time  = Util.fromCssTime(this.args[0]);
     delay = (this.args.length > 1) ?  Util.fromCssTime(this.args[1]) : 0;

     $wrapper
         .wiki(content)
         .addClass('macro-' + this.name)
         .appendTo(this.output)
         .delay(delay)
         .fadeOut(time);

 }
});