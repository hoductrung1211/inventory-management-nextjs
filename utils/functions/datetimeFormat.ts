export default function datetimeFormat(datetime: Date) {
    return new Date(datetime).toLocaleString();
}