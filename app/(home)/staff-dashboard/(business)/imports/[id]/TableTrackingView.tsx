'use client';

import { getAllEmployees } from "@/api/employee";
import { getTrackingsByOrderId } from "@/api/importTracking";
import Icon from "@/components/Icon";
import datetimeFormat from "@/utils/functions/datetimeFormat";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import { useEffect, useState } from "react";

interface ITrackingData {
    employee: string,
    content: string,
    updateTime: string,
}

export default function TableTrackingView({
    orderId
}: {
    orderId: number
}) {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [trackings, setTrackings] = useState<ITrackingData[]>([]);

    useEffect(() => {
        fetchTrackings();
    }, []);

    const fetchTrackings =async () => {
        showLoading();
        try {
            const {data: trackingsRes} = await getTrackingsByOrderId(orderId);
            const {data: employees} = await getAllEmployees();

            setTrackings(trackingsRes.map(tracking => {
                const employee = employees.find(ee => ee.id == tracking.employeeId);

                return {
                    employee: employee?.lastName + " " + employee?.firstName,
                    content: tracking.content,
                    updateTime: datetimeFormat(tracking.dateTime),
                }
            }))
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }

    return (
        <section className="flex flex-col gap-2 w-1/2">
            <div className="flex items-center py-2 gap-3">
                <div className="w-12 aspect-square grid place-items-center rounded-full text-gray-700 bg-slate-200"><Icon name="clock" size="xl" /></div>
                <h3 className="font-semibold">
                    Order Trackings
                </h3>
            </div>
            <div className="mt-2 flex flex-col h-full">
                <header className="grid grid-cols-3 items-center py-1 px-2 h-11 border-b text-center font-semibold bg-gray-50 rounded-t-md">
                    <div className="col-span-1">Employee</div>
                    <div className="col-span-1">Content</div>
                    <div className="col-span-1">Update Time</div>
                </header>
                <main className="h-[550px] overflow-auto">
                {
                    trackings.map(tracking => (
                        <div key={tracking.updateTime} className="grid grid-cols-3 items-center text-center  py-1 px-2 h-11 border-b ">
                            <div className="col-span-1">{tracking.employee}</div>
                            <div className="col-span-1 ">{tracking.content}</div>
                            <div className="col-span-1 ">{tracking.updateTime}</div>
                        </div>
                    ))
                }
                </main>
            </div>
        </section>
    )
}