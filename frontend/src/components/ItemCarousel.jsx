import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredItems = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    description: "Classic 90s style denim jacket in excellent condition",
    condition: "Excellent",
    size: "M",
    category: "Outerwear",
    points: 45,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=300&h=400&fit=crop",
    uploader: "Sarah M.",
    rating: 4.8
  },
  {
    id: 2,
    title: "Floral Summer Dress",
    description: "Beautiful floral print dress perfect for summer occasions",
    condition: "Like New",
    size: "S",
    category: "Dresses",
    points: 35,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop",
    uploader: "Emma K.",
    rating: 4.9
  },
  {
    id: 3,
    title: "Designer Leather Boots",
    description: "Premium leather ankle boots with minimal wear",
    condition: "Good",
    size: "8",
    category: "Footwear",
    points: 60,
    image: "https://images.unsplash.com/photo-1608256246200-53e8b6b97284?w=300&h=400&fit=crop",
    uploader: "Alex R.",
    rating: 4.7
  },
  {
    id: 4,
    title: "Cozy Knit Sweater",
    description: "Warm wool blend sweater in neutral tones",
    condition: "Excellent",
    size: "L",
    category: "Knitwear",
    points: 40,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop",
    uploader: "Maya L.",
    rating: 4.6
  }
];

const getConditionColor = (condition) => {
  switch (condition) {
    case 'Like New': return 'bg-success text-success-foreground';
    case 'Excellent': return 'bg-primary text-primary-foreground';
    case 'Good': return 'bg-warning text-warning-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const ItemCarousel = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredItems.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-warning text-warning mr-1" />
                {item.rating}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-xs">{item.category}</Badge>
              <Badge variant="outline" className="text-xs">Size {item.size}</Badge>
              <Badge className={`text-xs ${getConditionColor(item.condition)}`}>
                {item.condition}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">by {item.uploader}</span>
              <span className="font-bold text-primary">{item.points} points</span>
            </div>
            
            <Button asChild className="w-full" size="sm">
              <Link to={`/item/${item.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ItemCarousel;