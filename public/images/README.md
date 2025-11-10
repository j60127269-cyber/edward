# Login Background Image

## Instructions

Place your login background image in this directory with the filename:

**`login-background.jpg`**

### Image Requirements:
- **Format**: JPG, JPEG, or PNG
- **Recommended size**: 1920x1080px or larger
- **Aspect ratio**: 16:9 (landscape)
- **File size**: Optimize to under 500KB for faster loading

### Supported Formats:
- `.jpg` or `.jpeg`
- `.png`
- `.webp`

If you use a different filename or format, update the path in `src/app/login/page.tsx`:

```tsx
backgroundImage: "url('/images/your-image-name.jpg')"
```

### Image Description:
The image should show a study/classroom environment with people working on laptops, as it will be blurred and darkened to create an elegant backdrop for the login form.

### Troubleshooting:
If the image doesn't appear:
1. Check that the file is in `public/images/` directory
2. Verify the filename matches exactly: `login-background.jpg`
3. Ensure the file is committed to your repository
4. Check the browser console for 404 errors
5. Clear browser cache and rebuild the application

### Fallback:
If the image fails to load, the page will show a dark blue background (`#0a0e27`) as a fallback.

