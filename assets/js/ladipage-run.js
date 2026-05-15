(function () {
  var run = function () {
    if (
      typeof window.LadiPageScript == "undefined" ||
      typeof window.ladi == "undefined" ||
      window.ladi == undefined
    ) {
      setTimeout(run, 100);
      return;
    }
    window.LadiPageApp = window.LadiPageApp || new window.LadiPageAppV2();
    window.LadiPageScript.runtime.ladipage_id = "681f3dade35b1f0012dcea3b";
    window.LadiPageScript.runtime.publish_platform = "WORDPRESS";
    window.LadiPageScript.runtime.is_mobile_only = true;
    window.LadiPageScript.runtime.version = "1772007587578";
    window.LadiPageScript.runtime.cdn_url = "https://w.ladicdn.com/v5/source/";
    window.LadiPageScript.runtime.DOMAIN_SET_COOKIE = [
      "hang-quan-wedding.github.io",
    ];
    window.LadiPageScript.runtime.DOMAIN_FREE = [
      "preview.ldpdemo.com",
      "ldp.page",
    ];
    window.LadiPageScript.runtime.bodyFontSize = 12;
    window.LadiPageScript.runtime.store_id = "6322a62f2dad980013bb5005";
    window.LadiPageScript.runtime.store_ladiuid = "6322a612c96988001223c73b";
    window.LadiPageScript.runtime.time_zone = 7;
    window.LadiPageScript.runtime.currency = "VND";
    window.LadiPageScript.runtime.convert_replace_str = true;
    window.LadiPageScript.runtime.desktop_width = 960;
    window.LadiPageScript.runtime.mobile_width = 420;
    window.LadiPageScript.runtime.formdata = false;
    window.LadiPageScript.runtime.tracking_button_click = false;
    window.LadiPageScript.runtime.publish_time = 1772086599770;
    window.LadiPageScript.runtime.lang = "vi";
    window.LadiPageScript.run(true);
    window.LadiPageScript.runEventScroll();
  };
  run();
})();
