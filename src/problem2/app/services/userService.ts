import type { UserAsset } from "~/types/token";

export async function getUserAssets(): Promise<{
  data: UserAsset[];
}> {
  return {
    data: [
      {
        currency: "BLUR",
        amount: 50,
      },
      {
        currency: "bNEO",
        amount: 20,
      },
      {
        currency: "BUSD",
        amount: 350,
      },
      {
        currency: "USD",
        amount: 100,
      },
      {
        currency: "ETH",
        amount: 2,
      }
    ],
  };
}
