function is_mobile() {
    return navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad|android|blackberry|bb10|mobi|tablet|opera mini|nexus 7)/i)
}

function bgMp3() {
    var a = $("#js_musicBtn"),
        i = $("#media")[0];
    a.show();
    a.on("click touchstart", function(e) {
        e.stopPropagation();
        e.preventDefault();
        a.hasClass("musicPlay") ? (i.pause(), $(this).removeClass("musicPlay")) : (i.play(), $(this).addClass("musicPlay"))
    });
    $("#media")[0].play();
    setTimeout(function() {
        $("#js_musicBtn").addClass("musicPlay")
    }, 100);
}
(window.onload = function() {
    setTimeout(function() {
        bgMp3()
    }, 500)
})
$(function() {
    var a;
    a = new FullPage({
        id: "pageContain",
        slideTime: 500,
        continuous: 1,
        effect: {
            transform: {
                translate: "Y",
                scale: [.001, 1],
                rotate: [360, -360]
            },
            opacity: [0, 1]
        },
        mode: "wheel,touch,nav:navBar",
        easing: "ease-in-out"
    });
    $(".modal-trigger").leanModal({
        opacity: .5
    });
});
