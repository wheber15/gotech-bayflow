export type TrailerStatus = "BOOKED" | "DRIVER_IN" | "LOADED" | "LEFT_SITE";

export type Trailer = {
  id: number;
  bookedTime: string;
  carrier: string;
  plannedPallets: number;
  actualPallets?: number;
  door?: string;
  status: TrailerStatus;
  driverInAt?: string;
  loadedAt?: string;
  leftSiteAt?: string;
};
