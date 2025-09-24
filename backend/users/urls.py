from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, ProtectedView, LoginView, ItemListView, ItemDetailView, SwapRequestCreateView, ItemCreateView, MyItemsListView, UserSwapRequestsView, approve_swap_request, reject_swap_request, pending_swap_requests, admin_total_users, admin_total_items, admin_active_swaps, completed_swap_requests
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('login/', LoginView.as_view(), name='login'), 
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('protected/', ProtectedView.as_view(), name='protected'),
    path('items/', ItemListView.as_view(), name='item-list'),
    path('items/<int:pk>/', ItemDetailView.as_view(), name='item-detail'),
    path('items/<int:item_id>/swap/', SwapRequestCreateView.as_view(), name='swap-request'),
    path('items/add/', ItemCreateView.as_view(), name='item-add'),
    path('items/my/', MyItemsListView.as_view(), name='my-items'),
    path('swap/', UserSwapRequestsView.as_view(), name='user-swap-requests'),
    path('admin/swaps/pending/', pending_swap_requests, name='pending-swap-requests'),
    path('admin/swaps/<int:swap_id>/approve/', approve_swap_request, name='approve-swap-request'),
    path('admin/swaps/<int:swap_id>/reject/', reject_swap_request, name='reject-swap-request'),
    path('admin/users/', admin_total_users, name='admin-users'),
    path('admin/items/', admin_total_items, name='admin-items'),
    path('admin/swaps/active/', admin_active_swaps, name='admin-active-swaps'),
    path('admin/swaps/completed/', completed_swap_requests, name='completed-swap-requests'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)