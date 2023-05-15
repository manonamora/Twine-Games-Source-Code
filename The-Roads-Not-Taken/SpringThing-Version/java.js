Config.passages.nobr = true;
Config.saves.slots = 3;
UIBar.destroy();

$(document).on(":passagedisplay", function() {
	$("#passages").scrollTop(0);
});
$(document).on(':dialogopened', function (ev) {
	$("#ui-dialog-body").scrollTop(0);
});

$(document).on(':passagestart', function (ev) {
    if (!ev.passage.tags.includes('noreturn')) {
        State.variables.return = ev.passage.title;
    }
});
setup.scrollToBottom = (id) => {
    const element = $(`#${id}`);
    setTimeout(function() { 
        element.animate({
            scrollTop: element.prop("scrollHeight")
        }, 500);
    }, 200);
}
setup.scrollToTop = (id) => {
    const element = $(`#${id}`);
    setTimeout(function() { 
        element.animate({
            scrollTop: 0
        }, 500);
    }, 200);
}

setup.scrollToView = (id) => {
    $(`#${id}`)[0].scrollIntoView({ behavior: "smooth"});
}
//--------SETTINGS--------
Setting.addHeader("Hints");

var settingHintHandler = function () {
    if (settings.texthint) { // is true
        $("html").addClass("hint-visible");
    } else { // is false
        $("html").removeClass("hint-visible");
}};
Setting.addToggle("texthint", {
    label    : "Enable Hints",
    desc     : 'If enabled, interactable words will be made <span class="hint">obvious</span>.',
    default  : true,
    onInit   : settingHintHandler,
    onChange : settingHintHandler
});

var colourList = ["No colour", "Green", "Orange", "Yellow", "Pink"];
var settingHintColour = function() {
    var $html = $(".hint-visible");
        $html.removeClass("green orange yellow pink");
    switch (settings.colourList) {
        case "Green":
            $html.addClass("green");
            break;
        case "Orange":
            $html.addClass("orange");
            break;
		case "Yellow":
            $html.addClass("yellow");
            break;
        case "Pink":
            $html.addClass("pink");
            break;
}};
Setting.addList("colourList", {
    label		: `Hint Colour`,
    desc        : 'You can previous the colour chosen <span class="hint">here</span>.',
    list		: colourList,
    default     : "No colour",
    onInit		: settingHintColour,
    onChange	: settingHintColour
});	

Setting.addHeader(`Text Display.`);
        //--FONT TYPE--
var settingFontFamily = ["PT Serif", "Garamond", "Montserrat", "Monospace", "OpenDyslexic", "Hyperlegible"];
var fontFamily = function() {
    var $html = $("html");
        $html.removeClass("sansserif serif monospace opendyslexic hyperlegible garamond");
    switch (settings.fontFamily) {
        case "PT Serif":
            $html.addClass("serif");
            break;
        case "Montserrat":
            $html.addClass("sansserif");
            break;
		case "Monospace":
            $html.addClass("monospace");
            break;
        case "OpenDyslexic":
            $html.addClass("opendyslexic");
            break;
		case "Garamond":
            $html.addClass("garamond");
            break;
		case "Hyperlegible":
            $html.addClass("hyperlegible");
            break;
}};
Setting.addList("fontFamily", {
    label		: `Change Font.`,
    list		: settingFontFamily,
    default     : "Montserrat",
    onInit		: fontFamily,
    onChange	: fontFamily
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
}};
Setting.addList("fontSize", {
    label		: `Change Font Size.`,
    list		: settingFontSize,
    default     : "100%",
    onInit		: resizeFont,
    onChange	: resizeFont
});
        //--LINE HEIGHT--
var settingLineHeightNames = ["75%","100%", "125%", "150%"];
var settingLineHeightHandler = function () {
	var $html = $("html");
	$html.removeClass("ln75 ln125 ln150");
	switch (settings.lineheight) {
	case "75%":
		$html.addClass("ln75");
		break;	
	case "125%":
		$html.addClass("ln125");
		break;	
	case "150%":
		$html.addClass("ln150");
		break;	
}};
Setting.addList("lineheight", {
	label    : `Change Line Height.`,
	default  :	"100%",
	list     : settingLineHeightNames,
	onInit   : settingLineHeightHandler,
	onChange : settingLineHeightHandler
});
    //--TEXT ALIGNMENT--
var settingAlignNames = ["Left","Center","Right", "Justified"];
var settingAlignHandler = function () {
	var $html = $("html");
	$html.removeClass("left center right");
	switch (settings.textalign) {
	case "Left":
		$html.addClass("left");
		break;	
	case "Center":
		$html.addClass("center");
		break;	
	case "Right":
		$html.addClass("right");
		break;	
	}	
};
Setting.addList("textalign", {
	label    : `Change Text Alignment.`,
	default  :	"Left",
	list     : settingAlignNames,
	onInit   : settingAlignHandler,
	onChange : settingAlignHandler
});
// end change font family


//--SAVING--
Setting.addHeader(`Save Settings.`);
    //--AUTOSAVE--
Config.saves.isAllowed = function () {
    if (tags().includes('noreturn')) {
        return false;
    }
    return true;
};
Config.saves.autosave = function () {
    if (settings.autosave) {
        return true
}};
Setting.addToggle("autosave", {
    label : `Autosave.`,
    default  : false,
});
    //--NAME SAVES--
Save.onSave.add(function (save, details) {
    if (settings.autoname) {
        save.title = "Roads Taken: " + State.getVar("$roads");
    } else if (details.type == "autosave") {
        save.title = "Autosave";
    } else {
        save.title = prompt("Enter Save Name:", "The Roads Not Taken");
}});
    //--AUTONAME--
Setting.addToggle("autoname", {
    label : `Autoname.`,
    default  : false,
});
