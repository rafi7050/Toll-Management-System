from django.shortcuts import render,redirect
from core.forms import Car_Admission_from
from core.models import Car_Admission
from django.db.models import Count, Q
from django.contrib.auth.forms import UserCreationForm
from .forms import CreateUserForm
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout


def index(request):
    return render(request,'index.html')



def car_admission(request):
    form = Car_Admission_from(request.POST , request.FILES)
    data = Car_Admission.objects.all()
    if form.is_valid():
        form = form.save(commit=False)
        form.save()
        context = {'form' : form , 'data': data}
        return render(request,'car_admission_data.html', context)
    context = {'form' : form , 'data': data}

    return render(request,'car_admission_data.html', context)


def car_list(request):

    data= Car_Admission.objects.all()
    context={'data' : data}
    return render(request, 'car_list.html',context)

def car_details(request, id):

    data = Car_Admission.objects.get(id = id)
    context = {'data' : data}
    return render(request, 'car_details.html', context)



def search(request):
    queryset = Car_Admission.objects.all()
    query = request.GET.get('q')
    if query:
        queryset = queryset.filter(
            Q(date_now__icontains=query)      
        ).distinct()
    context = {
        'queryset': queryset
    }
    return render(request, 'search_results.html', context)



def register(request):
    form = CreateUserForm()

    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            user = form.cleaned_data.get('username')
            messages.success(request, 'Account was created for ' + user)


            return redirect('core:login')

    context = {'form':form}
    return render(request, 'register.html', context)
def login_page(request):

	if request.user.is_authenticated:
		return redirect('core:index')
	else:
		if request.method == 'POST':
			username = request.POST.get('username')
			password =request.POST.get('password')

			user = authenticate(request, username=username, password=password)

			if user is not None:
				login(request, user)
				return redirect('core:index')
			else:
				messages.info(request, 'Username OR password is incorrect')
	

		context = {}
		return render(request, 'login.html', context)

def logoutUser(request):
	logout(request)
	return redirect('core:login')