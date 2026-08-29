import {
  createStudioOrder,
  storeStudioOrderSnapshot,
} from "../../pages/Mahreen-Studio/Purchase/storage";
import type { StudioOrder } from "../../pages/Mahreen-Studio/Purchase/types";
import { clientNotificationService } from "../notifications/clientNotificationService";
import { runWithDataSource } from "../serviceMode";

const placeOrder = async (paymentMethod: string, discount: number): Promise<StudioOrder | null> => {
  return createStudioOrder(paymentMethod, discount);
};

export const studioOrderService = {
  async placeOrder(paymentMethod: string, discount = 0) {
    const order = await runWithDataSource(
      () => placeOrder(paymentMethod, discount),
    );

    if (order) {
      storeStudioOrderSnapshot(order);

      clientNotificationService.publish({
        sourceId: order.orderNumber,
        ownerEmail: order.shipping.email,
        type: "studio-order",
        title: "Pesanan produk berhasil",
        description: `Terima kasih telah membeli ${order.item.productTitle} di Mahreen Studio. Pesanan nomor ${order.orderNumber} berhasil dibuat dan sedang masuk ke antrean persiapan. Tim kami akan memperbarui proses pengerjaan, pengemasan, dan pengiriman melalui akun Anda.`,
        status: "Berhasil dipesan",
        image: {
          kind: "studio-product",
          url: order.item.productImage,
          reference: order.item.productSlug,
          variant: order.item.color,
          alt: order.item.productTitle,
        },
      });
    }

    return order;
  },
};
