import { Listing, Reservation, User } from "@prisma/client";

export type safeUser = Omit<
    User,
    "createdAt" | "updatedAt" | "emailVerified"
> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
}

export type safeReservations = Omit<
    Reservation,
    "createdAt" | "startDate" | "endDate" | "listing"
>&{
    createdAt : string
    startDate:string
    endDate:string
    listing:safeListings
}

export type safeListings = Omit<
    Listing,
    "createdAt"
> & {
    createdAt : string
}