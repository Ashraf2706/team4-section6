import { Card } from "@/components/ui/card";

export function FeatureShowcase() {
  const features = [
    {
      icon: "directions_walk",
      title: "Walking Routes",
      description: "Get optimized walking directions between any two locations on campus with distance and time estimates.",
    },
    {
      icon: "directions_bike",
      title: "Biking Paths",
      description: "Discover bike-friendly routes across campus with dedicated paths and accessibility information.",
    },
    {
      icon: "report",
      title: "Obstacle Reports",
      description: "Stay informed about construction, closures, and temporary obstacles affecting campus navigation.",
    },
  ];

  return (
    <section className="py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="p-8 hover-elevate transition-all duration-200"
              data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="material-icons text-primary text-4xl mb-4 block">
                {feature.icon}
              </span>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
