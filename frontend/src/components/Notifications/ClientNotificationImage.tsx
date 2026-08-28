import csrImage from "../../assets/Ekosistem-Mahreen/mahreen-csr.webp";
import internshipImage from "../../assets/Ekosistem-Mahreen/mahreen-internship.webp";
import studioImage from "../../assets/Ekosistem-Mahreen/mahreen-studio.webp";
import peduliImage from "../../assets/Ekosistem-Mahreen/peduli-mahreen.webp";
import tanyaImage from "../../assets/Ekosistem-Mahreen/tanya-mahreen.webp";
import type { ClientNotificationImage as NotificationImage } from "../../services/notifications/clientNotificationService";

type ClientNotificationImageProps = Readonly<{
  image: NotificationImage;
  className?: string;
  width?: number;
  height?: number;
}>;

const genericImages: Record<
  Exclude<NotificationImage["kind"], "studio-product">,
  string
> = {
  studio: studioImage,
  peduli: peduliImage,
  tanya: tanyaImage,
  csr: csrImage,
  internship: internshipImage,
  mahreen: studioImage,
};

const resolveImage = (image: NotificationImage) => {
  if (image.kind !== "studio-product") return genericImages[image.kind];
  return image.url || studioImage;
};

const ClientNotificationImage = ({
  image,
  className,
  width = 96,
  height = 96,
}: ClientNotificationImageProps) => (
  <img
    className={className}
    src={resolveImage(image)}
    alt={image.alt}
    width={width}
    height={height}
    decoding="async"
    loading="lazy"
    onError={(event) => {
      event.currentTarget.onerror = null;
      event.currentTarget.src = "/mahreen-logo-192.webp";
    }}
  />
);

export default ClientNotificationImage;
