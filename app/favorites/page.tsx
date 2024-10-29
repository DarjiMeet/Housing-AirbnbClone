import getCurrentUser from "../actions/getCurrentUser";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import getFavoriteListing from "../actions/getFavoriteListing";
import FavoriteClient from "./FavoriteClient";

const ListingPage = async () => {

    const listing = await getFavoriteListing()
    const currentUser = await getCurrentUser()

    if(listing.length === 0){
        return(
            <ClientOnly>
                <EmptyState
                    title="No favorites found"
                    subtitle="Looks like you have no favorite listing."
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <FavoriteClient
                listings = {listing}
                currentUser = {currentUser}
            />
        </ClientOnly>
    )
}

export default ListingPage