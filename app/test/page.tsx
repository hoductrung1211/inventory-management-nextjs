'use client';

import { useState } from "react";

interface IRoom {
    name: string,
    price: number,
    checkIn: string, // or Date
    checkOut: string, // or Date
    amount: number,
    orderId: string,
    date: string, // or Date
}


export default function Page() {
    const [rooms, setRooms] = useState([
        { name: "Luxury Room", price: 600, checkIn: "20/11/2023", checkOut: "21/11/2023", amount: 600, orderId: "RPT MCK", date: "03/08/2023"},
        { name: "Luxury Room", price: 600, checkIn: "20/11/2023", checkOut: "21/11/2023", amount: 600, orderId: "RPT MCK", date: "03/08/2023"},
        { name: "Luxury Room", price: 600, checkIn: "20/11/2023", checkOut: "21/11/2023", amount: 600, orderId: "RPT MCK", date: "03/08/2023"},
        { name: "Luxury Room", price: 600, checkIn: "20/11/2023", checkOut: "21/11/2023", amount: 600, orderId: "RPT MCK", date: "03/08/2023"},
        { name: "Luxury Room", price: 600, checkIn: "20/11/2023", checkOut: "21/11/2023", amount: 600, orderId: "RPT MCK", date: "03/08/2023"},
    ])
    return (
        <div className="flex flex-col gap-4 w-[1200px] p-4 mx-auto border-2">
            <section className="">
                <input 
                    className="w-72 h-9 px-2 py-1 rounded-md border-2"
                    placeholder="Type something here..."
                />
            </section>
            <section className="grid grid-cols-3 gap-4">
            {rooms.map(room => 
                <Room room={room} />    
            )}
            </section>
        </div>
    )
}
 
function Room({
    room
}: {
    room: IRoom
}) {
    return (
        <div className="flex flex-col gap-3 py-2 px-3 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold">
                {room.name}
            </h3>
            <p>
                <span className="font-semibold">Price: </span> 
                ${room.price} per night
            </p>
            <div>
                <p>
                    <span className="font-semibold w-24 inline-block">Check In: </span>
                        {room.checkIn}
                    </p>
                <p><span className="font-semibold w-24 inline-block">Check Out: </span>{room.checkOut}</p>
            </div>
            <p>
                <span className="font-semibold">Amount: </span>
                ${room.amount}
            </p>
            <p>
                <span className="font-semibold">Order ID: </span>
                {room.orderId}
            </p>
            <p>
                <span className="font-semibold">Date: </span>
                {room.date}
            </p>
        </div>
    )
}