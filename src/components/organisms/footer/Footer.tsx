import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-archivo">CT Nightlife</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Preserving the legacy of Cape Town's vibrant nightlife culture. 
              Discover the clubs that shaped a generation.
            </p>
            <div className="flex space-x-4">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="hover:bg-pink-600 hover:text-white"
              >
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="hover:bg-pink-600 hover:text-white"
              >
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-5 h-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="hover:bg-pink-600 hover:text-white"
              >
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-5 h-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-archivo">Explore</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/the-clubs" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                The Clubs
              </Link>
              <Link href="/djs" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                The DJs
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                About Us
              </Link>
              <Link href="/contribute" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                Contribute
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-archivo">Resources</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/documents" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                All Documents
              </Link>
              <Link href="/timeline" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                Timeline
              </Link>
              <Link href="/map" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                Interactive Map
              </Link>
              <Link href="/archive" className="text-gray-300 hover:text-pink-400 transition-colors text-sm">
                Full Archive
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-archivo">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span>Cape Town, South Africa</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-pink-400" />
                <Link href="mailto:hello@ctnightlife.com" className="hover:text-pink-400 transition-colors">
                  hello@ctnightlife.com
                </Link>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-pink-400" />
                <span>+27 (0) 21 123 4567</span>
              </div>
            </div>
            <div className="pt-2">
              <Button
                asChild
                size="sm"
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Link href="/contribute">
                  Submit Your Story
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Large Title Section */}
        <div className="border-t border-gray-700 mt-16 pt-16">
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold font-archivo text-white leading-none">
              Echoes
            </h2>
            <p className="text-2xl md:text-3xl lg:text-4xl font-archivo text-gray-300 mt-4">
              An Archive
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} CT Nightlife. All rights reserved. Preserving Cape Town's club culture.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-pink-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-pink-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-pink-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 