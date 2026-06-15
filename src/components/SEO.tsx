import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  noindex?: boolean;
}

export const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogUrl,
  noindex = false,
}: SEOProps) => {
  useEffect(() => {
    // 1. Update Document Title
    const baseTitle = "AI SmartSyS | Smart AI Solutions for a Smarter Future";
    document.title = title ? `${title} | AI SmartSyS` : baseTitle;

    // Helper to update or create a meta tag dynamically in the DOM
    const updateMetaTag = (nameAttr: string, value: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${nameAttr}"]` : `meta[name="${nameAttr}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        if (isProperty) {
          el.setAttribute("property", nameAttr);
        } else {
          el.setAttribute("name", nameAttr);
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    // 2. Update Description
    const baseDesc = "AI SmartSyS - Smart AI Solutions for a Smarter Future. Specialized in AI Development, Web Development, Automation, SCADA, and Chatbots.";
    const activeDesc = description || baseDesc;
    updateMetaTag("description", activeDesc);

    // 3. Update Keywords
    const baseKeywords = "AI, SmartSys, Artificial Intelligence, Automation, Web Development, SCADA, Chatbots, ML, Machine Learning, Orbit Engineering, Smart Solutions";
    updateMetaTag("keywords", keywords || baseKeywords);

    // 4. Update Indexing Directives (noindex for private routes)
    if (noindex) {
      updateMetaTag("robots", "noindex, nofollow");
    } else {
      updateMetaTag("robots", "index, follow");
    }

    // 5. Update OpenGraph Tags
    updateMetaTag("og:title", title ? `${title} | AI SmartSyS` : baseTitle, true);
    updateMetaTag("og:description", activeDesc, true);
    updateMetaTag("og:url", ogUrl || window.location.href, true);
    updateMetaTag("og:image", ogImage || "https://aismartsys.in/logo.png", true);

    // 6. Update Twitter Card Tags
    updateMetaTag("twitter:title", title ? `${title} | AI SmartSyS` : baseTitle);
    updateMetaTag("twitter:description", activeDesc);
    updateMetaTag("twitter:image", ogImage || "https://aismartsys.in/logo.jpg");

  }, [title, description, keywords, ogImage, ogUrl, noindex]);

  return null; // Visual-less component
};

export default SEO;
