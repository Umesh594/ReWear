from users.models import Item, SwapRequest
from django.contrib.auth.models import User
from django.db.models import Count, Avg
from django.db import connection

def total_items_raw():
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM users_item;")
        row = cursor.fetchone()
    return row[0]

def total_users_raw():
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM auth_user;")
        row = cursor.fetchone()
    return row[0]

def active_swaps():
    return SwapRequest.objects.filter(status="pending").count()

def completed_swaps():
    return SwapRequest.objects.filter(status="accepted").count()

def average_item_rating():
    return Item.objects.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0

def most_popular_category(top_n=5):
    return (
        Item.objects
        .values('category')
        .annotate(count=Count('id'))
        .order_by('-count')[:top_n]
    )
