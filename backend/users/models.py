from django.db import models
from django.contrib.auth.models import User
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    def __str__(self):
        return self.name
class Item(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    size = models.CharField(max_length=10, default="M")
    condition = models.CharField(max_length=50, default="Like New")
    points = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0) 
    rating = models.FloatField(default=0)
    views = models.IntegerField(default=0)
    image = models.ImageField(upload_to='uploads/')
    posted = models.CharField(max_length=100, default="1 day ago")
    uploader = models.ForeignKey(User, on_delete=models.CASCADE)
    color = models.CharField(max_length=50, blank=True, null=True)      
    tags = models.ManyToManyField(Tag, blank=True)                    
    image_features = models.JSONField(blank=True, null=True)           
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.title
    
class SwapRequest(models.Model):
    sender = models.ForeignKey(User, related_name="sent_swaps", on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name="received_swaps", on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE) 
    status = models.CharField(
        max_length=20,
        choices=[("pending", "Pending"), ("accepted", "Accepted"), ("rejected", "Rejected")],
        default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.item.title} ({self.status})"