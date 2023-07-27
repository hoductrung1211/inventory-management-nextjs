export default function validate(fields: {
    value: string,
    isRequired: boolean,
    errorText: string,
}[]): [boolean, string[]] {
    let isValid = true;
    let errors: string[] = [];

    fields.forEach(field => {
        if (field.isRequired && !field.value.trim()) {
            isValid = false;
            errors.push("Cannot blank this field");
        }
    });
    return [isValid, errors];
}