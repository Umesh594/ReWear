from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from asgiref.sync import sync_to_async
from users.models import Item, Tag
from users.serializers import ItemSerializer
from .fraud_detection import detect_anomalous_swaps
from .models import FraudReport
from .serializers import FraudReportSerializer
from .recommendation import get_recommendations
from .image_recognition import detect_item_tags
from .genai_langchain import generate_item_description
from .nlp_search import parse_query
@api_view(['GET'])
@permission_classes([IsAuthenticated])
async def recommend_items(request):
    user_id = request.user.id
    item_ids = await sync_to_async(get_recommendations)(user_id)
    items = await sync_to_async(lambda: Item.objects.filter(id__in=item_ids))()
    serializer = ItemSerializer(items, many=True, context={'request': request})
    return Response(serializer.data)
@api_view(['POST'])
async def detect_tags(request):
    image_url = request.data.get("image_url")
    if not image_url:
        return Response({"error": "image_url is required"}, status=400)
    tags = await sync_to_async(detect_item_tags)(image_url)
    return Response(tags)
@api_view(['GET'])
def smart_search(request):
    query = request.GET.get("q", "")
    parsed = parse_query(query)
    items = Item.objects.all()
    if "category" in parsed:
        items = items.filter(category__icontains=parsed["category"])
    if "color" in parsed:
        items = items.filter(color__icontains=parsed["color"])
    if "price" in parsed:
        if "max" in parsed["price"]:
            items = items.filter(points__lte=parsed["price"]["max"])
        if "min" in parsed["price"]:
            items = items.filter(points__gte=parsed["price"]["min"])
        if "eq" in parsed["price"]:
            items = items.filter(points=parsed["price"]["eq"])
    serializer = ItemSerializer(items, many=True, context={'request': request})
    return Response(serializer.data)
@api_view(['POST'])
def generate_description(request):
    title = request.data.get("title", "").strip()
    if not title:
        return Response({"error": "Title is required"}, status=400)
    result = generate_item_description(title)
    return Response(result)
class ItemCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    async def post(self, request, *args, **kwargs):
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            item = await sync_to_async(serializer.save)(uploader=request.user)
            desc_result = await sync_to_async(generate_item_description)(item.title)
            item.description = desc_result.get('description', '')
            tags_info = await sync_to_async(detect_item_tags)(item.image.url)
            item.color = tags_info.get('color', "")
            style_tag_name = tags_info.get('style', "")
            if style_tag_name:
                tag_obj, _ = await sync_to_async(Tag.objects.get_or_create)(name=style_tag_name)
                await sync_to_async(item.tags.add)(tag_obj)
            await sync_to_async(item.save)()
            serialized_item = ItemSerializer(item, context={'request': request})
            return Response(serialized_item.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def suspicious_swaps(request):
    detect_anomalous_swaps()
    flagged = FraudReport.objects.all().order_by('-flagged_at')
    serializer = FraudReportSerializer(flagged, many=True)
    return Response(serializer.data)