import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/items');
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Browse Items
      </Typography>
      <Grid container spacing={4}>
        {items.map(item => (
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
                  Owner: {item.owner?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Points: {item.pointsValue}
                </Typography>
                <Button
                  component={Link}
                  to={`/items/${item._id}`}
                  variant="contained"
                  size="small"
                  sx={{ mt: 2 }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Items;