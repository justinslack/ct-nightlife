import VenuesSlider from "./venues-slider-server";

// Example usage of the Venues Slider component

export function VenuesExample() {
  return (
    <div className="space-y-16">
      {/* Basic usage */}
      <VenuesSlider />
      
      {/* With custom styling */}
      <VenuesSlider className="bg-blue-50" />
      
      {/* In a different section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Venues</h2>
          <VenuesSlider />
        </div>
      </section>
    </div>
  );
}

export default VenuesExample; 