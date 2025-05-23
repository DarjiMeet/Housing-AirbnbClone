'use client'

import { signIn } from "next-auth/react"

import { useCallback, useState } from "react"
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form'

import useRegisterModal from "@/app/hooks/useRegister"
import useLoginModal from "@/app/hooks/useLogin"

import Modal from "./Modal"
import Heading from "../Heading"
import Inputs from "../Inputs"
import toast from "react-hot-toast"

import { useRouter } from "next/navigation"




const LoginModal = ()=>{
    const router = useRouter()
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
    const [isLoading,setIsLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    }=useForm<FieldValues>({
        defaultValues:{
            email: '',
            password: ''
        }
    })

    const onSubmit : SubmitHandler<FieldValues>=(data)=>{
        setIsLoading(true)
        signIn('credentials',{
            ...data,
            redirect : false

        })
        .then((callback)=>{
            setIsLoading(false)

            if(callback?.ok){
                toast.success('Logged In')
                router.refresh()
                loginModal.onClose()
            }

            if(callback?.error){
                toast.error(callback.error)
            }
        })
    }

    const toggle = useCallback(()=>{
        loginModal.onClose()
        registerModal.onOpen()
    },[loginModal,registerModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title = 'Welcome back'
                subtitle="Login to your account!"
            />
            <Inputs 
                id='email'
                label="Email"
                register={register}
                disabled = {isLoading}
                errors={errors}
                required
            />
        
            <Inputs 
                id='password'
                type="password"
                label="Password"
                register={register}
                disabled = {isLoading}
                errors={errors}
                required
            />
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr/>
            {/* <Button
                outline
                label="Continue with Google"
                icon={FcGoogle}
                onClick={()=>{}}
            />
            <Button
                outline
                label="Continue with Github"
                icon={AiFillGithub}
                onClick={()=>{}} 
             /> */}
            

            <div
                className="
                    text-neutral-500
                    text-center
                    mt-4
                    font-light
                "
            >
                <div className="justify-center flex flex-row items-center gap-2">
                    <div>
                        First time using Airbnb?
                    </div>
                    <div
                        onClick={toggle}
                        className="
                            text-neutral-800
                            cursor-pointer
                            hover:underline
                        "
                    >
                        Create an account
                    </div>
                </div>
            </div>
        </div>

        
    )

    return(
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Login"
            actionLabel="Continue"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default LoginModal