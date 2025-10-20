export function cn(...inputs: (string | false | null | undefined)[]) {
  // Filter out falsy values and join the remaining strings
  const classes = inputs.filter(Boolean).join(" ");

  // Split the combined classes by spaces and remove duplicates
  const uniqueClasses = Array.from(new Set(classes.split(" ")));

  // Return the merged classes as a single string
  return uniqueClasses.join(" ");
}
