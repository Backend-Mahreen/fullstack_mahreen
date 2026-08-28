import type { SyntheticEvent } from "react";

const NEWSROOM_IMAGE_FALLBACK = "/og-image.jpg";

export const handleNewsroomImageError = (
  event: SyntheticEvent<HTMLImageElement>,
) => {
  const image = event.currentTarget;

  if (image.dataset.newsroomFallback === "applied") {
    image.hidden = true;
    return;
  }

  image.dataset.newsroomFallback = "applied";
  image.removeAttribute("srcset");
  image.removeAttribute("sizes");
  image.src = NEWSROOM_IMAGE_FALLBACK;
};
