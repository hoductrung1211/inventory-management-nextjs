import Link from "next/link";

export default function Table ({
    columns,
    dataSet,
}: {
    columns: {id: number, text: string, key: string, icon?: string, linkRoot?: string}[],
    dataSet: any[]
}) { 
    const colsCount = columns.length;
    let count = 0;

    return (
        <section className="flex flex-col h-full">
            <Header columns={columns} />

            <main className="mt-1 flex flex-col max-h-[560px] overflow-auto">
            {dataSet.map(row => (
                <div 
                    key={row.id}
                    className={`grid grid-cols-${colsCount} min-h-[48px] shrink-0 odd:bg-gray-50 border-2 border-transparent hover:border-gray-300 hover:bg-[#ecf0f1]`}>
                    {columns.map(col => (
                        <div key={col.key + col.text} className="col-span-1 grid place-items-center text-center">
                        {col.linkRoot
                            ? <Link className="w-full h-full grid place-items-center hover:bg-blue-100 text-blue-400 underline" href={col.linkRoot + row[col.key]}>{row[col.key]}</Link>
                            : row[col.key]
                        }
                        </div>
                    ))}
                </div>
            ))}
            </main>
        </section>
    )
}

export const enum ColType {
    Text = "text",
    Link = "link"
}
function Header({
    columns
}: {
    columns: {id: number, text: string, key: string, icon?: string}[],
}) {
    const colsCount = columns.length;
    const headerClassName = `h-11 grid grid-cols-${colsCount} rounded-t-md overflow-hidden text-white`;
    return (
        <header className={headerClassName}>
        {columns.map(col => (
            <div
                key={col.id} 
                className="col-span-1 grid place-items-center font-bold bg-[#34495e] hover:bg-opacity-90">
                {col.text}
            </div>
        ))}
        </header>
    )
}
 