import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, MenuItem, Chip, Grid } from '@mui/material';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';

const AddItem = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const validationSchema = Yup.object({
    title: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    category: Yup.string().required('Required'),
    size: Yup.string().required('Required'),
    condition: Yup.string().required('Required'),
    tags: Yup.string(),
    pointsValue: Yup.number().min(10, 'Minimum 10 points').required('Required'),
  });

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category', values.category);
      formData.append('size', values.size);
      formData.append('condition', values.condition);
      formData.append('tags', values.tags);
      formData.append('pointsValue', values.pointsValue);
      
      images.forEach((image) => {
        formData.append('images', image);
      });

      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/items', formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/items/${res.data._id}`);
    } catch (error) {
      setError('Failed to add item. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Item
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Formik
          initialValues={{
            title: '',
            description: '',
            category: '',
            size: '',
            condition: '',
            tags: '',
            pointsValue: 50,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Category"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.category && Boolean(errors.category)}
                    helperText={touched.category && errors.category}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Size"
                    name="size"
                    value={values.size}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.size && Boolean(errors.size)}
                    helperText={touched.size && errors.size}
                  >
                    {sizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Condition"
                    name="condition"
                    value={values.condition}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.condition && Boolean(errors.condition)}
                    helperText={touched.condition && errors.condition}
                  >
                    {conditions.map((condition) => (
                      <MenuItem key={condition} value={condition}>
                        {condition}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Points Value"
                    name="pointsValue"
                    type="number"
                    value={values.pointsValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.pointsValue && Boolean(errors.pointsValue)}
                    helperText={touched.pointsValue && errors.pointsValue}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tags (comma separated)"
                    name="tags"
                    value={values.tags}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.tags && Boolean(errors.tags)}
                    helperText={touched.tags && errors.tags}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" component="label" sx={{ mr: 2 }}>
                    Upload Images
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {images.map((image, index) => (
                    <Chip
                      key={index}
                      label={image.name}
                      onDelete={() => {
                        const newImages = [...images];
                        newImages.splice(index, 1);
                        setImages(newImages);
                      }}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    sx={{ mt: 2 }}
                  >
                    List Item
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default AddItem;