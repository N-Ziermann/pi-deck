from django.db import models
'''
# Create your models here.
class Gui(models.Model):
	command = models.CharField(max_length=200)
	content = models.TextField()

	def __str__(self):
		return self.command
'''
class Button(models.Model):
	command = models.CharField(max_length=300)
	img = models.ImageField(upload_to='imgs', blank=True)
	def __str__(self):
		return self.command