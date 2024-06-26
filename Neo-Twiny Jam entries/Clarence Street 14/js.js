setup.i18n = {
	langs : {
		'English'  : 'en',
		'Français' : 'fr',
    },

	codes : function () {
		return Object.keys(this.langs).map(function (label) {
			return this.langs[label];
		}, this);
	},

	labels : function () {
		return Object.keys(this.langs);
	},

	labelFromCode : function (code) {
		var label = Object.keys(this.langs).find(function (label) {
			return this.langs[label] === code;
		}, this);

		if (!label) {
			throw new Error('unknown language code "' + code + '"');
		}

		return label;
	}
};
function initLanguage() {
	switch (setup.i18n.langs[settings.lang]) {
	case 'fr':
		l10nStrings.ok = 'OK',
		l10nStrings.settingsTitle = 'Paramètres';
		l10nStrings.settingsOff   = 'Off';
		l10nStrings.settingsOn    = 'On';
		l10nStrings.settingsReset = 'Réinitialiser';
		l10nStrings.cancel =  "Annuler";
		break;			
	case 'en':
		l10nStrings.ok = 'OK',
		l10nStrings.settingsOk = 'Confirm';
		l10nStrings.settingsTitle = 'Settings';
		l10nStrings.settingsOff   = 'Off';
		l10nStrings.settingsOn    = 'On';
		l10nStrings.settingsReset = 'Reset to Defaults';
		l10nStrings.cancel =  "Cancel";
		break;
}
	$('html').attr('lang', setup.i18n.langs[settings.lang]);
}
function changeLanguage() {
	window.location.reload();
}
postrender['i18n-passage-include'] = function (content) {
	var passage = State.passage + '_' + setup.i18n.langs[settings.lang];
	
	$(content).empty().wiki(Story.get(passage).processText());
};
Setting.addList('lang', {
	label    : 	`<<switch settings.lang>>
        			<<case "English">>Change Language.
        			<<case "Français">>Changer la Langue.
    			<</switch>>`,
	list     : setup.i18n.labels(),
	default  : setup.i18n.labelFromCode('en'),
	onInit   : initLanguage,
	onChange : changeLanguage
});

;Macro.add("dialog",{tags:["onopen","onclose"],handler:function(){var t="",s=null,n=null,o=this.args.length>0?this.args[0]:"",e=this.args.length>1?this.args.slice(1).flatten():[];this.payload.forEach((function(o,e){0===e?t=o.contents:"onopen"===o.name?s=s?s+o.contents:o.contents:n=n?n+o.contents:o.contents})),e.push("macro-"+this.name),Dialog.setup(o,e.join(" ")),Dialog.wiki(t),s&&"string"==typeof s&&s.trim()&&$(document).one(":dialogopened",(function(){$.wiki(s)})),n&&"string"==typeof n&&n.trim()&&$(document).one(":dialogclosed",(function(){$.wiki(n)})),Dialog.open()}}),Macro.add("popup",{handler:function(){if(this.args.length<1)return this.error("need at least one argument; the passage to display");if(!Story.has(this.args[0]))return this.error("the passage "+this.args[0]+"does not exist");var t=this.args[0],s=this.args.length>1?this.args[1]:"",n=this.args.length>2?this.args.slice(2).flatten():[];n.push("macro-"+this.name),Dialog.setup(s,n.join(" ")),Dialog.wiki(Story.get(t).processText()),Dialog.open()}}),Macro.add("dialogclose",{skipArgs:!0,handler:function(){Dialog.close()}});