from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.core import serializers
from django.conf import settings
from django.core.mail import BadHeaderError, send_mail
from django.views.decorators.csrf import csrf_exempt
from .models import User
from .models import Product
from .models import Cart
import json

@csrf_exempt 
def index(request):
	return HttpResponse('Server Running')

@csrf_exempt 
def check_login(request):
	if request.method == 'POST':		
		json_data = json.loads(request.body)
		email = json_data['email']
		password = json_data['password']
		print('Received: \nEmail = {} && Password = {}'.format(email, password))
		query_result = User.objects.filter(email__contains = email, password__contains = password)
		result_serialized = serializers.serialize('json', query_result)
		if not query_result:
			print(query_result)
		else:
			print(query_result)
		return JsonResponse(result_serialized, safe = False)

@csrf_exempt
def signup(request):
	if request.method == 'POST':
		json_data = json.loads(request.body)
		name = json_data['name']
		email = json_data['email']
		password = json_data['password']
		print('Received: \nName = {} && Email = {} && Password = {}'.format(name, email, password))
		query_result = User.objects.filter(email__contains = email)
		if not query_result:
			user = User(name = name, email = email, password = password)
			user.save()
			user.id
			user_serialized = serializers.serialize('json', user)
			print('User added')
			return JsonResponse(user_serialized, safe=False)
		else:
			print('User already exists')
			result_serialized = serializers.serialize('json', query_result)
			return JsonResponse(result_serialized, safe = False)

@csrf_exempt
def fetch_products(request):
	if request.method == 'POST':
		json_data = json.loads(request.body)
		category = json_data['category']
		print('Received: \nCategory = {}'.format(category))
		query_result = Product.objects.filter(category__contains = category)
		result_serialized = serializers.serialize('json', query_result)
		if not query_result:
			print(query_result)
		else:
			print(query_result)
		return JsonResponse(result_serialized, safe = False)

@csrf_exempt
def add_product_to_cart(request):
	if request.method == 'POST':
		json_data = json.loads(request.body)
		productID = json_data['productID']
		userID = json_data['userID']
		quantity = json_data['quantity']
		print('Received: \nUser ID = {} \nProduct ID = {} \nQuantity = {}'.format(userID, productID, quantity))
		productResult = Product.objects.get(pk = productID)
		userResult = User.objects.get(pk = userID)		
		print(productResult)
		print(userResult)
		try:
			cartInstance = Cart.objects.create(user = userResult)
			cartInstance.product.add(productResult)
		except:
			cartResult = Cart.objects.get(user = userResult)
			cartResult.product.add(productResult)
		return HttpResponse('')

@csrf_exempt
def get_cart(request):
	if request.method == 'POST':
		json_data = json.loads(request.body)
		userID = json_data['userID']
		print('Received: \nUser ID = {}'.format(userID))
		userResult = User.objects.get(pk = userID)
		cartResult = Cart.objects.filter(user = userResult)
		result_serialized = serializers.serialize('json', cartResult)
		return JsonResponse(result_serialized, safe = False)

@csrf_exempt
def get_cart_products(request):
	if request.method == 'POST':
		json_data = json.loads(request.body)
		cartProductsList = json_data['cartProductsList']
		resultList = []
		for productID in cartProductsList:						
			query_result = Product.objects.filter(pk = productID)
			result_serialized = serializers.serialize('json', query_result)
			resultList.append(result_serialized)		
		return JsonResponse(resultList, safe = False)

@csrf_exempt
def send_email(request):
	if request.method == 'POST':
		print('Send mail request by client')
		json_data = json.loads(request.body)
		to = json_data['to']
		subject = json_data['subject']
		msg = json_data['msg']
		from_email = 'shakeelusama3@gmail.com'
		print('Received: \nto = {} \nsubject = {} \nmsg = {}'.format(to, subject, msg))
		if subject and msg and from_email:
			try:
				send_mail(subject, msg, from_email, [to])
				print('Mail sent')
				return HttpResponse('Success')
			except BadHeaderError:
				print('exception')
				return HttpResponse('Exception')
		else:
			return HttpResponse('Make sure all fields are entered and valid.')
		return HttpResponse('Success')

@csrf_exempt
def clear_cart(request):
	if request.method == 'POST':
		print('Clear cart request')
		json_data = json.loads(request.body)
		userID = json_data['userID']
		userResult = User.objects.get(pk = userID)
		cartResult = Cart.objects.filter(user = userResult).delete()
		return HttpResponse('Success')

@csrf_exempt
def remove_product_from_cart(request):
	if request.method == 'POST':
		print('Remove product from cart request')
		json_data = json.loads(request.body)
		productID = json_data['productID']
		userID = json_data['userID']
		userResult = User.objects.get(pk = userID)
		productResult = Product.objects.get(pk = productID)
		cartResult = Cart.objects.get(product = productResult, user = userResult)
		cartResult.delete()
		return HttpResponse('Success')



