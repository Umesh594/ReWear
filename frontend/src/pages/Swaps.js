import { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Button, Alert } from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

const Swaps = () => {
  const { user } = useContext(AuthContext);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSwaps = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/swaps/my-swaps', {
          headers: { 'x-auth-token': token }
        });
        setSwaps(res.data);
      } catch (error) {
        setError('Failed to fetch swaps');
      } finally {
        setLoading(false);
      }
    };

    fetchSwaps();
  }, []);

  const handleUpdateStatus = async (swapId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/swaps/${swapId}`, { status }, {
        headers: { 'x-auth-token': token }
      });
      setSuccess('Swap status updated');
      setSwaps(swaps.map(swap => 
        swap._id === swapId ? { ...swap, status } : swap
      ));
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update swap status');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Swaps
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Grid container spacing={3}>
        {swaps.length > 0 ? (
          swaps.map(swap => (
            <Grid item xs={12} key={swap._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {swap.status === 'pending' ? 'Pending' : swap.status === 'accepted' ? 'Accepted' : swap.status === 'rejected' ? 'Rejected' : 'Completed'} Swap
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Requested Item:</strong> {swap.requestedItem?.title}
                  </Typography>
                  {swap.offeredItem && (
                    <Typography variant="body1" paragraph>
                      <strong>Offered Item:</strong> {swap.offeredItem?.title}
                    </Typography>
                  )}
                  {swap.pointsOffered > 0 && (
                    <Typography variant="body1" paragraph>
                      <strong>Points Offered:</strong> {swap.pointsOffered}
                    </Typography>
                  )}
                  <Typography variant="body1" paragraph>
                    <strong>Requester:</strong> {swap.requester?.name}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Recipient:</strong> {swap.recipient?.name}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Status:</strong> {swap.status}
                  </Typography>
                  {user.id === swap.recipient._id && swap.status === 'pending' && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ mr: 2 }}
                        onClick={() => handleUpdateStatus(swap._id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleUpdateStatus(swap._id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ ml: 2 }}>
            You don't have any swap requests yet.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default Swaps;