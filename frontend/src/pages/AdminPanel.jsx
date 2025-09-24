import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Eye, Users, Package, AlertTriangle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [pendingItems, setPendingItems] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [completedSwaps, setCompletedSwaps] = useState([]);
  const [suspiciousSwaps, setSuspiciousSwaps] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("user_token");

  // Check admin
  useEffect(() => {
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (!parsedUser.isAdmin) {
        navigate('/'); // not admin, redirect
      }
    } else {
      navigate('/'); // no user logged in, redirect
    }
  }, [navigate]);

  // Fetch admin stats
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [pendingRes, usersRes, itemsRes, completedRes, suspiciousRes] = await Promise.all([
          axios.get("http://localhost:8000/api/admin/swaps/pending/", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:8000/api/admin/users/", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:8000/api/admin/items/", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:8000/api/admin/swaps/completed/", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:8000/api/ml/suspicious-swaps/", {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        setPendingItems(pendingRes.data);
        setTotalUsers(usersRes.data.total_users);
        setTotalItems(itemsRes.data.total_items);
        setCompletedSwaps(completedRes.data);
        setSuspiciousSwaps(suspiciousRes.data);

      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      }
    };

    fetchData();
  }, [token]);

  // Approve swap request
  const handleApprove = async (swapId) => {
    try {
      await axios.post(`http://localhost:8000/api/admin/swaps/${swapId}/approve/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingItems(prev => prev.filter(item => item.id !== swapId));
      setCompletedSwaps(prev => [...prev, { id: swapId }]);
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  // Reject swap request
  const handleReject = async (swapId) => {
    try {
      await axios.post(`http://localhost:8000/api/admin/swaps/${swapId}/reject/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingItems(prev => prev.filter(item => item.id !== swapId));
      setCompletedSwaps(prev => [...prev, { id: swapId }]);
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  if (!user || !user.isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Total Users</div>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Total Items</div>
                  <div className="text-2xl font-bold">{totalItems}</div>
                </div>
                <Package className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Pending Review</div>
                  <div className="text-2xl font-bold text-warning">{pendingItems.length}</div>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Completed Swaps</div>
                  <div className="text-2xl font-bold">{completedSwaps.length}</div>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Suspicious Swaps</div>
                  <div className="text-2xl font-bold text-destructive">{suspiciousSwaps.length}</div>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">Pending Items</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="fraud">Suspicious Swaps</TabsTrigger>
          </TabsList>

          {/* Pending Items */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Items Pending Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingItems.length === 0 && <div className="text-muted-foreground">No pending requests.</div>}
                  {pendingItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.item.image}
                        alt={item.item_title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.item_title}</h3>
                        <div className="text-sm text-muted-foreground">
                          by {item.sender_name} → {item.receiver_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Status: <Badge>{item.status}</Badge> • {new Date(item.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          onClick={() => handleApprove(item.id)}
                          className="bg-success text-success-foreground hover:bg-success/90"
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(item.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground">User management features coming soon...</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground">Reporting features coming soon...</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suspicious Swaps */}
          <TabsContent value="fraud">
            <Card>
              <CardHeader>
                <CardTitle>Suspicious Swaps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suspiciousSwaps.length === 0 && <div className="text-muted-foreground">No suspicious swaps detected.</div>}
                  {suspiciousSwaps.map((swap) => (
                    <div key={swap.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">Swap ID: {swap.swap_id}</h3>
                        <div className="text-sm text-muted-foreground">
                          Flagged At: {new Date(swap.flagged_at).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Reviewed: {swap.reviewed ? "Yes" : "No"} • Score: {swap.score || "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
