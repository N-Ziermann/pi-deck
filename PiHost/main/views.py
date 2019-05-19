from django.shortcuts import render
from django.http import HttpResponse
from .models import Button

# Create your views here.
def homepage(request):
	return render(request=request,
				  template_name="main/index.html",
				  context={"buttons": Button.objects.all})
