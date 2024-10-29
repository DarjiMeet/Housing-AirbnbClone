import prisma from "@/app/libs/prismadb"

interface Iparams{
    listingId?:string
    userId?:string
    authorId?:string
}

export default async function getReservations(params: Iparams){
    try {

        const{listingId, userId, authorId} = params

        const query: any={}
    
        if(userId){
            query.userId =  userId
        }
        if(listingId){
            query.listingId = listingId
        }
        if(authorId){
            query.listing = {userId: authorId}
        }

        const reservations = await prisma.reservation.findMany({
            where:query,
            include:{
                listing:true
            },
            orderBy:{
                createdAt:'desc'
            }
        })

        const safeReservations = reservations.map((reservations)=>({
            ...reservations,
            createdAt:reservations.createdAt.toISOString(),
            startDate:reservations.startDate.toISOString(),
            endDate:reservations.endDate.toISOString(),
            listing:{
                ...reservations.listing,
                createdAt: reservations.listing.createdAt.toISOString()
            }
        }))

        return safeReservations
        
    } catch (error:any) {
        throw new Error(error)
    }
    
}