import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@assets/generated_images/UMBC_campus_aerial_view_c18e463d.png";

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <section 
      className="relative h-[60vh] md:h-[60vh] flex items-center justify-center"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50"
        aria-hidden="true"
      />
      
      <div className="relative z-10 w-full max-w-3xl px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Navigate UMBC Campus with Confidence
        </h1>
        <p className="text-base md:text-lg text-white/90 mb-8">
          Find buildings, get directions, and navigate obstacles across campus
        </p>
        
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              placeholder="Search for buildings, departments, or amenities..."
              className="h-14 pl-12 pr-4 text-base bg-white/95 backdrop-blur-md border-0 focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              data-testid="input-hero-search"
            />
          </div>
        </form>
      </div>
    </section>
  );
}
