(function () {
  function isVisiblePageElement(element) {
    return (
      element &&
      !element.closest(".ladi-popup") &&
      element.offsetParent !== null
    );
  }

  function runAnimation(element) {
    if (!element || element.classList.contains("ladi-animation")) return;

    element.classList.add("ladi-animation");
    var delay = 0;
    var animationTarget = element.firstElementChild || element;
    var styles = window.getComputedStyle(animationTarget);

    if (styles.animationDelay) {
      delay = styles.animationDelay
        .split(",")
        .map(function (value) {
          value = value.trim();
          return value.endsWith("ms")
            ? parseFloat(value)
            : parseFloat(value) * 1000;
        })
        .reduce(function (max, value) {
          return Math.max(max, isNaN(value) ? 0 : value);
        }, 0);
    }

    window.setTimeout(function () {
      element.classList.remove("ladi-animation-hidden");
    }, delay);
  }

  function installAnimationFallback() {
    var elements = Array.prototype.slice
      .call(document.querySelectorAll(".ladi-animation-hidden"))
      .filter(isVisiblePageElement);

    if (!elements.length) return;

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            runAnimation(entry.target);
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -8% 0px",
          threshold: 0.01,
        },
      );

      elements.forEach(function (element) {
        observer.observe(element);
      });
      return;
    }

    function checkElements() {
      elements = elements.filter(function (element) {
        if (!element.classList.contains("ladi-animation-hidden")) {
          return false;
        }

        var rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          runAnimation(element);
          return false;
        }

        return true;
      });

      if (!elements.length) {
        window.removeEventListener("scroll", checkElements);
        window.removeEventListener("resize", checkElements);
      }
    }

    window.addEventListener("scroll", checkElements, { passive: true });
    window.addEventListener("resize", checkElements);
    checkElements();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installAnimationFallback);
  } else {
    installAnimationFallback();
  }
})();
