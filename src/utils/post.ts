import prisma from "@/lib/client";

export async function convertToSlug(title: string): string {
  const baseSlug = title
  .toLowerCase() // Convert to lowercase
  .trim() // Remove leading/trailing spaces
  .replace(/[^\w\s-]/g, "") // Remove special characters
  .replace(/\s+/g, "-") // Replace spaces with hyphens
  .replace(/--+/g, "-"); // Ensure no double hyphens

  let uniqueSlug = baseSlug;
  let counter = 1;

  while (
    await prisma.post.findFirst({
      where: {
        slug: {
          equals: uniqueSlug,
          mode: "insensitive",
        },
      },
    })
  ) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}