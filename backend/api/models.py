from django.db import models

# Create your models here.
from django.db import models

class Item(models.Model):
    name = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
