# Smooth Animations Guide

## Overview
The Hairvelous application now includes smooth, polished animations throughout the user interface for a better user experience.

## Animation Features

### 1. **Page Transitions**
- Smooth fade-in on page load
- Fade-out when navigating to new pages
- Smooth scrolling throughout the site

### 2. **Navigation Animations**
- Navbar slides in from left
- Links have underline animation on hover
- Logo icon bounces on hover
- Smooth color transitions

### 3. **Card Animations**
- Cards fade in with staggered delays
- Hover effects: lift up and shadow
- Smooth border color transitions

### 4. **Button Animations**
- Ripple effect on click
- Lift effect on hover
- Smooth color transitions
- Scale animations

### 5. **Toast Notifications**
- Slide up animation when appearing
- Fade out when disappearing
- Smooth transitions

### 6. **Form Elements**
- Input fields scale slightly on focus
- Smooth transitions for all form elements

### 7. **Icon Animations**
- Bounce animation on hover (`.icon-bounce`)
- Rotate animation on hover (`.icon-rotate`)

## CSS Classes Available

### Animation Classes
- `.fade-in` - Fade in animation
- `.fade-in-delay-1` - Fade in with 0.1s delay
- `.fade-in-delay-2` - Fade in with 0.2s delay
- `.fade-in-delay-3` - Fade in with 0.3s delay
- `.slide-in-left` - Slide in from left
- `.slide-in-right` - Slide in from right
- `.scale-in` - Scale in animation

### Interactive Classes
- `.card-hover` - Card hover effects (lift + shadow)
- `.btn-primary` - Button with ripple effect
- `.icon-bounce` - Icon bounce on hover
- `.icon-rotate` - Icon rotate on hover

## JavaScript Functions

### `fadeIn(element, delay)`
Smoothly fades in an element with optional delay.

```javascript
fadeIn(document.getElementById('myElement'), 200);
```

### `fadeOut(element, callback)`
Smoothly fades out an element with optional callback.

```javascript
fadeOut(element, () => {
  element.remove();
});
```

### `staggerFadeIn(selector, delay)`
Fades in multiple elements with staggered delays.

```javascript
staggerFadeIn('.card', 100);
```

## Usage Examples

### Adding animations to new cards:
```html
<div class="card-hover bg-slate-800/50 rounded-xl p-6 fade-in-delay-2">
  <!-- Content -->
</div>
```

### Adding animations to buttons:
```html
<button class="btn-primary bg-violet-600 hover:bg-violet-500">
  Click Me
</button>
```

### Adding icon animations:
```html
<span class="icon-bounce text-2xl">✨</span>
```

## Performance

- All animations use CSS transforms (GPU accelerated)
- Respects `prefers-reduced-motion` for accessibility
- Smooth 60fps animations
- Optimized transition durations (0.2s - 0.5s)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- Reduced motion support for accessibility

## Files

- `/public/css/animations.css` - All animation styles
- `/public/js/layout.js` - Animation initialization
- `/public/js/app.js` - Animation helper functions
