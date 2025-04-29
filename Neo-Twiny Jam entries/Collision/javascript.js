Config.navigation.override = function (dest) {
	var sv = State.variables;
  	if (sv.crash === 6) {
		return "ActualEnd";
	}
	else if (sv.turn === 6) {
		return "Crash";
	}
};

$(document).on('keyup', function(event) {
    if (event.key === 'ArrowLeft') {
        Engine.backward();
    } else if (event.key === 'ArrowRight') {
        Engine.forward();
    } else if (event.key === 'Escape') {
      	Dialog.close();
    }  else if (event.key === 'a') {
    	switch (settings.lang) {
			case "English":
				Dialog.create("About").wikiPassage("Credits").open();
				break;
			case "Français":
				Dialog.create("À Propos").wikiPassage("Credits").open();
				break;
			case "Nederlands":
				Dialog.create("Over").wikiPassage("Credits").open();
				break;
			default:
				break;
        }
	}
});

// Language Script, by TME; for sugarcube 2
setup.i18n = {
	langs : {
		'English'   : 'en',
		'Français'  : 'fr',
		'Nederlands' : 'nl'
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
		l10nStrings.settingsTitle = 'Settings';
		l10nStrings.settingsOff   = 'Off';
		l10nStrings.settingsOn    = 'On';
		l10nStrings.settingsReset = 'Reset to Defaults';
		l10nStrings.cancel =  "Cancel";
		break;
	case 'nl':
		l10nStrings.ok = 'Oke',
		l10nStrings.settingsTitle = 'Instellingen';
		l10nStrings.settingsOff   = 'Uit';
		l10nStrings.settingsOn    = 'Aan';
		l10nStrings.settingsReset = 'Herstel naar begin waarde';
		l10nStrings.cancel =  "Annuleren";
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
					<<case "Nederlands">>De Taal Wijzigen.
    			<</switch>>`,
	list     : setup.i18n.labels(),
	default  : setup.i18n.labelFromCode('en'),
	onInit   : initLanguage,
	onChange : changeLanguage
});


var settingFontSize = ["75%","100%", "125%", "150%"];
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
    label		: 	`<<switch settings.lang>>
						<<case "English">>Change Font Size.
						<<case "Français">>Changer la Taille de la Police.
						<<case "Nederlands">>Lettergrootte Veranderen.
					<</switch>>`,
    list		: settingFontSize,
    default     : "100%",
    onInit		: resizeFont,
    onChange	: resizeFont
});


var settingAnimationHandler = function () {
    if (settings.textanim) { // is true
        $("html").removeClass("nogif");
    } else { // is false
        $("html").addClass("nogif");
}};

Setting.addToggle("textanim", {
    label    : `<<switch settings.lang>>
					<<case "English">>Enable Animation.
					<<case "Français">>Animations du texte.
					<<case "Nederlands">>Animatie van Tekst.
				<</switch>>`,
    desc     : `<<switch settings.lang>>
					<<case "English">>If disabled, the text will not be animated.
					<<case "Français">>Si déactivé, le texte ne sera pas animé.
					<<case "Nederlands">>Indien gedeactiveerd, wordt de tekst niet geanimeerd.
				<</switch>>`,
    default  : true,
    onInit   : settingAnimationHandler,
    onChange : settingAnimationHandler
});

var settingTimer = function () {
    if (settings.timer) { // is true
		State.setVar('$timerOne', "1s");
		State.setVar('$timerZeroFive', "0.5s");
		State.setVar('$timerTwoFive', "2.5s");
		State.setVar('$timerThree', "3s");
    } else { // is false
		State.setVar('$timerOne', "0s");
		State.setVar('$timerZeroFive', "0s");
		State.setVar('$timerTwoFive', "1.5s");
		State.setVar('$timerThree', "1.5s");
}};

Setting.addToggle("timer", {
    label    : `<<switch settings.lang>>
					<<case "English">>Enable Timed Text.
					<<case "Français">>Délais de texte.
					<<case "Nederlands">>Schakel getimede tekst in.
				<</switch>>`,
    desc     : `<<switch settings.lang>>
					<<case "English">>Recommended for first playthrough.
					<<case "Français">>Recommendé pour la première partie.
					<<case "Nederlands">>Aanbevolen voor eerste playthrough.
				<</switch>>`,
    default  : true,
    onInit   : settingTimer,
    onChange : settingTimer
});


Setting.addRange("masterVolume", {
	label       : `<<switch settings.lang>>
					<<case "English">>Volume Level
					<<case "Français">>Niveau Sonore
					<<case "Nederlands">>Volumeniveau
				<</switch>>`,
	min         : 0,
	max         : 10,
	step        : 1,
	onChange    : function () {SimpleAudio.volume(settings.masterVolume / 10);}
});
