from django.shortcuts import render,redirect

# Create your views here.
from core.forms import Car_Admission_from
from core.models import Car_Admission
from django.db.models import Count, Q


def index(request):
    return render(request,'car_admission_data.html')

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