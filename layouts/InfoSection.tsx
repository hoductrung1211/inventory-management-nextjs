import Title from "@/components/DashboardTitle";
import InfoBar from "@/components/InfoBar";
import { Color } from "@/utils/constants/colors";

export default function InfoSection({
    data
}: {
    data: {
        [key: string]: number | string
    }
}) {
    return (
        <section className="w-full h-full p-3 pt-6 flex flex-col border-2 rounded-l-sm gap-6">
            <Title
                text="Detailed Information"
                icon="circle-info"
                color={Color.BLUE}
            /> 
            <div className="flex flex-col gap-3"> 
                {/* {inforBars.map(infoBar =>
                    <InfoBar
                        key={infoBar.label}
                        label={infoBar.label}
                        value={employee?.[infoBar.key] ?? ""}
                        icon={infoBar.icon}
                    />
                )} */}
            </div>
        </section>
    )
}