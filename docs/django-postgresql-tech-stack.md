# Django + PostgreSQL Tech Stack

## Project Structure
```
salon-booking/
├── backend/                    # Django Backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── salon_project/          # Main Django project
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── accounts/               # User authentication app
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── salons/                 # Salon management app
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── bookings/               # Booking management app
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── payments/               # Payment processing app
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   └── utils/                  # Utility functions
│       ├── __init__.py
│       ├── firebase_auth.py
│       └── email_service.py
├── frontend/                   # React Frontend (Already implemented)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       ├── App.jsx
│       └── main.jsx
├── docker-compose.yml
└── README.md
```

## Key Files Configuration

### `backend/requirements.txt`
```
Django==4.2.9
djangorestframework==3.14.0
psycopg2-binary==2.9.7
firebase-admin==6.2.0
django-cors-headers==4.3.0
Pillow==10.0.1
python-dotenv==1.0.0
dj-rest-auth==4.0.1
stripe==7.0.0
django-filter==23.5
gunicorn==21.2.0
whitenoise==6.5.0
```

### `backend/salon_project/settings.py` (Key Sections)
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'accounts',
    'salons',
    'bookings',
    'payments',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'salon_db'),
        'USER': os.environ.get('DB_USER', 'postgres'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'accounts.authentication.FirebaseAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}

# Firebase configuration
FIREBASE_CONFIG = {
    'apiKey': os.environ.get('FIREBASE_API_KEY'),
    'authDomain': os.environ.get('FIREBASE_AUTH_DOMAIN'),
    'projectId': os.environ.get('FIREBASE_PROJECT_ID'),
    'storageBucket': os.environ.get('FIREBASE_STORAGE_BUCKET'),
    'messagingSenderId': os.environ.get('FIREBASE_MESSAGING_SENDER_ID'),
    'appId': os.environ.get('FIREBASE_APP_ID'),
}

# Stripe configuration
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY')
```

### `backend/utils/firebase_auth.py`
```python
import firebase_admin
from firebase_admin import credentials, auth
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from accounts.models import UserProfile

cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_KEY)
firebase_admin.initialize_app(cred)

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None
            
        id_token = auth_header.split(' ').pop()
        try:
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            
            try:
                user_profile = UserProfile.objects.get(firebase_uid=uid)
                return (user_profile.user, None)
            except UserProfile.DoesNotExist:
                # Create new user if not exists
                user = User.objects.create(
                    username=uid,
                    email=decoded_token.get('email', ''),
                    first_name=decoded_token.get('name', '').split(' ')[0],
                    last_name=' '.join(decoded_token.get('name', '').split(' ')[1:]) if len(decoded_token.get('name', '').split(' ')) > 1 else '',
                )
                user_profile = UserProfile.objects.create(
                    user=user,
                    firebase_uid=uid,
                )
                return (user, None)
        except Exception as e:
            raise AuthenticationFailed(f'Invalid authentication token: {str(e)}')
```

### `backend/salons/models.py`
```python
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.search import SearchVectorField, SearchVector

class Salon(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    opening_hours = models.JSONField(default=dict)
    images = ArrayField(models.URLField(), blank=True, default=list)
    search_vector = SearchVectorField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update search vector
        Salon.objects.filter(pk=self.pk).update(
            search_vector=SearchVector('name', 'description', 'address', 'city', 'state')
        )

    def __str__(self):
        return self.name

class Service(models.Model):
    salon = models.ForeignKey(Salon, related_name='services', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField(help_text="Duration in minutes")
    category = models.CharField(max_length=100)
    image = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.salon.name}"
```

### `backend/bookings/models.py`
```python
from django.db import models
from django.contrib.auth.models import User
from salons.models import Salon, Service

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    
    user = models.ForeignKey(User, related_name='bookings', on_delete=models.CASCADE)
    salon = models.ForeignKey(Salon, related_name='bookings', on_delete=models.CASCADE)
    services = models.ManyToManyField(Service, related_name='bookings')
    booking_date = models.DateField()
    booking_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_duration = models.IntegerField(help_text="Total duration in minutes")
    notes = models.TextField(blank=True, null=True)
    booking_reference = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking #{self.booking_reference} - {self.salon.name}"
```

### `backend/payments/models.py`
```python
from django.db import models
from django.contrib.auth.models import User
from bookings.models import Booking

class Payment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )
    
    booking = models.OneToOneField(Booking, related_name='payment', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='payments', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=50)
    stripe_payment_id = models.CharField(max_length=100, blank=True, null=True)
    transaction_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment #{self.transaction_id} - {self.booking.booking_reference}"
```

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    env_file:
      - ./.env
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_DB=${DB_NAME}
    ports:
      - "5432:5432"

  django:
    build: ./backend
    command: gunicorn salon_project.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
    env_file:
      - ./.env

  frontend:
    build: ./frontend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    command: npm run dev

volumes:
  postgres_data:
```

## Firebase Integration

### `backend/accounts/models.py`
```python
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    firebase_uid = models.CharField(max_length=128, unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username
```

## Frontend Integration

### `frontend/src/services/api.js`
```javascript
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to inject the auth token
api.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const salonsApi = {
  getAll: (params) => api.get('/salons/', { params }),
  getOne: (id) => api.get(`/salons/${id}/`),
  search: (query) => api.get(`/salons/search/?q=${query}`),
};

export const bookingsApi = {
  create: (data) => api.post('/bookings/', data),
  getMyBookings: () => api.get('/bookings/my-bookings/'),
  getOne: (id) => api.get(`/bookings/${id}/`),
  cancel: (id) => api.patch(`/bookings/${id}/cancel/`),
};

export const paymentsApi = {
  createPaymentIntent: (bookingId) => api.post('/payments/create-payment-intent/', { booking_id: bookingId }),
  confirmPayment: (paymentId, paymentMethodId) => api.post('/payments/confirm/', { payment_id: paymentId, payment_method_id: paymentMethodId }),
  getPaymentStatus: (paymentId) => api.get(`/payments/${paymentId}/status/`),
};

export default api;
```

### `frontend/src/services/firebase.js`
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };

export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const logout = () => {
  return signOut(auth);
};
```

### `.env` (Root project environment variables)
```
# Database
DB_NAME=salon_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=db
DB_PORT=5432

# Django
DJANGO_SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Firebase
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
FIREBASE_PROJECT_ID=your-app
FIREBASE_STORAGE_BUCKET=your-app.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_email_password
EMAIL_USE_TLS=True
```

## Key API Endpoints

### Salon Endpoints
- `GET /api/salons/` - List all salons (with filtering and pagination)
- `GET /api/salons/{id}/` - Get salon details
- `GET /api/salons/search/?q={query}` - Search salons
- `GET /api/salons/{id}/services/` - List services for a salon

### Booking Endpoints
- `POST /api/bookings/` - Create a new booking
- `GET /api/bookings/my-bookings/` - List user's bookings
- `GET /api/bookings/{id}/` - Get booking details
- `PATCH /api/bookings/{id}/cancel/` - Cancel a booking

### Payment Endpoints
- `POST /api/payments/create-payment-intent/` - Create payment intent
- `POST /api/payments/confirm/` - Confirm payment
- `GET /api/payments/{id}/status/` - Get payment status