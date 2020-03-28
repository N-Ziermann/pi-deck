from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Button
from django.core.files.storage import FileSystemStorage
import os

# Create your views here.
def homepage(request):
	file_dir = os.path.dirname(os.path.abspath(__file__)) + "/"
	if request.method == "POST":
		# get data from webpage
		b = request.POST["buttonID"]
		cmd = request.POST["cmd"]
		cmdText = request.POST["cmdText"]
		#load the optional image upload
		try:
			img = request.FILES["img"]
		except Exception as e:
			img = None

		if b != "" and cmd != "" and cmdText != "":
			instance = get_object_or_404(Button, id=int(b))
			# remove the old image:
			if instance.img != "":
				oldImg = instance.img.url
				print("*"*50)
				print(oldImg)
				print("*"*50)
				os.remove(file_dir + oldImg)
			# override the selected buttons command
			instance.command = cmd + " " + cmdText
			instance.img = img
			instance.save()
		else:
			print("\nincomplete data\n")

	return render(request=request,
				  template_name="main/index.html",
				  context={"buttons": Button.objects.all})
