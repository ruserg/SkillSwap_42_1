import { useEffect } from "react";
import type { IPageMetaProps } from "./pageMeta.types";

export const PageMeta = (props: IPageMetaProps) => {
  const {
    title = "SkillSwap",
    description = "SkillSwap — платформа для обмена навыками, обучения и поиска единомышленников.",
    ogTitle,
    ogDescription,
    children,
  } = props;

  useEffect(() => {
    if (title) {
      document.title =
        title === "SkillSwap" ? "SkillSwap" : `SkillSwap - ${title}`;

      const ogTitleElement = document.querySelector(
        "meta[property='og:title']",
      ) as HTMLMetaElement;
      if (ogTitleElement && !ogTitle)
        ogTitleElement.content =
          title === "SkillSwap" ? "SkillSwap" : `SkillSwap - ${title}`;
      if (ogTitleElement && ogTitle) ogTitleElement.content = `${ogTitle}`;
    }

    if (description) {
      const metaDescriptionElement = document.querySelector(
        "meta[name='description']",
      ) as HTMLMetaElement;
      if (metaDescriptionElement) metaDescriptionElement.content = description;

      const ogDescriptionElement = document.querySelector(
        "meta[property='og:description']",
      ) as HTMLMetaElement;
      if (ogDescriptionElement)
        ogDescriptionElement.content = ogDescription || description;
    }
  }, [title, description, ogTitle, ogDescription]);

  return children;
};
