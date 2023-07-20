'use client';

import { cp } from "fs";
import { LegacyRef, useRef } from "react";

export default function Page() {
    const inputRef = useRef<HTMLInputElement>();

    function handleClick() {
        console.log(typeof inputRef.current?.value);
        console.log(inputRef.current?.value);
        console.log(inputRef.current?.value === "");
    }

    return (
        <>
            <input
                ref={inputRef}
                className="border-2" 
                type="date" 
                onChange={(e) => console.log(e.target.value)} />
            <button
                className="border-2"
                onClick={handleClick}
            >Click me</button>
        </>
    )
}