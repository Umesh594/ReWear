from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from . import queries

@api_view(['GET'])
@permission_classes([IsAdminUser])
def analytics_summary(request):
    data = {
        "total_users": queries.total_users_raw(),
        "total_items": queries.total_items_raw(),
        "active_swaps": queries.active_swaps(),
        "completed_swaps": queries.completed_swaps(),  # fixed
        "average_item_rating": queries.average_item_rating(),
        "top_categories": list(queries.most_popular_category())
    }
    return Response(data)
