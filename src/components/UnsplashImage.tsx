import { ImageWithFallback } from "./figma/ImageWithFallback";

export function UnsplashImage({ query, className }: { query: string, className?: string }) {
  const images: Record<string, string> = {
    "shed barn": "https://images.unsplash.com/photo-1488650989610-0d7e27dc293c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBiYXJuJTIwc2hlZHxlbnwxfHx8fDE3ODIxMzc5Njh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "shed front": "https://images.unsplash.com/photo-1581477701889-30c447824cd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnYXJkZW4lMjBzaGVkfGVufDF8fHx8MTc4MjEzNzk2OHww&ixlib=rb-4.1.0&q=80&w=1080"
  };

  return <ImageWithFallback src={images[query] || images["shed barn"]} className={className} />;
}
