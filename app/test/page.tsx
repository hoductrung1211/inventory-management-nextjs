'use client';

import Image from "next/image";
import { useState } from "react";

interface IHomestay {
    homestayId: number,
    name: string,
    numPeople: number,
    price: number,
    images: string,
} 


export default function Page() {
    const address = "Nha Trang";
    const [homestays, setHomestays] = useState<IHomestay[]>([
        { homestayId: 1, name: "Căn hộ Mường Thanh Khánh Hoà - Review Nha Trang", numPeople: 2, price: 123, images: "abc"},
        { homestayId: 2, name: "B", numPeople: 2, price: 123, images: "abc"},
        { homestayId: 3, name: "C", numPeople: 2, price: 123, images: "abc"},
        { homestayId: 4, name: "D", numPeople: 2, price: 123, images: "abc"},
        { homestayId: 5, name: "E", numPeople: 2, price: 123, images: "abc"},
    ]);
    return (
        <div className="flex gap-3 w-[1200px] h-screen mx-auto border-x-2">
            <section className="flex-shrink-0 w-[300px] p-3 bg-gray-50">
                 
            </section>
            <section className="w-full flex flex-col gap-3 p-3 border-l-2">
                <h3 className="font-semibold text-lg">{address}: 740 properties founded</h3>

                 {homestays.map(homestay => (
                    <Homestay 
                        key={homestay.homestayId} 
                        homestay={homestay}
                     />
                 ))}
            </section>
        </div>
    )
}

function Homestay({
    homestay
}: {
    homestay: IHomestay
}) {
    return (
        <div className="flex items-start gap-3 w-full p-3 border rounded-md">
            <div className="relative flex-shrink-0 w-60 aspect-square bg-gray-50">
                <Image
                    className="object-contain"
                    src={""}
                    alt="homestay-image"
                    fill
                />
            </div>
            <div className="flex flex-col gap-5 w-full ">
                <h2 className="text-xl font-bold">{homestay.name}</h2>
                <p>{homestay.numPeople}</p>
                <p>{homestay.price}</p>
            </div>
        </div>
    )
}