'use client'

import Image from "next/image"

const Avatar=()=>{
    return(
        <Image
            className ="ronded-full"
            height="30"
            width="30"
            alt="Avatar"
            src="/images/placeholder.png"
        />
    )
}

export default Avatar