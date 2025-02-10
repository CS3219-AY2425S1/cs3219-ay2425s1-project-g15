export function capitalizeWords(input: string): string {
  return input
    .split(" ") // Split the string by spaces to get each word
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter and lowercase the rest
    .join(" "); // Join the words back into a single string
}
