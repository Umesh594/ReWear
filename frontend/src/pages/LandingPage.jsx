import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Recycle, Leaf, Users, Star, ShoppingBag, PlusCircle, Search } from 'lucide-react';
import ItemCarousel from '@/components/ItemCarousel';
import Navigation from '@/components/Navigation';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Recycle className="h-5 w-5 text-primary mr-2" />
              <span className="text-primary font-medium">Sustainable Fashion Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Welcome to <span className="text-gradient-primary">ReWear</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your wardrobe sustainably. Exchange unused clothing through direct swaps or our point-based system. 
              Join thousands reducing textile waste while discovering new styles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="gradient-primary hover:opacity-90 px-8 py-6 text-lg">
                <Link to="/register">
                  Start Swapping <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
                <Link to="/browse">
                  Browse Items <Search className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Recycle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Direct Swaps</h3>
                <p className="text-muted-foreground">Exchange items directly with other users. Find perfect matches for your style and size preferences.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-accent/20">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-4">Point System</h3>
                <p className="text-muted-foreground">Earn points by listing items and redeem them for clothes you love. Fair and flexible exchange system.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-success/20">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-bold mb-4">Eco-Friendly</h3>
                <p className="text-muted-foreground">Reduce textile waste and promote sustainable fashion. Every swap makes a positive environmental impact.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Items</h2>
            <p className="text-xl text-muted-foreground">Discover amazing pieces from our community</p>
          </div>
          <ItemCarousel />
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/browse">
                View All Items <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Sustainable Fashion Journey?</h2>
          <p className="text-xl text-white/90 mb-8">Join thousands of users already making a difference</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="px-8 py-6 text-lg">
              <Link to="/register">
                <Users className="mr-2 h-5 w-5" />
                Join Community
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="px-8 py-6 text-lg text-white hover:bg-white/20">
              <Link to="/add-item">
                <PlusCircle className="mr-2 h-5 w-5" />
                List an Item
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-foreground text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Recycle className="h-8 w-8 text-primary mr-3" />
                <span className="text-2xl font-bold">ReWear</span>
              </div>
              <p className="text-white/70">Sustainable fashion through community-driven clothing exchange.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <div className="space-y-2">
                <Link to="/browse" className="block text-white/70 hover:text-white">Browse Items</Link>
                <Link to="/add-item" className="block text-white/70 hover:text-white">List Item</Link>
                <Link to="/dashboard" className="block text-white/70 hover:text-white">Dashboard</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/70 hover:text-white">Help Center</a>
                <a href="#" className="block text-white/70 hover:text-white">Contact</a>
                <a href="#" className="block text-white/70 hover:text-white">Community</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/70 hover:text-white">Privacy Policy</a>
                <a href="#" className="block text-white/70 hover:text-white">Terms of Service</a>
                <a href="#" className="block text-white/70 hover:text-white">Guidelines</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/70">
            <p>&copy; 2025 ReWear. All rights reserved. Making fashion sustainable, one swap at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;