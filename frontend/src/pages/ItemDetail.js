import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Card, CardMedia, Button, TextField, Alert } from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pointsOffered, setPointsOffered] = useState(0);
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/items/${id}`);
        setItem(res.data);
      } catch (error) {
        setError('Failed to fetch item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSwapRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/swaps', {
        requestedItemId: item._id,
        offeredItemId: selectedItem || undefined,
        pointsOffered: pointsOffered || undefined
      }, {
        headers: { 'x-auth-token': token }
      });
      setSuccess('Swap request sent successfully!');
      setTimeout(() => navigate('/swaps'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send swap request');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!item) return <Typography>Item not found</Typography>;

  const isOwner = user && user.id === item.owner._id;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {item.images?.length > 0 && (
            <Card>
              <CardMedia
                component="img"
                height="500"
                image={`http://localhost:5000/${item.images[0]}`}
                alt={item.title}
              />
            </Card>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {item.title}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Owner: {item.owner.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {item.description}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Category:</strong> {item.category}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Size:</strong> {item.size}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Condition:</strong> {item.condition}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Points Value:</strong> {item.pointsValue}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Status:</strong> {item.status}
          </Typography>

          {!isOwner && item.status === 'available' && user && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Request Swap
              </Typography>
              <TextField
                label="Offer Points"
                type="number"
                value={pointsOffered}
                onChange={(e) => setPointsOffered(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" sx={{ mb: 2 }}>
                Or select one of your items to offer in exchange
              </Typography>
              {/* In a real app, you would fetch and display the user's items here */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSwapRequest}
                disabled={!pointsOffered && !selectedItem}
                fullWidth
              >
                Send Swap Request
              </Button>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ItemDetail;