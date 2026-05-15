(function () {
  var brandingAsset = "/by/ladipage.svg";

  function containsBrandingAsset(value) {
    return String(value || "").indexOf(brandingAsset) !== -1;
  }

  function removeBrandingStyleRules() {
    Array.prototype.slice.call(document.styleSheets).forEach(function (sheet) {
      var rules;
      try {
        rules = sheet.cssRules;
      } catch (error) {
        return;
      }

      if (!rules) return;

      for (var i = rules.length - 1; i >= 0; i -= 1) {
        if (containsBrandingAsset(rules[i].cssText)) {
          sheet.deleteRule(i);
        }
      }
    });
  }

  function removeBrandingNodes(root) {
    var nodes = root && root.querySelectorAll ? root.querySelectorAll("*") : [];
    Array.prototype.slice.call(nodes).forEach(function (node) {
      var style = window.getComputedStyle
        ? window.getComputedStyle(node)
        : null;
      var inlineStyle = node.getAttribute && node.getAttribute("style");
      var rect = node.getBoundingClientRect
        ? node.getBoundingClientRect()
        : null;
      var isGeneratedLadiBadge =
        style &&
        rect &&
        style.position === "fixed" &&
        Math.abs(rect.width - 140) <= 4 &&
        Math.abs(rect.height - 30) <= 4 &&
        parseInt(style.left, 10) === 10 &&
        parseInt(style.zIndex, 10) >= 1000000000;

      if (
        containsBrandingAsset(inlineStyle) ||
        (style && containsBrandingAsset(style.backgroundImage)) ||
        isGeneratedLadiBadge
      ) {
        node.remove();
      }
    });
  }

  function cleanBranding() {
    removeBrandingStyleRules();
    removeBrandingNodes(document);
  }

  function wrapDomInsert(methodName) {
    var original = Node.prototype[methodName];
    Node.prototype[methodName] = function () {
      var node = arguments[0];
      var result = original.apply(this, arguments);

      if (node) {
        if (
          node.textContent &&
          containsBrandingAsset(node.textContent) &&
          node.parentNode
        ) {
          node.remove();
        }
        cleanBranding();
      }

      return result;
    };
  }

  wrapDomInsert("appendChild");
  wrapDomInsert("insertBefore");

  if (window.CSSStyleSheet && CSSStyleSheet.prototype.insertRule) {
    var originalInsertRule = CSSStyleSheet.prototype.insertRule;
    CSSStyleSheet.prototype.insertRule = function (rule, index) {
      if (containsBrandingAsset(rule)) return -1;
      return originalInsertRule.call(this, rule, index);
    };
  }

  new MutationObserver(cleanBranding).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "style"],
    childList: true,
    subtree: true,
  });

  cleanBranding();
  document.addEventListener("DOMContentLoaded", cleanBranding);
  window.addEventListener("load", cleanBranding);
  setTimeout(cleanBranding, 50);
  setTimeout(cleanBranding, 250);
  setTimeout(cleanBranding, 1000);
})();
