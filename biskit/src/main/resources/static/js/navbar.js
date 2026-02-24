(function () {
  var toggle = document.getElementById("nav-toggle");
  var ignoreScroll = false;

  toggle.addEventListener("change", function () {
    ignoreScroll = true;
    setTimeout(function () {
      ignoreScroll = false;
    }, 400);
  });

  window.addEventListener("scroll", function () {
    if (!ignoreScroll && toggle.checked) {
      toggle.checked = false;
    }
  });
})();
