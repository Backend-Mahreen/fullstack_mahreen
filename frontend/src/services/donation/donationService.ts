import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { DonationDraft } from "../../pages/PeduliMahreen/Donasi/donationTypes";
import {
  getDonationDraft,
  markDonationPaid,
  saveDonationDraft,
} from "../../pages/PeduliMahreen/Donasi/donationStorage";
import { clientNotificationService } from "../notifications/clientNotificationService";
import { runWithDataSource } from "../serviceMode";

type DonationApiResult = Partial<DonationDraft> & {
  transactionId: string;
  status: "pending" | "paid";
  checkoutUrl?: string;
};

export type DonationPaymentResult = Readonly<{
  draft: DonationDraft;
  checkoutUrl?: string;
}>;

const processThroughApi = async (draft: DonationDraft): Promise<DonationPaymentResult> => {
  const result = await apiClient<DonationApiResult>(API_ENDPOINTS.donations.create, {
    method: "POST",
    body: {
      campaignId: draft.campaignId,
      amount: draft.amount,
      donor: draft.donor,
      paymentMethod: draft.paymentMethod,
      clientTransactionId: draft.transactionId,
    },
  });

  const nextDraft = saveDonationDraft({
    ...draft,
    ...result,
    status: result.status,
    transactionId: result.transactionId,
  });

  return { draft: nextDraft, checkoutUrl: result.checkoutUrl };
};

const processLocally = async (): Promise<DonationPaymentResult> => ({
  draft: markDonationPaid(),
});

export const donationService = {
  async processPayment(draft = getDonationDraft()) {
    const result = await runWithDataSource(
      () => processThroughApi(draft),
      () => processLocally(),
    );

    if (result.draft.status === "paid") {
      const amount = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(result.draft.amount);
      clientNotificationService.publish({
        sourceId: result.draft.transactionId,
        ownerEmail: result.draft.donor.email,
        type: "donation",
        title: "Donasi berhasil diterima",
        description: `Terima kasih telah menyalurkan donasi sebesar ${amount} melalui Peduli Mahreen. Donasi dengan ID transaksi ${result.draft.transactionId} telah kami terima dan tercatat untuk program yang Anda pilih. Perkembangan penyaluran dan aktivitas terkait dapat dipantau melalui akun Anda.`,
        status: "Berhasil",
        image: {
          kind: "peduli",
          alt: "Peduli Mahreen",
        },
      });
    }

    return result;
  },
};
