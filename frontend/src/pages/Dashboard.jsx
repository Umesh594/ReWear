import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Star, 
  Package, 
  RefreshCw, 
  CheckCircle, 
  Plus, 
  Edit,
  Eye,
  Clock,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import axios from "axios";
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [browseItems, setBrowseItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [ongoingSwaps, setOngoingSwaps] = useState([]);
  const [completedSwaps, setCompletedSwaps] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("user_token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserPoints(parsedUser.points || 0);
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Fetch items and swaps
  const fetchDashboardData = async () => {
    try {
      // All items
      const itemsRes = await axios.get("http://localhost:8000/api/items/");
      setBrowseItems(itemsRes.data);

      // My items
      const myItemsRes = await axios.get("http://localhost:8000/api/items/my/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyItems(myItemsRes.data);

      // Swaps
      const swapsRes = await axios.get("http://localhost:8000/api/swap/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ongoing = swapsRes.data.filter(swap => swap.status === "pending");
      const completed = swapsRes.data.filter(swap => swap.status === "accepted" || swap.status === "rejected");
      setOngoingSwaps(ongoing);
      setCompletedSwaps(completed);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchDashboardData();

    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, [token]);

  if (!user) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-success text-success-foreground';
      case 'Swapped': return 'bg-primary text-primary-foreground';
      case 'Pending': return 'bg-warning text-warning-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'accepted': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Handle approval/rejection (admin)
  const handleSwapUpdate = async (swapId, action) => {
    try {
      await axios.patch(`http://localhost:8000/api/swap/${swapId}/update/`, 
        { action }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh swaps instantly
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to update swap:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.first_name}!</h1>
            <p className="text-muted-foreground">Manage your items and track your swaps</p>
          </div>
          <Button asChild className="gradient-primary mt-4 md:mt-0">
            <Link to="/add-item">
              <Plus className="mr-2 h-4 w-4" />
              List New Item
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Points Balance</p>
                  <p className="text-2xl font-bold text-primary">{userPoints}</p>
                </div>
                <Star className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Items</p>
                  <p className="text-2xl font-bold">{myItems.filter(item => item.status === 'Active').length}</p>
                </div>
                <Package className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ongoing Swaps</p>
                  <p className="text-2xl font-bold">{ongoingSwaps.length}</p>
                </div>
                <RefreshCw className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedSwaps.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="items">My Items</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing Swaps</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-muted-foreground">Member since Jan 2024</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-3" />
                      <span>New York, NY</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-muted-foreground mr-3" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Swap Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Swaps</span>
                    <span className="font-bold">{completedSwaps.length + ongoingSwaps.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Success Rate</span>
                    <span className="font-bold text-success">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Rating</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-warning fill-warning mr-1" />
                      <span className="font-bold">4.8</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Points Earned</span>
                    <span className="font-bold text-primary">{userPoints}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Items */}
          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>My Listed Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.category} • {item.condition}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Eye className="h-4 w-4 mr-1" />
                            {item.views} views
                          </div>
                          <span className="text-sm font-medium text-primary">{item.points} points</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/item/${item.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ongoing Swaps */}
<TabsContent value="ongoing">
  <Card>
    <CardHeader>
      <CardTitle>Ongoing Swaps</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {ongoingSwaps.map((swap) => (
        <div key={swap.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold">{swap.item_title}</h3>
              <p className="text-sm text-muted-foreground">
                From: {swap.sender_name} • To: {swap.receiver_name}
              </p>
            </div>
            <Badge variant="outline" className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {swap.status}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{new Date(swap.created_at).toLocaleDateString()}</span>
            <div className="flex items-center space-x-2">
              {swap.points && (
                <span className="text-sm font-medium text-primary">{swap.points} points</span>
              )}
              {/* Approve / Reject buttons for admin or uploader */}
              {user.isAdmin && swap.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSwapUpdate(swap.id, 'accepted')}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleSwapUpdate(swap.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
</TabsContent>

{/* Completed Swaps */}
<TabsContent value="completed">
  <Card>
    <CardHeader>
      <CardTitle>Completed Swaps</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {completedSwaps.map((swap) => (
        <div key={swap.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold">{swap.item_title}</h3>
              <p className="text-sm text-muted-foreground">
                From: {swap.sender_name} • To: {swap.receiver_name}
              </p>
            </div>
            <Badge
              className={`flex items-center ${
                swap.status === "accepted"
                  ? "bg-success text-success-foreground"
                  : "bg-destructive text-destructive-foreground"
              }`}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {swap.status === "accepted" ? "Completed" : "Rejected"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {new Date(swap.created_at).toLocaleDateString()}
            </span>
            <div className="flex items-center space-x-3">
              {swap.points && (
                <span className="text-sm font-medium text-primary">
                  +{swap.points} points
                </span>
              )}
              {swap.rating && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-warning fill-warning mr-1" />
                  <span className="text-sm">{swap.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;