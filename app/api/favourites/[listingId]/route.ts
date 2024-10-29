import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface Iparams {
    listingId?: string;
}

export async function POST(request: Request, { params }: { params: Iparams }) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
        return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
    }

    let favouriteIds = [...(currentUser.favoriteIds || [])];

    if (!favouriteIds.includes(listingId)) {
        favouriteIds.push(listingId);
    }

    try {
        const user = await prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                favoriteIds: favouriteIds,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Failed to update favorites:", error);
        return NextResponse.json({ error: "Failed to update favorites" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Iparams }) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
        return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
    }

    let favouriteIds = [...(currentUser.favoriteIds || [])];

    favouriteIds = favouriteIds.filter((id) => id !== listingId);

    try {
        const user = await prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                favoriteIds: favouriteIds,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Failed to update favorites:", error);
        return NextResponse.json({ error: "Failed to update favorites" }, { status: 500 });
    }
}
