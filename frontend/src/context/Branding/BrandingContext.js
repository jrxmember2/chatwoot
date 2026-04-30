import React, { createContext, useEffect, useState } from "react";
import api from "../../services/api";

const defaultBranding = {
  loginLogoUrl: null,
  internalLogoUrl: null,
  faviconUrl: null,
  systemName: "WhaTicket",
  pageTitle: "WhaTicket",
  primaryColor: "#2576d2",
  secondaryColor: "#f50057",
  loginFooterText: "",
  showLoginLogo: true,
  showInternalLogo: true
};

const updateLinkHref = (selector, href) => {
  const element = document.querySelector(selector);

  if (element) {
    element.setAttribute("href", href);
  }
};

const applyBrandingToDocument = branding => {
  document.title = branding.pageTitle || defaultBranding.pageTitle;

  const faviconHref = branding.faviconUrl || "/favicon.ico";
  updateLinkHref("link[rel='icon']", faviconHref);
  updateLinkHref("link[rel='shortcut icon']", faviconHref);

  const themeColorMeta = document.querySelector("meta[name='theme-color']");

  if (themeColorMeta) {
    themeColorMeta.setAttribute(
      "content",
      branding.primaryColor || defaultBranding.primaryColor
    );
  }
};

const BrandingContext = createContext({
  branding: defaultBranding,
  loading: true,
  refreshBranding: async () => defaultBranding
});

const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState(defaultBranding);
  const [loading, setLoading] = useState(true);

  const refreshBranding = async () => {
    try {
      const { data } = await api.get("/branding");
      setBranding({ ...defaultBranding, ...data });
      return data;
    } catch (error) {
      return defaultBranding;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBranding();
  }, []);

  useEffect(() => {
    applyBrandingToDocument(branding);
  }, [branding]);

  return (
    <BrandingContext.Provider value={{ branding, loading, refreshBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};

export { BrandingContext, BrandingProvider, defaultBranding };
