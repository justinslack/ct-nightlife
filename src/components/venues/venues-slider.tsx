"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

type Venue = {
  slug: string;
  title: string;
  description: string;
  cover_image: string;
  date: string;
};

const cardColors = [
  { bg: "bg-orange-100", cardBg: "bg-orange-50", buttonBg: "bg-orange-800 hover:bg-orange-900" },
  { bg: "bg-emerald-100", cardBg: "bg-emerald-50", buttonBg: "bg-emerald-800 hover:bg-emerald-900" },
  { bg: "bg-teal-100", cardBg: "bg-teal-50", buttonBg: "bg-teal-800 hover:bg-teal-900" },
  { bg: "bg-purple-100", cardBg: "bg-purple-50", buttonBg: "bg-purple-800 hover:bg-purple-900" },
  { bg: "bg-amber-100", cardBg: "bg-amber-50", buttonBg: "bg-amber-800 hover:bg-amber-900" },
  { bg: "bg-rose-100", cardBg: "bg-rose-50", buttonBg: "bg-rose-800 hover:bg-rose-900" },
];

interface VenuesSliderClientProps {
  venues: Venue[];
  className?: string;
}

export function VenuesSliderClient({ venues, className }: VenuesSliderClientProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-5xl lg:text-9xl font-bold text-gray-900 mb-6 font-archivo">
              The<br/>Clubs
            </h2>
            <p className="text-lg text-gray-600 max-w-lg">
              The clubs that have been built in Cape Town.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-green-400 hover:bg-green-500 text-white border-green-400 hover:border-green-500 rounded-full px-8"
            >
              <Link href="/the-clubs">
                See All Clubs
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {venues.map((venue, index) => {
            const colors = cardColors[index % cardColors.length];
            return (
              <Card key={venue.slug} className={`${colors.cardBg} border-0 shadow-lg h-full overflow-hidden`}>
                <div className={`${colors.bg} p-6 h-48 flex items-center justify-center relative`}>
                  <Image
                    src={venue.cover_image}
                    alt={venue.title}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
                    {venue.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {venue.description}
                  </p>
                  <Button
                    asChild
                    className={`${colors.buttonBg} text-white rounded-full px-6 py-2 transition-all duration-200 mt-auto`}
                  >
                    <Link href={`/the-clubs/${venue.slug}`}>
                      Read the Story
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
} 