import { apiRequest } from "./client";

export type PublicPremiumPrice = {
  priceInr: number;
  currency: string;
};

export function getPublicPremiumPrice(options?: { next?: { revalidate?: number }; signal?: AbortSignal }) {
  return apiRequest<PublicPremiumPrice>("/api/v1/public/pricing/premium", {
    cache: "force-cache",
    next: options?.next ?? { revalidate: 120 },
    signal: options?.signal,
  });
}
