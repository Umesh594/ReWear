from django.urls import path
from . import views

urlpatterns = [
    path("recommend/", views.recommend_items, name="recommend-items"),
    path("detect-tags/", views.detect_tags, name="detect-tags"),
    path("smart-search/", views.smart_search, name="smart-search"),
    path("gen-description/", views.generate_description, name="gen-description"),
    path('create-item/', views.ItemCreateView.as_view(), name='create_item'),
    path('suspicious-swaps/', views.suspicious_swaps, name='suspicious-swaps'),
]
