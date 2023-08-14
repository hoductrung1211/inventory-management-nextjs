'use client';
import BackwardButton from "@/components/BackwardButton";
import ControlContainer, { ControlItem } from "@/components/ControlContainer";
import InfoContainer, { InfoItem } from "@/components/InfoContainer";
import PageTitle from "@/components/PageTitle";
import Title from "@/components/Title";
import Header  from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";

export default function Page({
    params
}: {
    params: {id: string}
}) {
    const infoList: {title: string, content: string}[] = [
        {title: "Supplier", content: ""},
        {title: "Warehouse", content: "warehouse?.name"},
        {title: "State", content: "trackingState?.name"},
        {title: "Receipt", content: "order?.receiptId" },
    ];

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex items-center gap-4">
                    <BackwardButton />
                    <PageTitle text="Something details" />
                </div>
            </Header>
            <Main>
                <div className="w-full h-full flex gap-3">
                    <section className="w-1/2 p-3 flex flex-col gap-5  border ">
                        {/* Icon */}
                        <Title icon="home">Test</Title>
                        {/* InfoList  */}
                        <InfoContainer>
                        {infoList.map(info => (
                            <InfoItem info={info} />
                        ))}                            
                        </InfoContainer>
                        {/* Control Manager  */}
                        <ControlContainer>
                            <ControlItem text="what">

                            </ControlItem>
                        </ControlContainer>
                    </section>
                    <section className="w-1/2 border"></section>
                </div>
            </Main>
        </section>
    )
}
 