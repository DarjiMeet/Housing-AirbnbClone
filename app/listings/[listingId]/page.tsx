import getCurrentUser from "@/app/actions/getCurrentUser"
import getListingId from "@/app/actions/getListingId"
import ClientOnly from "@/app/components/ClientOnly"
import EmptyState from "@/app/components/EmptyState"
import ListingClient from "./ListingClient"
import getReservations from "@/app/actions/getReservations"


interface Iparams{
    listingId?: string
}

const ListingPage = async({params}:{params:Iparams}) =>{
    const listing = await getListingId(params)
    const currentUser = await getCurrentUser() 
    const reservations = await getReservations(params)

    if(!listing){
        return(
            <ClientOnly>
                <EmptyState/>
            </ClientOnly>
        )
    }
    return (
        <ClientOnly>
            <ListingClient
                // @ts-expect-error:it needs to be on this way
                listing={listing}
                reservations={reservations}
                currentUser = {currentUser}
            />
        </ClientOnly>
    )
}

export default ListingPage  