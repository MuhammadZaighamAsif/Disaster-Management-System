# ResQ Quick Reference

## 🚀 Getting Started

```bash
# Navigate to project
cd frontend/ResQ

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev

# Open browser at
http://localhost:5173
```

## 📁 Where to Add Your Code

| Feature Type | Location |
|-------------|----------|
| Admin Pages | `src/pages/admin/` |
| Volunteer Pages | `src/pages/volunteer/` |
| Donor Pages | `src/pages/donor/` |
| Victim Pages | `src/pages/victim/` |
| Shared Components | `src/components/common/` |
| API Functions | `src/utils/api.js` |
| Validation | `src/utils/validation.js` |

## 🎨 Common Tailwind Classes

```jsx
// Page Container
<div className="min-h-screen bg-gray-50 py-8">
  <div className="container mx-auto px-4">
    {/* Content */}
  </div>
</div>

// Card
<div className="bg-white rounded-lg shadow-md p-6">

// Button Primary
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">

// Input
<input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

// Grid Layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

## 📡 API Calls

```jsx
// GET
const response = await fetch('http://localhost:8080/api/disasters');
const data = await response.json();

// POST
const response = await fetch('http://localhost:8080/api/disasters', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});

// DELETE
const response = await fetch(`http://localhost:8080/api/disasters/${id}`, {
  method: 'DELETE'
});
```

## 🔐 Using Auth Context

```jsx
import { useAuth } from '../../context/AuthContext';

const MyComponent = () => {
  const { user, login, logout } = useAuth();
  
  // Check if logged in
  if (!user) return <div>Please login</div>;
  
  // Access user data
  <p>Welcome {user.name}!</p>
  <p>Role: {user.role}</p>
};
```

## 🧭 Navigation

```jsx
import { Link, useNavigate } from 'react-router-dom';

// Link
<Link to="/admin/dashboard">Dashboard</Link>

// Programmatic navigation
const navigate = useNavigate();
navigate('/admin/dashboard');
navigate(-1); // Go back
```

## ✅ Form Validation

```jsx
import { validateEmail, validateNoSpecialChars } from '../../utils/validation';

const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!validateEmail(email)) {
    setError('Invalid email');
    return;
  }
  
  if (!validateNoSpecialChars(name)) {
    setError('Special characters not allowed');
    return;
  }
  
  // Continue with submission
};
```

## 🎯 Your Use Cases

### Zaigham (23L-3058) ✅
- UC-1: Add Disaster ✅
- UC-2: Remove Disaster ✅
- UC-3: Verify Disaster ✅

### Abdullah (23L-3080)
- UC-4: View Volunteers → `src/pages/admin/ViewVolunteers.jsx`
- UC-5: View Donations → `src/pages/admin/ViewDonations.jsx`
- UC-6: Verify Donor → `src/pages/admin/VerifyDonors.jsx`
- UC-7: Verify Aid Request → `src/pages/admin/VerifyAidRequests.jsx`

### Shuja (23L-3024) ✅
- UC-8: Basic Search ✅
- UC-9: Advanced Search ✅
- UC-10: Login ✅
- UC-11: Report Disaster ✅

### Abu Bakar (23L-3062)
- UC-12: Logout ✅
- UC-13: Sign Up ✅
- UC-14: Choose Role → `src/pages/volunteer/ChooseRole.jsx`
- UC-15: Choose Task → `src/pages/volunteer/ChooseTask.jsx`

### Walija (23L-3055)
- UC-16: View Map → `src/pages/volunteer/ViewMap.jsx`
- UC-17: Update Tasks → `src/pages/volunteer/UpdateTasks.jsx`
- UC-18: Donate Money → `src/pages/donor/DonateMoney.jsx`
- UC-19: Donate Items → `src/pages/donor/DonateItems.jsx`

### Fatima (23L-3099)
- UC-20: Donate Specific → `src/pages/donor/DonateSpecific.jsx`
- UC-21: Offer Shelter → `src/pages/donor/OfferShelter.jsx`
- UC-22: Request Aid → `src/pages/victim/RequestAid.jsx`
- UC-23: Receive Aid → `src/pages/victim/ReceiveAid.jsx`

## 🐛 Common Errors

| Error | Solution |
|-------|----------|
| Module not found | Check import path |
| useState undefined | Add `import { useState } from 'react'` |
| API connection failed | Ensure backend running on port 8080 |
| Style not applying | Check Tailwind class spelling |

## 📚 Documentation Files

- `PROJECT_README.md` - Full project documentation
- `SETUP_SUMMARY.md` - What's been completed
- `COMPONENT_GUIDE.md` - Detailed coding guide
- `QUICK_REFERENCE.md` - This file

## 💡 Tips

1. **Copy existing components** as templates
2. **Test locally** before committing
3. **Use existing utilities** in `src/utils/`
4. **Follow naming conventions**
5. **Add error handling** to all API calls

## 🔗 Useful Links

- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- React Router: https://reactrouter.com

---

**Questions?** Check documentation or ask in team chat! 💬
