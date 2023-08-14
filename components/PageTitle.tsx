export default function PageTitle({
    text
}: {
    text: string,
}) {
    return (
        <h1 className="font-semibold">{text}</h1>
    )
}