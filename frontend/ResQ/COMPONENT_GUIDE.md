# Component Development Guide

## Creating New Components

### Component Template

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ComponentName - Brief description
 * 
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
const ComponentName = ({ prop1, prop2 }) => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async () => {
    setError('');
    setLoading(true);

    try {
      // Your logic here
      const response = await fetch('API_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // Success handling
        navigate('/success-route');
      } else {
        setError('Error message');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Page Title</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Your component content */}
        
      </div>
    </div>
  );
};

export default ComponentName;
```

## Common Patterns

### 1. Form Component

```jsx
const FormComponent = () => {
  const [formData, setFormData] = useState({
    field1: '',
    field2: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Field Label *
        </label>
        <input
          type="text"
          required
          value={formData.field1}
          onChange={(e) => setFormData({ ...formData, field1: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter value"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
};
```

### 2. List Component with Delete

```jsx
const ListComponent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('API_URL');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      const response = await fetch(`API_URL/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Deleted successfully!');
        fetchItems();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-2">{item.name}</h3>
          <p className="text-gray-600">{item.description}</p>
          <button
            onClick={() => handleDelete(item.id)}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
```

### 3. Dashboard Card Grid

```jsx
const DashboardCards = () => {
  const cards = [
    {
      title: 'Feature 1',
      icon: '📊',
      description: 'Description here',
      link: '/path'
    },
    // More cards...
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Link
          key={index}
          to={card.link}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <div className="text-4xl mb-4">{card.icon}</div>
          <h3 className="text-xl font-bold mb-2">{card.title}</h3>
          <p className="text-gray-600">{card.description}</p>
        </Link>
      ))}
    </div>
  );
};
```

## Tailwind CSS Classes Reference

### Layout
```css
/* Container */
container mx-auto px-4

/* Flexbox */
flex justify-between items-center gap-4
flex-col md:flex-row

/* Grid */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

/* Spacing */
py-8 px-4 mb-8 mt-4
space-y-4 (for vertical spacing between children)
```

### Components
```css
/* Button Primary */
bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition

/* Button Secondary */
bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition

/* Button Danger */
bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition

/* Input Field */
w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500

/* Card */
bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition

/* Alert Error */
bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4

/* Alert Success */
bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4

/* Alert Info */
bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4
```

### Typography
```css
/* Headings */
text-4xl font-bold mb-8              /* Page Title */
text-2xl font-semibold mb-4          /* Section Title */
text-xl font-bold mb-2               /* Card Title */

/* Body Text */
text-gray-600                        /* Secondary text */
text-gray-700                        /* Primary text */
text-sm font-medium                  /* Labels */
```

### Colors
```css
/* Primary (Blue) */
bg-blue-600 text-blue-600 border-blue-600

/* Success (Green) */
bg-green-600 text-green-600 border-green-600

/* Warning (Yellow) */
bg-yellow-600 text-yellow-600 border-yellow-600

/* Danger (Red) */
bg-red-600 text-red-600 border-red-600

/* Neutral (Gray) */
bg-gray-50 bg-gray-100 bg-gray-300 bg-gray-600 bg-gray-800
```

## Using Utility Functions

### API Calls
```jsx
import { apiCall, API_ENDPOINTS } from '../utils/api';

// GET request
const data = await apiCall(API_ENDPOINTS.DISASTERS);

// POST request
const result = await apiCall(API_ENDPOINTS.DISASTERS, {
  method: 'POST',
  body: JSON.stringify(formData)
});

// DELETE request
await apiCall(API_ENDPOINTS.DISASTERS_BY_ID(id), {
  method: 'DELETE'
});
```

### Validation
```jsx
import { validateEmail, validatePassword, validateNoSpecialChars } from '../utils/validation';

if (!validateEmail(email)) {
  setError('Invalid email format');
  return;
}

if (!validateNoSpecialChars(name)) {
  setError('Special characters not allowed');
  return;
}
```

### Formatting
```jsx
import { formatDate, getSeverityColor, formatCurrency } from '../utils/helpers';

// Format date
<p>{formatDate(disaster.createdAt)}</p>

// Apply severity color
<span className={getSeverityColor(disaster.severity)}>
  {disaster.severity}
</span>

// Format currency
<p>{formatCurrency(donation.amount)}</p>
```

## File Naming Conventions

```
ComponentName.jsx          # React component
utils/helperName.js        # Utility function
context/ContextName.jsx    # React context
```

## Code Quality Checklist

Before committing your code:

- [ ] Component name matches file name
- [ ] PropTypes or TypeScript types defined (if applicable)
- [ ] Error handling implemented
- [ ] Loading states shown
- [ ] Success/error messages displayed
- [ ] Form validation added
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility attributes (aria-labels, alt text)
- [ ] Console.logs removed
- [ ] Comments added for complex logic
- [ ] Code follows project style guide
- [ ] No ESLint errors

## Testing Your Component

1. **Manual Testing**
   - Test all user interactions
   - Test with invalid data
   - Test error scenarios
   - Test on different screen sizes

2. **Browser Testing**
   - Chrome (primary)
   - Firefox
   - Edge

3. **Accessibility**
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution**: Check import path, ensure file exists

### Issue: "useState is not defined"
**Solution**: Add `import { useState } from 'react';`

### Issue: "useNavigate is not defined"
**Solution**: Add `import { useNavigate } from 'react-router-dom';`

### Issue: API call fails
**Solution**: 
- Check backend is running on port 8080
- Verify API endpoint in `utils/api.js`
- Check network tab in browser DevTools

### Issue: Styles not applying
**Solution**: 
- Ensure Tailwind classes are correct
- Check for typos in class names
- Verify Tailwind is configured properly

## Need Help?

1. Check existing similar components for reference
2. Review PROJECT_README.md
3. Check this guide
4. Ask in team chat
5. Review React/Tailwind documentation

---

Happy coding! 🚀
