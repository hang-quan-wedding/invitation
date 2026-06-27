(function removeLadiPageWatermark() {
  function isBottomFixedBranding(element) {
    if (
      !element ||
      element === document.body ||
      element === document.documentElement
    )
      return false;

    var text = (element.textContent || "").toLowerCase();
    var attrs = [
      element.id,
      element.className,
      element.getAttribute("href"),
      element.getAttribute("src"),
      element.getAttribute("style"),
      element.getAttribute("aria-label"),
      element.getAttribute("title"),
      element.getAttribute("alt"),
    ]
      .join(" ")
      .toLowerCase();

    if (text.indexOf("powered by") !== -1 && text.indexOf("ladipage") !== -1)
      return true;

    var style = window.getComputedStyle(element);
    if (style.position !== "fixed" && style.position !== "sticky") return false;

    var rect = element.getBoundingClientRect();
    if (
      style.position === "fixed" &&
      Math.abs(rect.width - 140) <= 4 &&
      Math.abs(rect.height - 30) <= 4 &&
      parseInt(style.left, 10) === 10 &&
      parseInt(style.zIndex, 10) >= 1000000000
    ) {
      return true;
    }

    var isBottomBadge =
      rect.width <= 360 &&
      rect.height <= 120 &&
      rect.bottom >= window.innerHeight - 140;
    return (
      isBottomBadge &&
      (attrs.indexOf("ladipage") !== -1 ||
        attrs.indexOf("watermark") !== -1 ||
        attrs.indexOf("powered") !== -1)
    );
  }

  function removeBadge() {
    Array.prototype.slice
      .call(document.querySelectorAll("body *"))
      .forEach(function (element) {
        if (isBottomFixedBranding(element)) {
          element.remove();
        }
      });
  }

  removeBadge();
  window.addEventListener("load", removeBadge);
  setTimeout(removeBadge, 500);
  setTimeout(removeBadge, 1500);

  new MutationObserver(removeBadge).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();

function _thankyouBlockScroll(e) {
  e.preventDefault();
}

function lockThankyouScroll() {
  document.documentElement.style.overflow = "hidden";
  document.body.classList.add("modal-scroll-locked");
  window.addEventListener("wheel", _thankyouBlockScroll, { passive: false });
  window.addEventListener("touchmove", _thankyouBlockScroll, {
    passive: false,
  });
}

function unlockThankyouScroll() {
  document.documentElement.style.overflow = "";
  document.body.classList.remove("modal-scroll-locked");
  window.removeEventListener("wheel", _thankyouBlockScroll);
  window.removeEventListener("touchmove", _thankyouBlockScroll);
}

function restartThankyouAnimations(popup) {
  popup
    .querySelectorAll(".ladi-animation, .ladi-animation-hidden")
    .forEach(function (el) {
      el.classList.remove("ladi-animation");
      el.classList.add("ladi-animation-hidden");
      void el.offsetWidth;
      el.classList.add("ladi-animation");
      el.classList.remove("ladi-animation-hidden");
    });
}

function openThankyouModal() {
  var popup = document.getElementById("POPUP1");
  var backdrop = document.getElementById("backdrop-popup");
  if (!popup || !backdrop) return;

  lockThankyouScroll();

  backdrop.classList.remove("thankyou-backdrop-leaving");
  backdrop.style.display = "block";
  backdrop.classList.add("thankyou-backdrop");
  popup.classList.remove("thankyou-modal-leaving");
  popup.classList.add("selected");
  popup.style.display = "block";
  popup.classList.remove("ladi-animation-hidden");

  void popup.offsetWidth;
  popup.classList.add("thankyou-modal-entering");
  restartThankyouAnimations(popup);
}

function closeThankyouModal() {
  var popup = document.getElementById("POPUP1");
  var backdrop = document.getElementById("backdrop-popup");
  if (!popup || !backdrop || popup.style.display === "none") return;

  backdrop.classList.add("thankyou-backdrop-leaving");
  popup.classList.remove("thankyou-modal-entering");
  popup.classList.add("thankyou-modal-leaving");

  popup.addEventListener("animationend", function handler(event) {
    if (event.target !== popup) return;
    popup.removeEventListener("animationend", handler);
    popup.classList.remove("selected", "thankyou-modal-leaving");
    popup.style.display = "none";
    backdrop.classList.remove("thankyou-backdrop", "thankyou-backdrop-leaving");
    backdrop.style.display = "none";
    unlockThankyouScroll();
  });
}

document.addEventListener("click", function (e) {
  if (e.target.id === "backdrop-popup") {
    closeThankyouModal();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeThankyouModal();
  }
});

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbytWEqAbUbDCH7OivihpWV6Wq-a_zEewl6suLidcq8Np6We6PNMi-KXoyQKbe0zMowH/exec";

(function () {
  var defaultHeadline32Word = "chúng tôi";
  var searchParams = new URLSearchParams(window.location.search);
  var headline32Element = document.querySelector("#HEADLINE32 .ladi-headline");
  var headline62Element = document.querySelector("#HEADLINE62 .ladi-headline");
  var guestNameElement = document.querySelector(
    "#HEADLINE_GUEST_NAME .ladi-headline",
  );
  var paragraph3Element = document.querySelector("#PARAGRAPH3 .ladi-paragraph");
  var paragraph4Element = document.querySelector("#PARAGRAPH4 .ladi-paragraph");
  var rsvpNameInput = document.querySelector(
    '#my-wedding-form [name="guest_name"]',
  );
  var attendancePlaceholder = document.querySelector(
    '#my-wedding-form [name="attendance"] option[value=""]',
  );
  var attendingOption = document.querySelector(
    '#my-wedding-form [name="attendance"] option[value="attending"]',
  );
  var notAttendingOption = document.querySelector(
    '#my-wedding-form [name="attendance"] option[value="not_attending"]',
  );
  var guestCountPlaceholder = document.querySelector(
    '#my-wedding-form [name="guest_count"] option[value=""]',
  );
  var menuPlaceholder = document.querySelector(
    '#my-wedding-form [name="menu"] option[value=""]',
  );
  var defaultHeadline62Html = headline62Element
    ? headline62Element.innerHTML
    : "";
  var defaultParagraph3Text = paragraph3Element
    ? paragraph3Element.textContent
    : "";
  var defaultParagraph4Html = paragraph4Element
    ? paragraph4Element.innerHTML
    : "";
  var defaultNamePlaceholder = rsvpNameInput
    ? rsvpNameInput.getAttribute("placeholder") || ""
    : "";
  var defaultAttendancePlaceholder = attendancePlaceholder
    ? attendancePlaceholder.textContent
    : "";
  var defaultAttendingOptionText = attendingOption
    ? attendingOption.textContent
    : "";
  var defaultNotAttendingOptionText = notAttendingOption
    ? notAttendingOption.textContent
    : "";
  var defaultGuestCountPlaceholder = guestCountPlaceholder
    ? guestCountPlaceholder.textContent
    : "";
  var defaultMenuPlaceholder = menuPlaceholder
    ? menuPlaceholder.textContent
    : "";
  var ref = cleanText(searchParams.get("ref"));

  function cleanText(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  function setHeadline32Word(word) {
    if (!headline32Element) return;

    headline32Element.innerHTML =
      "đến dự tiệc báo hỷ<br />cùng " +
      (cleanText(word) || defaultHeadline32Word);
  }

  function replacePronoun(value, pronoun) {
    var cleanPronoun = cleanText(pronoun) || "chúng mình";

    return value.replace(/chúng mình/gi, function (match) {
      return match.charAt(0) === match.charAt(0).toUpperCase()
        ? capitalizeFirstLetter(cleanPronoun)
        : cleanPronoun.toLowerCase();
    });
  }

  function capitalizeFirstLetter(value) {
    value = cleanText(value);
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  }

  function replaceGuestWord(value, wish) {
    var cleanWish = cleanText(wish);
    if (!value || !cleanWish) return value;

    return value.replace(/bạn/gi, function (match) {
      return match === match.toUpperCase() ||
        match.charAt(0) === match.charAt(0).toUpperCase()
        ? capitalizeFirstLetter(cleanWish)
        : cleanWish;
    });
  }

  function replaceSelfWord(value, wish) {
    var cleanWish = cleanText(wish);
    if (!value || !cleanWish) return value;

    return value.replace(/mình/gi, function (match) {
      return match.charAt(0) === match.charAt(0).toUpperCase()
        ? capitalizeFirstLetter(cleanWish)
        : cleanWish;
    });
  }

  function setPronounText(pronoun) {
    if (headline62Element) {
      headline62Element.innerHTML = replacePronoun(
        defaultHeadline62Html,
        pronoun,
      );
    }

    if (paragraph3Element) {
      paragraph3Element.textContent = replacePronoun(
        defaultParagraph3Text,
        pronoun,
      );
    }
  }

  function setParagraph3Wish(wish, pronoun) {
    var cleanWish = cleanText(wish);
    if (!paragraph3Element || !cleanWish) return;

    paragraph3Element.textContent = replacePronoun(
      defaultParagraph3Text,
      pronoun,
    ).replace(/\bbạn\b/g, cleanWish);
  }

  function setRsvpGuestName(guestName) {
    var cleanGuestName = cleanText(guestName);
    if (!rsvpNameInput || !cleanGuestName) return;

    rsvpNameInput.value = cleanGuestName;
  }

  function setRsvpWishText(wish, pronoun) {
    var cleanWish = cleanText(wish);
    if (!cleanWish) return;

    if (headline62Element) {
      headline62Element.innerHTML = replaceGuestWord(
        replacePronoun(defaultHeadline62Html, pronoun),
        cleanWish,
      );
    }

    if (rsvpNameInput) {
      rsvpNameInput.setAttribute(
        "placeholder",
        replaceGuestWord(defaultNamePlaceholder, cleanWish),
      );
    }

    if (attendancePlaceholder) {
      attendancePlaceholder.textContent = replaceGuestWord(
        defaultAttendancePlaceholder,
        cleanWish,
      );
    }

    if (attendingOption) {
      attendingOption.textContent = replaceSelfWord(
        defaultAttendingOptionText,
        cleanWish,
      );
    }

    if (notAttendingOption) {
      notAttendingOption.textContent = replaceSelfWord(
        defaultNotAttendingOptionText,
        cleanWish,
      );
    }

    if (guestCountPlaceholder) {
      guestCountPlaceholder.textContent = replaceGuestWord(
        defaultGuestCountPlaceholder,
        cleanWish,
      );
    }

    if (menuPlaceholder) {
      menuPlaceholder.textContent = replaceGuestWord(
        defaultMenuPlaceholder,
        cleanWish,
      );
    }

    if (paragraph4Element) {
      paragraph4Element.innerHTML = replaceGuestWord(
        replacePronoun(defaultParagraph4Html, pronoun),
        cleanWish,
      );
    }
  }

  function lookupGuest(refValue) {
    return new Promise(function (resolve, reject) {
      var callbackName =
        "__quanWeddingGuestLookup" +
        Date.now() +
        Math.floor(Math.random() * 1000000);
      var script = document.createElement("script");
      var timeoutId = window.setTimeout(function () {
        cleanup();
        reject(new Error("Guest lookup timed out"));
      }, 10000);

      function cleanup() {
        window.clearTimeout(timeoutId);
        delete window[callbackName];

        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }

      window[callbackName] = function (data) {
        cleanup();
        resolve(data);
      };

      script.onerror = function () {
        cleanup();
        reject(new Error("Guest lookup failed"));
      };
      script.src =
        GOOGLE_SCRIPT_URL +
        "?ref=" +
        encodeURIComponent(refValue) +
        "&callback=" +
        encodeURIComponent(callbackName);
      document.head.appendChild(script);
    });
  }

  function showGuestName(guestName) {
    if (!guestNameElement || !guestName) return;

    guestNameElement.textContent = guestName;
    document.body.classList.add("has-guest-name");

    var guestNameWrapper = document.getElementById("HEADLINE_GUEST_NAME");
    if (!guestNameWrapper) return;

    function runGuestNameAnimation() {
      if (guestNameWrapper.classList.contains("ladi-animation")) return;

      guestNameWrapper.classList.add("ladi-animation");
      var animationTarget =
        guestNameWrapper.firstElementChild || guestNameWrapper;
      var styles = window.getComputedStyle(animationTarget);
      var delay = 0;

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
        guestNameWrapper.classList.remove("ladi-animation-hidden");
      }, delay);
    }

    if ("IntersectionObserver" in window) {
      var guestNameObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            guestNameObserver.unobserve(entry.target);
            runGuestNameAnimation();
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -8% 0px",
          threshold: 0.01,
        },
      );

      guestNameObserver.observe(guestNameWrapper);
      return;
    }

    function checkGuestNameVisibility() {
      var rect = guestNameWrapper.getBoundingClientRect();
      if (rect.top >= window.innerHeight * 0.92 || rect.bottom <= 0) return;

      window.removeEventListener("scroll", checkGuestNameVisibility);
      window.removeEventListener("resize", checkGuestNameVisibility);
      runGuestNameAnimation();
    }

    window.addEventListener("scroll", checkGuestNameVisibility, {
      passive: true,
    });
    window.addEventListener("resize", checkGuestNameVisibility);
    checkGuestNameVisibility();
  }

  setHeadline32Word(defaultHeadline32Word);

  if (!ref) return;

  document.body.classList.add("has-guest-name");

  lookupGuest(ref)
    .then(function (data) {
      if (!data || !data.ok) {
        document.body.classList.remove("has-guest-name");
        return;
      }

      setHeadline32Word(data.pronoun);
      setPronounText(data.pronoun);
      setParagraph3Wish(data.wish, data.pronoun);
      setRsvpGuestName(data.guest);
      setRsvpWishText(data.wish, data.pronoun);
      showGuestName(cleanText(data.guest));
    })
    .catch(function (error) {
      document.body.classList.remove("has-guest-name");
      console.log(error);
    });
})();

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("my-wedding-form");
  const btnText = document.querySelector("#BUTTON_TEXT2 .ladi-headline");
  const attendanceSelect = form.querySelector('[name="attendance"]');
  const guestCountSelect = form.querySelector('[name="guest_count"]');
  const menuSelect = form.querySelector('[name="menu"]');
  const sheetValueMap = {
    attendance: {
      attending: "Có tham dự",
      not_attending: "Không tham dự",
    },
    guest_count: {
      0: "Đi một mình",
      1: "Đi cùng 1 người",
      2: "Đi cùng 2 người",
      3: "Đi cùng 3 người",
      4: "Đi cùng 4 người",
    },
    menu: {
      regular: "Thực đơn thông thường",
      vegetarian: "Thực đơn chay",
    },
  };

  function syncAttendanceFields() {
    const isNotGoing = attendanceSelect.value === "not_attending";

    guestCountSelect.disabled = isNotGoing;
    menuSelect.disabled = isNotGoing;
    menuSelect.required = !isNotGoing;

    if (isNotGoing) {
      guestCountSelect.value = "";
      menuSelect.value = "";
    }
  }

  attendanceSelect.addEventListener("change", syncAttendanceFields);
  syncAttendanceFields();

  // Lắng nghe sự kiện bấm nút submit ẩn của LadiPage
  document.querySelector("#BUTTON2").addEventListener("click", function () {
    if (form.reportValidity()) {
      document.querySelector('#FORM2 button[type="submit"]').click();
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Chặn việc tự động chuyển trang

    if (!GOOGLE_SCRIPT_URL.startsWith("https://script.google.com/macros/s/")) {
      alert("Vui lòng cấu hình Google Apps Script URL trước khi gửi!");
      return;
    }

    const originalText = btnText.innerText;
    btnText.innerText = "ĐANG GỬI..."; // Đổi chữ lúc đang xử lý

    const formData = new FormData(form);
    const attendanceValue = formData.get("attendance") || "";
    const guestCountValue =
      attendanceValue === "not_attending"
        ? ""
        : formData.get("guest_count") || "0";
    const menuValue =
      attendanceValue === "not_attending" ? "" : formData.get("menu") || "";
    const payload = {
      guest_name: formData.get("guest_name") || "",
      message: formData.get("message") || "",
      attendance: sheetValueMap.attendance[attendanceValue] || "",
      guest_count:
        attendanceValue === "not_attending"
          ? "Không tham dự"
          : sheetValueMap.guest_count[guestCountValue] || "",
      menu:
        attendanceValue === "not_attending"
          ? "Không tham dự"
          : sheetValueMap.menu[menuValue] || "",
    };

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    })
      .then(() => {
        // Bật Popup cảm ơn lên
        openThankyouModal();

        // Xoá trắng các ô đã điền
        form.reset();
        syncAttendanceFields();
      })
      .catch((error) => {
        console.log(error);
        alert("Lỗi kết nối mạng, vui lòng thử lại!");
      })
      .then(function () {
        btnText.innerText = originalText; // Trả lại chữ cũ cho nút bấm
      });
  });
});
