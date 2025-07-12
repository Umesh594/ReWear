import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/items/my-items', {
          headers: { 'x-auth-token': token }
        });
        setItems(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Welcome, {user?.name}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your Points: {user?.points}
      </Typography>
      
      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Your Listed Items
      </Typography>
      <Grid container spacing={4}>
        {items.length > 0 ? (
          items.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card>
                {item.images?.length > 0 && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:5000/${item.images[0]}`}
                    alt={item.title}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {item.status}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/items/${item._id}`}
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ ml: 2 }}>
            You haven't listed any items yet. <Link to="/add-item">Add your first item</Link>
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;