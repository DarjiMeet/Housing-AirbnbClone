'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { toast } from "react-hot-toast"
import { safeReservations,safeUser  } from "../types"
import Heading from "../components/Heading"
import Container from "../components/Container"
import ListingCard from "../components/Listing/ListingCard"

interface ReservationsClientProps{
    reservations: safeReservations[]
    currentUser?: safeUser | null
}

const ReservationsClient:React.FC<ReservationsClientProps>=({
    reservations,
    currentUser
})=>{

    const router =useRouter()
    const [deletingId, setDeletingId] = useState('')

    const onCancel = useCallback((id : string)=>{
        setDeletingId(id)

        axios.delete(`/api/reservations/${id}`)
        .then(()=>{
            toast.success('Reservation cancelled')
            router.refresh()
        })
        .catch((error)=>{
            toast.error('Something went wrong')
        })
        .finally(()=>{
            setDeletingId('')
        })
    },[router])

    return(
        <Container>
            <Heading
                title="Reservations"
                subtitle="Bookings on your properties"
            />
            <div 
                className="
                    mt-10
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                    2xl:grid-cols-6
                    gap-8   
                "
            >
                {reservations.map((reservations)=>(
                    <ListingCard
                        key={reservations.id}
                        data={reservations.listing}
                        reservation={reservations}
                        actionId={reservations.id}
                        onAction={onCancel}
                        disabled={deletingId===reservations.id}
                        actionLabel="Cancel reservation"
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    )
}

export default ReservationsClient