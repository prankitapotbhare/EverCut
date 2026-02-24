# 🚀 EverCut API - Postman Collections Import Guide

## ✅ What's Been Created

I've successfully created **11 modular Postman collections** organized by feature for the EverCut API:

### 📦 Collections Created

1. **01-authentication.json** (4 endpoints)
   - Check After OTP
   - Complete Customer Profile
   - Complete Barber Profile
   - Health Check

2. **02-customer-profile.json** (4 endpoints)
   - Get Profile
   - Update Profile
   - Get Homepage
   - Get Services by Gender

3. **03-customer-bookings.json** (10 endpoints)
   - Get All Bookings
   - Book Salon
   - Get Booking Details
   - Cancel Booking
   - Reschedule Booking
   - Reorder Booking
   - Toggle Favorite
   - Get Booking Confirmation
   - Update Booking
   - Delete Service from Booking
   - Get Employee Calendar

4. **04-customer-shop-discovery.json** (5 endpoints)
   - Get Nearby Shops
   - Get Doorstep Shops
   - Get Shop Info
   - Search Services
   - Search Shops

5. **05-customer-ratings.json** (3 endpoints)
   - Add Rating
   - Get Shop Ratings
   - Get Rating Summary

6. **06-barber-profile-shop.json** (5 endpoints)
   - Get Profile
   - Update Business Info
   - Update PIN
   - Update Cover Image
   - Toggle Shop Status

7. **07-barber-employees.json** (4 endpoints)
   - Get All Employees
   - Add Employee
   - Update Employee
   - Delete Employee

8. **08-barber-services.json** (5 endpoints)
   - Get All Services
   - Add Single Service
   - Add Bundled Service
   - Update Service
   - Delete Service

9. **09-barber-bookings.json** (5 endpoints)
   - Get All Bookings
   - Get Booking Stats
   - Get Bookings by Status
   - Update Booking Status
   - Delete Booking

10. **10-barber-photos.json** (5 endpoints)
    - Get All Photos
    - Upload Photos
    - Get Photo by ID
    - Delete Photo
    - Get Photo Stats

11. **11-barber-earnings.json** (2 endpoints)
    - Get Earnings
    - Remove Rating

**Total: 52 endpoints across 11 collections**

---

## 📥 How to Import into Postman

### Method 1: Import All Collections at Once (Recommended)

1. **Open Postman Desktop App**
2. Click the **Import** button (top left corner)
3. Click **Folder** tab
4. Navigate to and select the `postman-collections` folder
5. Click **Open** or **Select Folder**
6. Postman will show all 11 collections
7. Click **Import**
8. ✅ All collections will appear in your Collections sidebar!

### Method 2: Import Individual Collections

1. **Open Postman**
2. Click **Import** button
3. Click **File** tab
4. Select one or more JSON files (01-authentication.json, 02-customer-profile.json, etc.)
5. Click **Open**
6. Click **Import**

### Method 3: Drag and Drop

1. **Open Postman**
2. Open your file explorer
3. Navigate to `postman-collections` folder
4. Select all JSON files (01-*.json through 11-*.json)
5. Drag and drop them into Postman window
6. Click **Import**

---

## 🎯 Will Collections Appear in Postman App?

### YES! Here's what happens:

1. **Immediate Visibility**
   - Collections appear instantly in the left sidebar under "Collections"
   - Each collection is expandable to show all endpoints
   - Collections are organized alphabetically

2. **Workspace Assignment**
   - Collections are imported into your **currently active workspace**
   - To import into "Quantneural" workspace:
     - Switch to Quantneural workspace FIRST
     - Then import the collections

3. **Sync Across Devices**
   - If you're signed in to Postman, collections sync automatically
   - Available on Desktop, Web, and Mobile apps
   - Changes sync in real-time

4. **Team Sharing**
   - Collections in team workspaces are visible to all team members
   - You can share individual collections via link
   - Team members can fork collections for their own use

---

## ⚙️ Post-Import Configuration

### Step 1: Set Collection Variables

After importing, configure these variables in EACH collection (or set once if you prefer):

```
base_url: http://localhost:5000
api_prefix: /api/v1
firebase_token: YOUR_FIREBASE_ID_TOKEN_HERE
```

**How to set variables:**
1. Click on a collection name
2. Go to **Variables** tab
3. Update **Current Value** column
4. Click **Save**

### Step 2: Get Firebase Token

You need a Firebase ID token to test authenticated endpoints:

```javascript
// In your mobile/web app
firebase.auth().signInWithPhoneNumber(phoneNumber)
  .then(confirmationResult => confirmationResult.confirm(otpCode))
  .then(result => result.user.getIdToken())
  .then(idToken => {
    console.log('Token:', idToken);
    // Copy this token to Postman
  });
```

### Step 3: Test Authentication

1. Open **01-authentication** collection
2. Run **Check After OTP** request
3. If new user, run **Complete Customer Profile** or **Complete Barber Profile**
4. Now you can test other collections!

---

## 🧪 Testing the Collections

### Quick Test Workflow

**For Customer Testing:**
```
01-Authentication → Check After OTP
                 → Complete Customer Profile
02-Customer Profile → Get Profile
04-Shop Discovery → Get Nearby Shops
03-Bookings → Book Salon
05-Ratings → Add Rating
```

**For Barber Testing:**
```
01-Authentication → Check After OTP
                 → Complete Barber Profile
06-Barber Profile → Get Profile
07-Employees → Add Employee
08-Services → Add Single Service
10-Photos → Upload Photos
09-Bookings → Get All Bookings
11-Earnings → Get Earnings
```

---

## 🔍 Verifying Import Success

### Check 1: Collections Sidebar

You should see all 11 collections:
- ✅ EverCut - Authentication
- ✅ EverCut - Customer Profile
- ✅ EverCut - Customer Bookings
- ✅ EverCut - Customer Shop Discovery
- ✅ EverCut - Customer Ratings
- ✅ EverCut - Barber Profile & Shop
- ✅ EverCut - Barber Employees
- ✅ EverCut - Barber Services
- ✅ EverCut - Barber Bookings
- ✅ EverCut - Barber Photos
- ✅ EverCut - Barber Earnings & Analytics

### Check 2: Expand Collections

Click on each collection to see:
- ✅ All endpoints listed
- ✅ Request methods (GET, POST, PUT, DELETE)
- ✅ Descriptions visible

### Check 3: Variables Tab

Click on a collection → Variables tab:
- ✅ base_url variable exists
- ✅ api_prefix variable exists
- ✅ firebase_token variable exists
- ✅ Collection-specific variables (booking_id, shop_id, etc.)

### Check 4: Authorization Tab

Click on a collection → Authorization tab:
- ✅ Type: Bearer Token
- ✅ Token: {{firebase_token}}

---

## 🎨 Collection Features

### Auto-Save Variables

Collections include test scripts that automatically save IDs:
- After creating a booking → `booking_id` is saved
- After getting shop info → `shop_id` is saved
- After adding employee → `employee_id` is saved
- After adding service → `service_id` is saved
- After uploading photos → `photo_id` is saved

### Request Descriptions

Every request includes:
- Detailed description
- Required/optional fields
- Business rules
- Example responses
- Error scenarios

### Pre-filled Examples

All requests have:
- Sample request bodies
- Example query parameters
- Placeholder values
- Proper formatting (JSON, form-data)

---

## 📱 Using Collections in Different Postman Apps

### Desktop App (Windows/Mac/Linux)
- ✅ Full feature support
- ✅ Best for development and testing
- ✅ Offline access
- ✅ File uploads work perfectly

### Web App (Browser)
- ✅ Access from anywhere
- ✅ Real-time sync
- ✅ Limited file upload support
- ⚠️ Requires internet connection

### Mobile App (iOS/Android)
- ✅ View collections
- ✅ Run simple requests
- ⚠️ Limited editing capabilities
- ⚠️ No file uploads

**Recommendation:** Use Desktop App for full testing capabilities.

---

## 🔄 Updating Collections

If collections are updated in the future:

1. **Re-import Method:**
   - Delete old collections in Postman
   - Import new JSON files
   - Reconfigure variables

2. **Manual Update Method:**
   - Edit requests directly in Postman
   - Add/remove endpoints as needed
   - Export updated collections

3. **Version Control:**
   - Keep JSON files in Git
   - Track changes over time
   - Share updates with team

---

## 🐛 Troubleshooting Import Issues

### Issue: "Import failed" or "Invalid format"
**Solution:** 
- Ensure you're importing JSON files (not .md or .txt)
- Check file isn't corrupted
- Try importing one collection at a time

### Issue: Collections not appearing
**Solution:**
- Check you're in the correct workspace
- Refresh Postman (Ctrl+R or Cmd+R)
- Sign out and sign back in

### Issue: Variables not working
**Solution:**
- Ensure variables are set in **Current Value** column
- Click **Save** after setting variables
- Check variable names match exactly (case-sensitive)

### Issue: "No token provided" errors
**Solution:**
- Set `firebase_token` variable in collection
- Ensure token is valid (not expired)
- Check Authorization tab is set to "Inherit from parent"

---

## 📊 Collection Statistics

```
Total Collections: 11
Total Endpoints: 52
Total File Size: ~150KB
Format: Postman Collection v2.1.0
Schema: https://schema.getpostman.com/json/collection/v2.1.0/collection.json

Breakdown:
- Authentication: 4 endpoints
- Customer Features: 22 endpoints
- Barber Features: 26 endpoints
```

---

## 🎓 Next Steps After Import

1. ✅ Import all collections
2. ✅ Configure collection variables
3. ✅ Get Firebase token
4. ✅ Test authentication endpoints
5. ✅ Test customer workflow
6. ✅ Test barber workflow
7. ✅ Share with team

---

## 📚 Additional Resources

- **README.md** - Comprehensive documentation
- **POSTMAN_COLLECTION_README.md** - Detailed API reference
- **collection-metadata.json** - Collection metadata
- **../docs/** - API architecture documentation

---

## ✅ Success Checklist

After import, verify:

- [ ] All 11 collections visible in sidebar
- [ ] Can expand each collection to see endpoints
- [ ] Variables tab shows all required variables
- [ ] Authorization tab shows Bearer Token setup
- [ ] Can run Health Check endpoint successfully
- [ ] Can run Check After OTP endpoint
- [ ] Request descriptions are visible
- [ ] Sample request bodies are populated

---

## 🎉 You're All Set!

Your Postman collections are ready to use. Start testing the EverCut API!

**Questions?** Check the README.md file for detailed documentation.

**Issues?** Review the troubleshooting section above.

**Happy Testing! 🚀**
