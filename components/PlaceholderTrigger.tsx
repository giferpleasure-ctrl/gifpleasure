"use client";

import { useEffect, useRef } from "react";

export default function PopunderDesktop() {
  const hasTriggered = useRef(false);

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

    const cookie = getCookie("bcs_cookie_bongacams_pop_desktop");
    if (cookie) {
      hasTriggered.current = true;
      return;
    }

    const loadScript = () => {
      const script = document.createElement("script");
      script.src =
        "https://bngpop.com/promo.php?c=837848&params[cookie_life_time]=3600000&type=script&params[ps]=popunder&params[name]=bongacams_pop";
      script.async = true;
      document.body.appendChild(script);
    };

    const trigger = () => {
      if (hasTriggered.current) return;
      hasTriggered.current = true;
      setCookie("bcs_cookie_bongacams_pop_desktop", "1", 1);
      loadScript();
    };

    const handleClick = () => {
      if (window.location.pathname.startsWith("/admin")) return;
      trigger();
    };

    document.addEventListener("mousedown", handleClick, { capture: true });
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return null;
}
