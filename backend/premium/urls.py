from django.urls import path
from . import views

urlpatterns = [
    # subscriptions
    path('subscriptions/create/', views.CreateSubscriptionView.as_view(), name='create_subscription'),
    path('subscriptions/active/', views.GetSubscriptionView.as_view(), name='get_subscription'),
    path('subscriptions/<int:pk>/update/', views.UpdateSubscriptionView.as_view(), name='update_subscription'),
    path('subscriptions/<int:pk>/delete/', views.DeleteSubscriptionView.as_view(), name='delete_subscription'),

    # features
    path('features/create/', views.CreatePremiumFeatureView.as_view(), name='create_premium_feature'),
    path('features/', views.GetPremiumFeaturesView.as_view(), name='get_premium_features'),
    path('features/<int:pk>/update/', views.UpdatePremiumFeatureView.as_view(), name='update_premium_feature'),
    path('features/<int:pk>/delete/', views.DeletePremiumFeatureView.as_view(), name='delete_premium_feature'),
]