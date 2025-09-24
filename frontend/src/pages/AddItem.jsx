import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import axios from "axios";
const AddItem = ({ setMyItems, setBrowseItems }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    tags: "",
    points: 30,
  });
  const [images, setImages] = useState([]);
  const [aiData, setAiData] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) setUser(JSON.parse(storedUser));
    else navigate("/login");
  }, [navigate]);
  const categories = ["Tops", "Bottoms", "Dresses", "Outerwear", "Footwear", "Accessories"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const conditions = ["Like New", "Excellent", "Good", "Fair"];
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (aiData[activeImageIndex]) {
      const newAiData = [...aiData];
      newAiData[activeImageIndex] = {
        ...newAiData[activeImageIndex],
        [e.target.name]: e.target.value,
      };
      setAiData(newAiData);
    }
  };
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (aiData[activeImageIndex]) {
      const newAiData = [...aiData];
      newAiData[activeImageIndex] = {
        ...newAiData[activeImageIndex],
        [name]: value,
      };
      setAiData(newAiData);
    }
  };
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 5 images.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    const newAiData = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const token = localStorage.getItem("user_token");
      const data = new FormData();
      data.append("image", file);
      try {
        const recRes = await axios.post("http://localhost:8000/api/items/image_recognition/", data, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        const descRes = await axios.post("http://localhost:8000/api/items/generate_description/", {
          type: recRes.data.type,
          category: recRes.data.category,
          style: recRes.data.style,
        }, { headers: { Authorization: `Bearer ${token}` } });
        newAiData.push({
          title: `${recRes.data.style} ${recRes.data.type}`,
          description: descRes.data.description,
          category: recRes.data.category,
          type: recRes.data.type,
          size: "",
          condition: "",
          tags: recRes.data.tags.join(", "),
          points: 30,
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "AI generation failed",
          description: "Could not generate data for one image.",
          variant: "destructive",
        });
        newAiData.push({
          title: "",
          description: "",
          category: "",
          type: "",
          size: "",
          condition: "",
          tags: "",
          points: 30,
        });
      }
    }
    setImages((prev) => [...prev, ...files]);
    setAiData((prev) => [...prev, ...newAiData]);
    setActiveImageIndex(images.length); // focus on first newly uploaded
    setFormData(newAiData[0] || formData); // load first AI-generated data
    setIsLoading(false);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newAiData = aiData.filter((_, i) => i !== index);
    setImages(newImages);
    setAiData(newAiData);
    if (activeImageIndex === index && newAiData.length > 0) {
      setActiveImageIndex(0);
      setFormData(newAiData[0]);
    } else if (newAiData.length === 0) {
      setFormData({
        title: "",
        description: "",
        category: "",
        type: "",
        size: "",
        condition: "",
        tags: "",
        points: 30,
      });
    }
  };

  const selectImage = (index) => {
    setActiveImageIndex(index);
    setFormData(aiData[index]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("user_token");
    if (!token) {
      toast({
        title: "Not authenticated",
        description: "Please login first.",
        variant: "destructive",
      });
      setIsLoading(false);
      navigate("/login");
      return;
    }

    try {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const itemData = aiData[i];

        const data = new FormData();
        data.append("title", itemData.title);
        data.append("description", itemData.description);
        data.append("category", itemData.category);
        data.append("type", itemData.type);
        data.append("size", itemData.size);
        data.append("condition", itemData.condition);
        data.append("points", itemData.points);
        data.append("tags", itemData.tags);
        data.append("rating", 0);
        data.append("image", img);

        const res = await axios.post(
          "http://localhost:8000/api/items/add/",
          data,
          {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          }
        );

        const newItem = res.data;
        if (setMyItems) setMyItems((prev) => [newItem, ...prev]);
        if (setBrowseItems) setBrowseItems((prev) => [newItem, ...prev]);
      }

      toast({ title: "All items listed successfully!" });
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err);
      toast({
        title: "Failed to list items",
        description: err.response?.data?.detail || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">List New Item</CardTitle>
            <p className="text-muted-foreground">Add your clothing item to start swapping</p>
          </CardHeader>

          <CardContent>
            {/* Image previews */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-3 block">Images (Max 5)</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((img, index) => (
                  <div key={index} className={`relative aspect-square ${activeImageIndex === index ? 'ring-2 ring-primary rounded-lg' : ''}`}>
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg cursor-pointer"
                      onClick={() => selectImage(index)}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground text-center">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      multiple
                    />
                  </label>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  name="title"
                  placeholder="e.g., Vintage Denim Jacket"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  name="description"
                  placeholder="Describe your item in detail..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              {/* Category & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Input
                    name="type"
                    placeholder="e.g., T-shirt, Jeans, Sneakers"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Size & Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Size</label>
                  <Select value={formData.size} onValueChange={(value) => handleSelectChange('size', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Condition</label>
                  <Select value={formData.condition} onValueChange={(value) => handleSelectChange('condition', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map(condition => (
                        <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags & Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <Input
                    name="tags"
                    placeholder="vintage, casual, summer (comma separated)"
                    value={formData.tags}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Point Value</label>
                  <Input
                    name="points"
                    type="number"
                    min="10"
                    max="100"
                    value={formData.points}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gradient-primary" size="lg" disabled={isLoading}>
                {isLoading ? "Listing Item..." : "List Item"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddItem;
