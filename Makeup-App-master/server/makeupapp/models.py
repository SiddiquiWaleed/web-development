from django.db import models

# Create your models here.

class User(models.Model):
	name = models.CharField(max_length = 200)
	email = models.CharField(max_length = 200)
	password = models.CharField(max_length = 200)

	def __str__(self):
		return self.email

class Product(models.Model):
	name = models.CharField(max_length = 200)
	img = models.TextField()
	description = models.TextField()
	price = models.FloatField()
	usage = models.TextField()
	category = models.CharField(max_length = 200)

	def __str__(self):
		return self.name

class Cart(models.Model):
	user = models.OneToOneField(
		User,
		on_delete = models.CASCADE
	)
	product = models.ManyToManyField(Product)

	

