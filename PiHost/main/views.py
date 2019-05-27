from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Button
from django.core.files.storage import FileSystemStorage

# Create your views here.
def homepage(request):
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
		# override the selected buttons command
		if b != "" and cmd != "" and cmdText != "":
			instance = get_object_or_404(Button, id=int(b))
			instance.command = cmd + " " + cmdText
			instance.img = img
			instance.save()
		else:
			print("\nincomplete data\n")

	return render(request=request,
				  template_name="main/index.html",
				  context={"buttons": Button.objects.all})
