import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, Eye, SlidersHorizontal } from 'lucide-react';
import Navigation from '@/components/Navigation';
import axios from 'axios';
import debounce from "lodash.debounce";

const BrowseItems = ({ CURRENT_USER_ID }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const categories = ['All', 'Tops', 'Dresses', 'Footwear', 'Accessories'];
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const conditions = ['All', 'Like New', 'Excellent', 'Good', 'Fair'];

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Like New': return 'bg-success text-success-foreground';
      case 'Excellent': return 'bg-primary text-primary-foreground';
      case 'Good': return 'bg-warning text-warning-foreground';
      case 'Fair': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Ultra-smooth debounce with immediate searching indicator
  const fetchItemsFromBackend = async (query, cat, size, condition, pageNum) => {
    setSearching(true);
    try {
      let response;
      if (query) {
        response = await axios.get(`http://localhost:8000/api/ml/smart-search/`, {
          params: {
            query,
            category: cat !== "All" ? cat : undefined,
            size: size !== "all" ? size : undefined,
            condition: condition !== "all" ? condition : undefined,
            page: pageNum
          }
        });
      } else {
        response = await axios.get(`http://localhost:8000/api/items/`, {
          params: {
            category: cat !== "All" ? cat : undefined,
            size: size !== "all" ? size : undefined,
            condition: condition !== "all" ? condition : undefined,
            page: pageNum
          }
        });
      }
      setAllItems(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch items from backend");
      console.error(err);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((q, cat, size, condition, pageNum) => {
      fetchItemsFromBackend(q, cat, size, condition, pageNum);
    }, 300),
    []
  );

  // Fetch items whenever search, filters, or page change
  useEffect(() => {
    setLoading(true);
    debouncedFetch(searchQuery, selectedCategory, selectedSize, selectedCondition, page);
  }, [searchQuery, selectedCategory, selectedSize, selectedCondition, page, debouncedFetch]);

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/ml/recommend/`, {
          params: { user_id: CURRENT_USER_ID, top_n: 5 }
        });
        setRecommendedItems(res.data);
      } catch(err) { console.error(err); }
    };
    fetchRecommended();
  }, [CURRENT_USER_ID]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Items</h1>
          <p className="text-muted-foreground">Discover amazing pieces from our community</p>
        </div>

        {/* Searching/Loading/Error */}
        {searching && <p className="text-center py-2 text-sm text-muted-foreground">Searching...</p>}
        {loading && <p className="text-center py-12">Loading items...</p>}
        {error && <p className="text-center text-red-500 py-12">{error}</p>}

        {!loading && !error && (
          <>
            {/* Search & Filters */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                </Button>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">{allItems.length} items found</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="points-low">Points: Low to High</SelectItem>
                      <SelectItem value="points-high">Points: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {showFilters && (
                <Card className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Size</label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{sizes.map(s => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Condition</label>
                      <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    {(selectedCategory !== 'All' || selectedSize !== 'all' || selectedCondition !== 'all' || searchQuery) && (
                      <div className="flex items-end">
                        <Button variant="outline" onClick={() => {
                          setSelectedCategory('All'); setSelectedSize('all'); setSelectedCondition('all'); setSearchQuery(''); setPage(1);
                        }} className="w-full">Clear Filters</Button>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* Recommended Items */}
            {recommendedItems.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Recommended for You</h2>
                <div className="flex gap-4 overflow-x-auto">
                  {recommendedItems.map(item => (
                    <Card key={item.id} className="min-w-[200px]">
                      <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                      <CardContent>
                        <h3>{item.title}</h3>
                        <Badge>{item.category}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-warning text-warning mr-1" />{item.rating}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      <Badge variant="outline" className="text-xs">{item.type || 'Unknown Type'}</Badge>
                      <Badge variant="outline" className="text-xs">{item.color || 'Unknown Color'}</Badge>
                      <Badge variant="outline" className="text-xs">{item.style || 'Unknown Style'}</Badge>
                      <Badge className={`text-xs ${getConditionColor(item.condition)}`}>{item.condition}</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-primary">{item.points} points</span>
                    </div>
                    <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />{item.views} views
                      </div>
                      <span>{item.posted}</span>
                    </div>
                    <Button asChild className="w-full" size="sm">
                      <Link to={`/item/${item.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-8 space-x-4">
              <Button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Previous</Button>
              <span className="text-sm text-muted-foreground">Page {page}</span>
              <Button onClick={() => setPage(prev => prev + 1)}>Next</Button>
            </div>

            {allItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No items found matching your criteria.</p>
                <Button onClick={() => {
                  setSelectedCategory('All'); setSelectedSize('all'); setSelectedCondition('all'); setSearchQuery('');
                }}>Clear All Filters</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default BrowseItems;
