import { Container, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        Welcome to ReWear
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Swap clothes sustainably and save money!
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="https://clipvideo.ai/storage/blog-images/Rz5CJlmijHTPD5D9vOqSwZmzhOeiIIJ2zlH6ACSQ.png"
              alt="Start Swapping"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Start Swapping
              </Typography>
              <Button variant="contained" component={Link} to="/items" fullWidth>
                Start Swapping
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="https://static.vecteezy.com/system/resources/previews/000/474/280/original/vector-product-list-conceptual-illustration-design.jpg"
              alt="List an Item"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                List an Item
              </Typography>
              <Button variant="contained" component={Link} to="/add-item" fullWidth>
                Add Your Item
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image="https://di-uploads-pod5.s3.amazonaws.com/donjohnsonautogroup/uploads/2016/03/Community.jpg"
              alt="Join Community"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Join Community
              </Typography>
              <Button variant="contained" component={Link} to="/register" fullWidth>
                Sign Up Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;