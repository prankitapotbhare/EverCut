I'll create an image manager component for a Vite + React project that handles different images for light and dark modes.

Let's create the component:

```jsx:c:\Users\manis\Projects\EverCut\src\components\ui\ImageManager.jsx
import { useState, useEffect } from 'react';

/**
 * ImageManager component that switches between light and dark mode images
 * @param {Object} props Component props
 * @param {string} props.lightSrc URL for the light mode image
 * @param {string} props.darkSrc URL for the dark mode image
 * @param {string} props.alt Alt text for the image
 * @param {Object} props.imgProps Additional props to pass to the img element
 * @returns {JSX.Element} Image component that changes based on theme
 */
const ImageManager = ({ lightSrc, darkSrc, alt, ...imgProps }) => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user prefers dark mode
    const isDarkMode = window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check for theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (isDarkMode) {
      setTheme('dark');
    }

    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Listen for custom theme change events
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem('theme');
      if (currentTheme) {
        setTheme(currentTheme);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('themeChange', (e) => {
      if (e.detail && e.detail.theme) {
        setTheme(e.detail.theme);
      }
    });

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR to prevent hydration issues
    return <img src={lightSrc} alt={alt} style={{ visibility: 'hidden' }} {...imgProps} />;
  }

  const imageSrc = theme === 'dark' ? darkSrc : lightSrc;

  return <img src={imageSrc} alt={alt} {...imgProps} />;
};

export default ImageManager;
```

Now, let's create a simple utility to help manage theme changes:

```js:c:\Users\manis\Projects\EverCut\src\utils\themeUtils.js
/**
 * Set the application theme
 * @param {string} theme - The theme to set ('light' or 'dark')
 */
export const setTheme = (theme) => {
  // Save theme to localStorage
  localStorage.setItem('theme', theme);
  
  // Update document attributes
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Dispatch event for components to listen to
  document.dispatchEvent(
    new CustomEvent('themeChange', { detail: { theme } })
  );
};

/**
 * Toggle between light and dark themes
 */
export const toggleTheme = () => {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
};

/**
 * Get the current theme
 * @returns {string} The current theme ('light' or 'dark')
 */
export const getTheme = () => {
  return localStorage.getItem('theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
};
```

Here's an example of how to use the ImageManager component:

```jsx:c:\Users\manis\Projects\EverCut\src\components\Logo.jsx
import ImageManager from './ui/ImageManager';
import { toggleTheme } from '../utils/themeUtils';

const Logo = () => {
  return (
    <div>
      <ImageManager 
        lightSrc="https://imgur.com/nzYqlUp"
        darkSrc="https://imgur.com/QX1MT9i"
        alt="Logo"
        width={200}
        height={50}
        className="logo"
        onClick={() => toggleTheme()}
      />
    </div>
  );
};

export default Logo;
```

This implementation:
1. Creates a reusable ImageManager component that automatically switches between light and dark mode images
2. Provides utility functions to manage theme changes
3. Listens for system preference changes and custom theme change events
4. Handles initial loading to prevent flickering
5. Works with Vite + React setup

You can extend this implementation by integrating it with a more robust theme management library like `react-use-theme` if needed.