'use client'

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { safeUser } from "../types";
import useFavourites from "../hooks/useFavourites";


interface HeartButtonProps{
    listingId:string;
    currentUser?:safeUser | null;
}

const HeartButton: React.FC<HeartButtonProps>  = ({
    listingId,
    currentUser
})=>{

    const {hasFavourited,toggleFavourite} = useFavourites({
        listingId,
        currentUser
    })
    
    return(
        <div 
        onClick={toggleFavourite}
        className="relative hover:opacticy-80 transition cursor-pointer">
            <AiOutlineHeart
                size={28}
                className="
                    fill-white
                    absolute
                    -top-[2px]
                    -right-[2px]
                "
            />
            <AiFillHeart
                size={24}
                className={hasFavourited?'fill-rose-500':'fill-neutral-500/70' }
            />
        </div>
    )
}

export default HeartButton