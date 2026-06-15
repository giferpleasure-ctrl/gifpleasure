"use client";

import { useEffect, useRef } from "react";

export default function PlaceholderTrigger() {
  const hasTriggered = useRef(false);
  const scrollListenerAdded = useRef(false);

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
      document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; secure`;
    };

    // Проверяем cookie
    const cookie = getCookie("bcs_cookie_bongacams_pop");
    if (cookie) {
      hasTriggered.current = true;
      return;
    }

    const triggerPopunder = () => {
      if (hasTriggered.current) return;
      hasTriggered.current = true;

      setCookie("bcs_cookie_bongacams_pop", "1", 1); // 1 час

      const isMobile =
        /iPhone|iPad|Android|iPod|BlackBerry|Windows Phone/i.test(
          navigator.userAgent,
        );

      if (isMobile) {
        const script = document.createElement("script");
        script.textContent = `
          (function () {
            var isMobile = false;
            (function (a) {
              if (/(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-/i.test(a.substr(0, 4))) {isMobile = true;}
            })(navigator.userAgent || navigator.vendor || window.opera);
            
            var promo_url = 'https://bongacams4.com/track?c=837848&ps=popunder&csurl=https%3A%2F%2Fbngpop.com%2Fpromo.php%3Fc%3D837848%26type%3Dpopunder%26name%3Dbongacams_pop%26ps%3Dmobile_popunder%26full_screen_image%3Drandom%26custom_phrase%3Drandom%26is_preview%3D1%26bcs%3Dbongacash';
            var bcs_popup_show = false;
            
            function checkUA(name) {return navigator.userAgent.indexOf(name) != -1;}
            
            function doOpenDtp(url, href) {
              if (!href) {return false;}
              if (bcs_popup_show == true) {return true;}
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
                if (c_name == name) {return c_value;}
              }
              return null;
            }
            
            function initBCPopunder() {
              document.onclick = checkTarget;
            }
            
            function checkTarget(e) {
              if (!getCookie('bcs_cookie_bongacams_pop')) {
                setCookie('bcs_cookie_bongacams_pop', 1, 3600000);
                var el = e.target;
                var originalHref = el.getAttribute('href');
                if (originalHref) {
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
        document.body.appendChild(script);
      } else {
        const script = document.createElement("script");
        script.src =
          "https://bngpop.com/promo.php?c=837848&params[cookie_life_time]=3600000&type=script&params[ps]=popunder&params[name]=online_sex_redhead&params[url_params]=v%3D2";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    // ========== КЛИК ==========
    const handleClick = () => {
      if (window.location.pathname.startsWith("/admin")) return;
      triggerPopunder();
    };

    // ========== СКРОЛЛ ==========
    const handleScroll = () => {
      if (window.location.pathname.startsWith("/admin")) return;
      if (hasTriggered.current) return;

      const isMobile =
        /iPhone|iPad|Android|iPod|BlackBerry|Windows Phone/i.test(
          navigator.userAgent,
        );
      const scrollPercent =
        (window.scrollY + window.innerHeight) /
        document.documentElement.scrollHeight;

      const threshold = isMobile ? 0.8 : 0.5; // 80% для мобилки, 50% для десктопа

      if (scrollPercent >= threshold) {
        triggerPopunder();
      }
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);
    scrollListenerAdded.current = true;

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
