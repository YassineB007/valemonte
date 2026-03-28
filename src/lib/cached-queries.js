import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

export const getCollectionsForCarousel = unstable_cache(
  async () => {
    const collections = await prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      include: {
        products: {
          where: { isActive: true },
          include: {
            category: true,
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
          },
          orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
          take: 3,
        },
      },
    });

    const validCollections = collections.filter((c) => c.products.length > 0);

    return validCollections.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      season: c.season,
      coverImage: c.coverImage,
      description: c.description,
      products: c.products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price.toString(),
        categoryName: p.category.name,
        imageUrl: p.images[0]?.url || null,
      })),
    }));
  },
  ["home-collection-carousel"],
  { revalidate: 60, tags: ["collections"] }
);

export function getShopCategories() {
  return unstable_cache(
    async () =>
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
      }),
    ["shop-categories"],
    { revalidate: 120, tags: ["categories"] }
  )();
}

export function getShopProducts(categorySlug) {
  const slug = categorySlug || null;
  return unstable_cache(
    async () =>
      prisma.product.findMany({
        where: {
          isActive: true,
          ...(slug ? { category: { slug } } : {}),
        },
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      }),
    ["shop-products", slug ?? "all"],
    { revalidate: 120, tags: ["products"] }
  )();
}

export function getCollectionsList() {
  return unstable_cache(
    async () =>
      prisma.collection.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      }),
    ["collections-list"],
    { revalidate: 120, tags: ["collections"] }
  )();
}

export function getProductBySlug(slug) {
  return unstable_cache(
    async () =>
      prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          collection: true,
          images: { orderBy: { sortOrder: "asc" } },
          variants: { orderBy: { size: "asc" } },
        },
      }),
    ["product-detail", slug],
    { revalidate: 120, tags: ["products", `product-${slug}`] }
  )();
}

export function getCollectionBySlug(slug) {
  return unstable_cache(
    async () =>
      prisma.collection.findUnique({
        where: { slug },
        include: {
          products: {
            where: { isActive: true },
            include: {
              category: true,
              images: { orderBy: { sortOrder: "asc" }, take: 1 },
            },
            orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
          },
        },
      }),
    ["collection-detail", slug],
    { revalidate: 120, tags: ["collections", `collection-${slug}`] }
  )();
}
