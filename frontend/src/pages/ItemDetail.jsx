import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowLeft, Heart, Share2, User, MessageCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const ItemDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserPoints(parsedUser.points || 0);
    }
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/items/${id}/`);
        const data = response.data;

        setItem({
          id: data.id,
          title: data.title,
          description: data.description,
          category: data.category,
          size: data.size || "M",
          condition: data.condition || "Like New",
          points: data.points || 0,
          price: data.price || 0, 
          rating: data.rating || 0,
          views: data.views || 0,
          images: data.image ? [data.image] : [],
          posted: data.posted || "",
          available: true,
          uploader: data.uploader || {
            username: data.uploader?.username || "Unknown",
            rating: 0,
            swaps: 0,
            joinDate: "",
          },
          tags: data.tags || [],
        });
      } catch (err) {
        console.error("Failed to fetch item details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSwapRequest = async () => {
    const token = localStorage.getItem('user_token');

    if (!token) {
      toast({
        title: "Not Logged In",
        description: "Please login to send a swap request.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/items/${item.id}/swap/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Swap Request Sent!",
        description: `${response.data.receiver_first_name} will be notified.`,
      });

      console.log("Swap request response:", response.data);
    } catch (error) {
      toast({
        title: "Swap Failed",
        description: error.response?.data?.message || "Could not send swap request.",
        variant: "destructive",
      });
      console.error("Swap request error:", error);
    }
  };

  const handlePointsRedeem = () => {
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "Please login to redeem points.",
        variant: "destructive",
      });
      return;
    }

    if (userPoints >= item.points) {
      setUserPoints(userPoints - item.points);
      toast({
        title: "Item Redeemed!",
        description: `You've redeemed this item for ${item.points} points.`,
      });
    } else {
      toast({
        title: "Insufficient Points",
        description: `You need ${item.points - userPoints} more points.`,
        variant: "destructive",
      });
    }
  };

  if (loading) return <p className="text-center py-12">Loading item details...</p>;
  if (!item) return <p className="text-center py-12">Item not found.</p>;
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link to="/browse" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] overflow-hidden rounded-lg">
              <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
            </div>
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.slice(1).map((img, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img src={img} alt={`${item.title} ${index + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold">{item.title}</h1>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsLiked(!isLiked)}>
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{item.category}</Badge>
                <Badge variant="outline">Points {item.points}</Badge>
                <Badge className="bg-primary text-primary-foreground">{item.rating}★</Badge>
                {!item.available && <Badge variant="destructive">Unavailable</Badge>}
              </div>

              <p className="text-lg text-muted-foreground mb-6">{item.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map(tag => (
                  <Badge key={tag} variant="secondary">#{tag}</Badge>
                ))}
              </div>
            </div>

            {/* Price */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-primary mb-2">{item.price} ₹</div>  {/* price */}
      <div className="text-xl font-semibold text-primary">{item.points} Points</div>  {/* points */}
                  <p className="text-muted-foreground">or direct swap</p>
                </div>

                {user && item.available ? (
                  <div className="space-y-3">
                    <Button onClick={handleSwapRequest} className="w-full" size="lg">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Request Swap
                    </Button>
                    <Button 
                      onClick={handlePointsRedeem} 
                      variant="outline" 
                      className="w-full" 
                      size="lg"
                      disabled={userPoints < item.points}
                    >
                      Redeem for {item.points} Points
                      {userPoints < item.points && (
                        <span className="ml-2 text-destructive">
                          (Need {item.points - userPoints} more)
                        </span>
                      )}
                    </Button>
                  </div>
                ) : !user ? (
                  <div className="text-center">
                    <p className="mb-4 text-muted-foreground">Sign in to swap or redeem</p>
                    <Button asChild className="w-full">
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Badge variant="destructive">This item is no longer available</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Uploader Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.uploader.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-warning text-warning mr-1" />
                        {item.uploader.rating}
                      </div>
                      <span>{item.uploader.swaps} swaps</span>
                      <span>Member since {item.uploader.joinDate}</span>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => navigate("/dashboard")}>View Dashboard</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
