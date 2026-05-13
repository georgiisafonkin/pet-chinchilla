from django.urls import path
from .views import BreederListView, BreederMeView

urlpatterns = [
    path('breeders/', BreederListView.as_view(), name='breeder_list'),
    path('breeders/me/', BreederMeView.as_view(), name='breeder_me'),
]