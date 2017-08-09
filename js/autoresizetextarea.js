var observe;
if (window.attachEvent) {
    observe = function (element, event, handler) {
        element.attachEvent('on' + event, handler);
    };
} else {
    observe = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
}

function init() {
    var text = document.getElementById('long-desc');

    function resize() {
        text.style.height = 'auto';
        text.style.height = text.scrollHeight + 'px';
        var cc = getCaretCoordinates(text, text.selectionStart);
        scrollTo(cc.left, cc.top + 300);
    }

    function delayedResize() {
        window.setTimeout(resize, 0);
    }

    observe(text, 'change', resize);
    observe(text, 'cut', delayedResize);
    observe(text, 'paste', delayedResize);
    observe(text, 'drop', delayedResize);
    observe(text, 'keydown', delayedResize);

    //text.focus();
    //text.select();
    resize();
}