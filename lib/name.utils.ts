export function getFirstName(name: string | null | undefined) {
  if (!name) return null;
  const firstName = name.split(" ")[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1);
}

export function getLastName(name: string | null | undefined) {
  if (!name) return null;
  const lastName = name.split(" ")[1];
  return lastName.charAt(0).toUpperCase() + lastName.slice(1);
}

export function capitalize(name: string | null | undefined) {
  if (!name) return null;

  const capitalized = name
    .trim()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
  return capitalized;
}
