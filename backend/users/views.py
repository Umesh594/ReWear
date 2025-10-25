from django.contrib.auth.models import User
from rest_framework import generics, permissions
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer
from .models import Item, SwapRequest
from .serializers import ItemSerializer,SwapRequestSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({"message": f"Hello {request.user.username}, this is protected!"})
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid email or password"}, status=401)
        if not user.check_password(password):
            return Response({"detail": "Invalid email or password"}, status=401)
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "isAdmin": user.is_staff
            }
        })
class ItemListView(generics.ListAPIView):
    queryset = Item.objects.all().order_by('-posted')
    serializer_class = ItemSerializer
class MyItemsListView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Item.objects.filter(uploader=self.request.user).order_by('-posted')
class ItemDetailView(generics.RetrieveAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
class SwapRequestCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, item_id):
        item = Item.objects.get(id=item_id)
        swap_request = SwapRequest.objects.create(
            sender=request.user,
            receiver=item.uploader,  
            item=item
        )
        return Response({"message": "Swap request sent", "id": swap_request.id, "receiver_first_name": swap_request.receiver.first_name})
class ItemCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser] 
    def post(self, request, *args, **kwargs):
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(uploader=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class UserSwapRequestsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        sent_swaps = SwapRequest.objects.filter(sender=user)
        received_swaps = SwapRequest.objects.filter(receiver=user)
        all_swaps = sent_swaps | received_swaps
        all_swaps = all_swaps.order_by('-created_at')
        serializer = SwapRequestSerializer(all_swaps, many=True)
        return Response(serializer.data)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_swap_request(request, swap_id):
    try:
        swap = SwapRequest.objects.get(id=swap_id)
        swap.status = "accepted"
        swap.save()
        serializer = SwapRequestSerializer(swap)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except SwapRequest.DoesNotExist:
        return Response({"error": "Swap request not found"}, status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def reject_swap_request(request, swap_id):
    try:
        swap = SwapRequest.objects.get(id=swap_id)
        swap.status = "rejected"
        swap.save()
        serializer = SwapRequestSerializer(swap)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except SwapRequest.DoesNotExist:
        return Response({"error": "Swap request not found"}, status=status.HTTP_404_NOT_FOUND)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def pending_swap_requests(request):
    swaps = SwapRequest.objects.filter(status="pending").order_by('-created_at')
    serializer = SwapRequestSerializer(swaps, many=True)
    return Response(serializer.data)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_total_users(request):
    total_users = User.objects.count()
    return Response({"total_users": total_users})
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_total_items(request):
    total_items = Item.objects.count()
    return Response({"total_items": total_items})
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_active_swaps(request):
    active_swaps = SwapRequest.objects.filter(status="pending").count()
    return Response({"active_swaps": active_swaps})
@api_view(['GET'])
@permission_classes([IsAdminUser])
def completed_swap_requests(request):
    swaps = SwapRequest.objects.filter(status="completed").order_by('-created_at')
    serializer = SwapRequestSerializer(swaps, many=True)
    return Response(serializer.data)