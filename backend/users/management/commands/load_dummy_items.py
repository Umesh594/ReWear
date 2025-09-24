import requests
from django.core.management.base import BaseCommand
from users.models import Item

class Command(BaseCommand):
    help = "Load dummy items from dummyjson.com into the database"

    def handle(self, *args, **kwargs):
        self.stdout.write("Fetching items...")

        # Fetch multiple categories
        categories = [
            "mens-shirts", "mens-shoes", "mens-watches",
            "womens-dresses", "womens-shoes", "womens-watches"
        ]

        Item.objects.all().delete()  # clear old data

        for category in categories:
            response = requests.get(f"https://dummyjson.com/products/category/{category}")
            data = response.json().get("products", [])

            for product in data:
                Item.objects.create(
                    title=product["title"],
                    description=product["description"],
                    category=product["category"],
                    size="M",  # dummy default
                    condition="Like New",
                    points=int(float(product["price"]) / 10),  # example: 1 reward point per 10 currency units
            price=float(product["price"]),    
                    rating=product["rating"],
                    views=product["stock"],  # fake as views
                    image=product["images"][0] if product["images"] else "",
                    posted="1 day ago"
                )

        self.stdout.write(self.style.SUCCESS("Dummy items loaded successfully!"))
