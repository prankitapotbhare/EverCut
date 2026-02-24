# 🚀 EverCut API - Quick Reference Card

## 📥 Import Collections

```
Postman → Import → Folder → Select "postman-collections" → Import
```

## ⚙️ Configure Variables

```
base_url: http://localhost:5000
api_prefix: /api/v1
firebase_token: YOUR_TOKEN_HERE
```

## 🔑 Get Firebase Token

```javascript
firebase.auth().signInWithPhoneNumber(phone)
  .then(result => result.confirm(otp))
  .then(user => user.getIdToken())
  .then(token => console.log(token));
```

## 📋 Collections List

| # | Name | Endpoints |
|---|------|-----------|
| 01 | Authentication | 4 |
| 02 | Customer Profile | 4 |
| 03 | Customer Bookings | 10 |
| 04 | Customer Shop Discovery | 5 |
| 05 | Customer Ratings | 3 |
| 06 | Barber Profile & Shop | 5 |
| 07 | Barber Employees | 4 |
| 08 | Barber Services | 5 |
| 09 | Barber Bookings | 5 |
| 10 | Barber Photos | 5 |
| 11 | Barber Earnings | 2 |

**Total: 52 endpoints**

## 🧪 Quick Test Flow

### Customer
```
01 → Check After OTP
01 → Complete Customer Profile
02 → Get Profile
04 → Get Nearby Shops
03 → Book Salon
05 → Add Rating
```

### Barber
```
01 → Check After OTP
01 → Complete Barber Profile
06 → Get Profile
07 → Add Employee
08 → Add Service
10 → Upload Photos
09 → Get Bookings
11 → Get Earnings
```

## 🔗 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
```
POST   /auth/check-after-otp
POST   /auth/complete-profile/customer
POST   /auth/complete-profile/barber
GET    /health
```

### Customer
```
GET    /customer/profile
PUT    /customer/profile
GET    /customer/homepage
GET    /customer/bookings
POST   /customer/bookings
GET    /customer/shops/nearby
GET    /customer/shops/:id
POST   /customer/ratings
```

### Barber
```
GET    /barber/profile
PUT    /barber/profile
GET    /barber/employees
POST   /barber/employees
GET    /barber/services
POST   /barber/services
GET    /barber/bookings
GET    /barber/photos
POST   /barber/photos
GET    /barber/earnings
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| No token provided | Set `firebase_token` variable |
| Invalid token | Get new token (expires in 1 hour) |
| Access denied | Check role (CUSTOMER vs BARBER) |
| Shop closed | Toggle shop status |
| Can't book past | Use future dates |
| Employee unavailable | Check employee calendar |

## 📚 Documentation

- **README.md** - Main documentation
- **IMPORT_GUIDE.md** - Import instructions
- **POSTMAN_COLLECTION_README.md** - API reference
- **SUMMARY.md** - Complete overview

## ✅ Success Checklist

- [ ] Collections imported
- [ ] Variables configured
- [ ] Firebase token set
- [ ] Health check works
- [ ] Authentication works
- [ ] Customer flow tested
- [ ] Barber flow tested

## 🎯 Key Features

✅ 11 modular collections  
✅ 52 total endpoints  
✅ Auto-save variables  
✅ Detailed descriptions  
✅ Sample data included  
✅ Bearer token auth  
✅ Production-ready  

## 📞 Need Help?

Check the documentation files in this folder:
- README.md
- IMPORT_GUIDE.md
- POSTMAN_COLLECTION_README.md

---

**Version:** 1.0.0  
**Last Updated:** 2024-02-23
