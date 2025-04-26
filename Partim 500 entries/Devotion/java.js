Config.passages.nobr = true;

$(document).on('keyup', function(event) {
    if (event.key === 'ArrowLeft') {
        Engine.backward();
    } else if (event.key === 'ArrowRight') {
        Engine.forward();
    } else if (event.key === 'Escape') {
      Dialog.close();
    } else if (event.key === 'r') {
        switch (State.getVar('$lang')) {
            case "English":
                Dialog.create("Restart").wikiPassage("Restart").open();
                break;
            case "Français":
                Dialog.create("Recommencer").wikiPassage("Restart").open();
                break;
            case "Nederlands":
                Dialog.create("Herstart").wikiPassage("Restart").open();
                break;
            default:
                break;
        }
    }  else if (event.key === 'a') {
    switch (State.getVar('$lang')) {
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
    } else if (event.key === '1' && passage() != "Start") {
        $("#passages a").click();
    }
});