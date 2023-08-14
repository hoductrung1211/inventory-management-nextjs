export default function InfoContainer({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex flex-col bg-gray-50 p-5 rounded-md"> 
        {children}
        </section>
    )
}

export function InfoItem({
    info,
}: {
    info: {
        title: string,
        content: string,
    }
}) {
    return (
        <div className="py-2 flex justify-between items-center border-b border-dashed">
            <h4 className="w-1/3 px-3 rounded-lg text-blue-500  font-bold ">
                {info.title}
            </h4>
            {info.content} 
        </div>
    )
}