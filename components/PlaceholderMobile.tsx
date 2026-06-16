"use client";

import { useEffect, useRef } from "react";

export default function PopunderMobile() {
  const hasTriggered = useRef(false);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const setCookie = (name: string, value: string, hours: number) => {
      const date = new Date();
      date.setTime(date.getTime() + hours * 60 * 60 * 1000);
      document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
    };

    const cookie = getCookie("bcs_cookie_bongacams_pop_mobile");
    if (cookie) {
      hasTriggered.current = true;
      return;
    }

    const loadScript = () => {
      if (scriptLoaded.current) return;
      scriptLoaded.current = true;

      const script = document.createElement("script");
      script.textContent = `
        (function () {
          var promo_url = 'https://bongacams4.com/track?c=837848&ps=popunder&csurl=https%3A%2F%2Fbngpop.com%2Fpromo.php%3Fc%3D837848%26type%3Dpopunder%26name%3Dbongacams_pop%26ps%3Dmobile_popunder%26full_screen_image%3Drandom%26custom_phrase%3Drandom%26is_preview%3D1%26bcs%3Dbongacash';
          var bcs_popup_show = false;
          
          function checkUA(name) {return navigator.userAgent.indexOf(name) != -1;}
          
          function doOpenDtp(url, href) {
            if (!href) return false;
            if (bcs_popup_show) return true;
            var wFeatures = 'toolbar=0,statusbar=1,resizable=1,scrollbars=1,menubar=0,location=1,directories=0';
            if (checkUA('Chrome')) {wFeatures = 'scrollbar=yes';}
            if (checkUA('OPR') || checkUA('Opera') || checkUA('Edge') || checkUA('Chrome') || checkUA('Firefox') || checkUA('Safari')) {
              window.open(href);
            } else {
              if (checkUA('IE') || checkUA('Trident')) {
                window.open(url, 'bc_p_bongacams_pop', wFeatures + ',height=755,width=1025');
                bcs_popup_show = true;
                setTimeout(window.focus);
                window.focus();
                setTimeout(function () {
                  var a = window.open('about:blank');
                  a.focus();
                  a.close();
                  window.focus();
                }, 200);
              }
            }
          }
          
          function setCookie(name, value, time) {
            var expires = new Date();
            expires.setTime(expires.getTime() + time);
            document.cookie = name + '=' + value + '; expires=' + expires.toGMTString() + '; secure=1';
          }
          
          function getCookie(name) {
            var cookies = document.cookie.toString().split('; ');
            var cookie, c_name, c_value;
            for (var n = 0; n < cookies.length; n++) {
              cookie = cookies[n].split('=');
              c_name = cookie[0];
              c_value = cookie[1];
              if (c_name == name) return c_value;
            }
            return null;
          }
          
          function initBCPopunder() {
            document.onclick = checkTarget;
          }
          
          function checkTarget(e) {
            if (!getCookie('bcs_cookie_bongacams_pop')) {
              var el = e.target;
              var originalHref = el.getAttribute('href');
              if (originalHref) {
                setCookie('bcs_cookie_bongacams_pop', 1, 3600000);
                el.setAttribute('href', promo_url);
                doOpenDtp(promo_url, originalHref);
              } else {
                window.open(promo_url);
              }
            }
          }
          
          initBCPopunder();
          
          var iOS = /iPad|iPhone|iPod/.test(navigator.platform);
          window.onload = function () {
            if (iOS) {document.body.style.cursor = "pointer";}
          }
        })();
      `;
      script.onerror = () => {
        console.error("Mobile Popunder script failed to load");
        scriptLoaded.current = false;
      };
      document.body.appendChild(script);
    };

    const triggerPopunder = () => {
      if (hasTriggered.current) return;
      hasTriggered.current = true;
      setCookie("bcs_cookie_bongacams_pop_mobile", "1", 1);
      loadScript();
    };

    const handleClick = () => {
      if (window.location.pathname.startsWith("/admin")) return;
      triggerPopunder();
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
