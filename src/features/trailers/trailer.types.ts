export type TrailerStatus = "BOOKED" | "LOADED" | "LEFT_SITE";

export type Trailer = {
  id: number;
  date: string;
  loadNumber: string;
  bookedTime: string;
  carrier: string;
  plannedPallets: number;
  actualPallets?: number;
  door?: string;
  status: TrailerStatus;
  driverInAt?: string;
  driverInBy?: string;
  loadedAt?: string;
  loadedBy?: string;
  leftSiteAt?: string;
  leftSiteBy?: string;
};

export type NewTrailer = Pick<Trailer, "date" | "bookedTime" | "loadNumber" | "carrier" | "plannedPallets">;
