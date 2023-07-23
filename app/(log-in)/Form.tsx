import Image from "next/image"
import { ChangeEvent, FormEvent } from "react"
import Icon from "@/components/Icon"

export default function Form({
    children,
    src,
    title,
    handleSubmitForm
}: {
    children: React.ReactNode,
    src: string,
    title: string,
    handleSubmitForm: (e: FormEvent<HTMLFormElement>) => void
}) {
    return (
        <section 
            className=" w-full max-w-xs mx-auto md:w-1/2 lg:w-1/3 pt-10 flex flex-col "
            onSubmit={handleSubmitForm}
        >
            <section className="mb-4">
                <div className="mx-auto relative w-full h-28">
                    <Image
                        className="object-contain"
                        src={src}
                        fill
                        alt="welcome illustration"
                    />                        
                </div>
                <h2 className="text-xl font-extrabold text-center text-lime-400">{title}</h2>
            </section>

            <form className="relative h-full flex flex-col gap-3">
                {children} 
            </form>
        </section>
    )
}

export function Input({
    label,
    value,
    placeholder,
    icon,
    type = 'text',
    error,
    handleChangeInput
}: {
    label: string,
    value: string,
    placeholder: string,
    icon: string,
    error: string | false,
    type?: 'text' | 'password',
    handleChangeInput: (e: ChangeEvent<HTMLInputElement>) => void, 
}) {
    return (
        <label className=" flex flex-col">
            {label}
            <div className="relative">
                <input 
                    className={"border-2 w-full rounded-md py-2 pl-3 pr-10 " + (error ? " border-red-500 " : "")}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChangeInput} 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Icon name={icon} size="lg"/>
                </span>
            </div>
            <p className=" pl-3 text-red-600">{error}</p>
        </label>
    )
}

export function Button({
    text
}: {
    text: string,
}) {
    return (
        <button className="absolute left-0 right-0 bottom-0 h-10 rounded-md bg-lime-400 text-white font-bold">
            {text}
        </button>
    )
}