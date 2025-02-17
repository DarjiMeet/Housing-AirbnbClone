'use client'

import { cat } from "@/app/components/Navbar/Categories"
import { safeListings, safeReservations, safeUser } from "@/app/types"

import { useCallback, useEffect, useMemo, useState } from "react"

import Container from "@/app/components/Container"
import ListingHead from "@/app/components/Listing/ListingHead"
import ListingInfo from "@/app/components/Listing/ListingInfo"
import useLoginModal from "@/app/hooks/useLogin"
import { useRouter } from "next/navigation"
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns"
import axios from "axios"
import toast from "react-hot-toast"
import ListingReservation from "@/app/components/Listing/ListingReservation"
import { Range } from "react-date-range"


const initialDateRange={
    startDate : new Date(),
    endDate : new Date(),
    key : 'selection'
}

interface ListingClientProps{
    reservations?: safeReservations[]
    listing : safeListings & {
        user : safeUser
    }
    currentUser?: safeUser | null
}

const ListingClient: React.FC<ListingClientProps> = ({
    reservations = [],
    listing,
    currentUser
}) =>{

    const loginModal = useLoginModal()
    const router = useRouter()

    const disabledDates = useMemo(()=>{
        let dates: Date[] = []
        reservations.forEach((reservations)=>{
            const range = eachDayOfInterval({
                start: new Date(reservations.startDate),
                end: new Date(reservations.endDate)
            })
            dates = [...dates, ...range]
        })
        return dates
    },[reservations])

    const [isLoading,setIsLoading] = useState(false)
    const [totalPrice,setTotalPrice] = useState(listing.price)
    const [dateRange, setDateRange] = useState<Range>(initialDateRange)

    const onCreateReservation = useCallback(()=>{
        if(!currentUser){
            return loginModal.onOpen()
        }

        setIsLoading(true)
        axios.post('/api/reservations',{
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing?.id
        })
        .then(()=>{
            toast.success('Listing reserved!')
            setDateRange(initialDateRange)
            router.push('/trips') 
        })
        .catch(()=>{
            toast.error('Something went wrong.')
        })
        .finally(()=>{
            setIsLoading(false)
        })
    },[
        totalPrice,
        dateRange,
        listing?.id,
        router,
        currentUser,
        loginModal
    ])

    useEffect(()=>{
        if(dateRange.startDate && dateRange.endDate){
            const dayCount = differenceInCalendarDays(
                dateRange.endDate,
                dateRange.startDate
            )

        if(dayCount && listing.price){
            setTotalPrice(dayCount * listing.price)
        }
        else{
            setTotalPrice(listing.price)
        }
        }
    },[dateRange,listing.price])

    const category = useMemo(()=>{
        return cat.find((item)=>item.label===listing.category)
    },[listing.category])
    
    return(
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                    />
                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-7
                            md:gap-10
                            mt-6
                        "
                    >
                        <ListingInfo
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            roomCount={listing.roomCount}
                            guestCount={listing.guestCount}
                            bathroomCount={listing.bathroomCount}
                            locationValue={listing.locationValue}
                        />

                        <div
                            className="
                                order-first
                                mb-10
                                md:order-last
                                md:col-span-3
                            "
                        >
                            <ListingReservation
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value)=>setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateReservation}
                                disabledDates={disabledDates}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ListingClient