import { useRouter } from "next/navigation"
import { useCallback, useMemo } from "react"
import {toast} from "react-hot-toast"

import { safeUser } from "../types"
import useLoginModal from "./useLogin"
import axios from "axios"

interface Ifavourites{
    listingId : string
    currentUser ?: safeUser | null
}

const useFavourites = ({
    listingId,
    currentUser
}:Ifavourites)=>{
    const router = useRouter()
    const login = useLoginModal()

    const hasFavourited = useMemo(()=>{
        const list = currentUser?.favoriteIds || []

        return list.includes(listingId)
    },[currentUser,listingId])

    const toggleFavourite = useCallback(async(e:React.MouseEvent<HTMLDivElement>)=>{
        e.stopPropagation()
        
        if(!currentUser){
            return login.onOpen()
        }

        try {
            let request;
            if(hasFavourited){
                request = ()=> axios.delete(`/api/favourites/${listingId}`)
                toast.success('Removed from favourites')

            }
            else{
                request = ()=> axios.post(`/api/favourites/${listingId}`)
                toast.success('Added to favourites')
            }

            await request();
            router.refresh();
           
        } catch (error) {
            toast.error('Something went wrong')
        }
    },[
        currentUser,
        hasFavourited,
        listingId,
        login,
        router
    ])

    return{
        hasFavourited,
        toggleFavourite
    }
}

export default useFavourites