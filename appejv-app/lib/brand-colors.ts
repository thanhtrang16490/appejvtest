/**
 * APPE JV Brand Colors
 * Extracted from official logo (appejv-logo.svg)
 */

export const brandColors = {
  // Primary brand colors from logo
  primary: {
    DEFAULT: '#175ead', // Main brand blue (cls-1)
    dark: '#145a9d',    // Darker shade for hover states
    light: '#2575be',   // Lighter brand blue (cls-2)
  },
  
  // Secondary colors
  secondary: {
    DEFAULT: '#2575be', // Secondary brand blue
    dark: '#1e6aae',    // Darker shade
    light: '#3d8dd1',   // Lighter shade
  },
  
  // Gradient combinations
  gradients: {
    primary: 'from-[#175ead] to-[#2575be]',
    primaryHover: 'from-[#145a9d] to-[#1e6aae]',
    background: 'from-blue-50 to-cyan-50',
    backgroundAlt: 'from-[#175ead]/5 to-[#2575be]/5',
  },
  
  // Background colors
  background: {
    light: '#f0f7ff',   // Very light blue
    lighter: '#f8fbff', // Almost white blue
  },
  
  // Accent colors (complementary)
  accent: {
    success: '#10b981', // Green for success states
    warning: '#f59e0b', // Orange for warnings
    error: '#ef4444',   // Red for errors
    info: '#2575be',    // Use secondary blue for info
  }
} as const

// Tailwind class helpers
export const brandClasses = {
  // Buttons
  buttonPrimary: 'bg-gradient-to-r from-[#175ead] to-[#2575be] hover:from-[#145a9d] hover:to-[#1e6aae] text-white',
  buttonOutline: 'border-[#175ead] text-[#175ead] hover:bg-[#175ead] hover:text-white',
  
  // Backgrounds
  bgGradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
  bgGradientAlt: 'bg-gradient-to-br from-[#175ead]/5 to-[#2575be]/5',
  bgHeader: 'bg-gradient-to-br from-blue-50 to-cyan-50',
  
  // Text
  textPrimary: 'text-[#175ead]',
  textSecondary: 'text-[#2575be]',
  textGradient: 'text-transparent bg-clip-text bg-gradient-to-r from-[#175ead] to-[#2575be]',
  
  // Badges
  badgePrimary: 'bg-[#175ead] text-white',
  badgeSecondary: 'bg-[#2575be] text-white',
  badgeLight: 'bg-blue-100 text-[#175ead]',
  
  // Borders
  borderPrimary: 'border-[#175ead]',
  borderSecondary: 'border-[#2575be]',
  
  // Hover states
  hoverPrimary: 'hover:text-[#175ead]',
  hoverBg: 'hover:bg-[#175ead]/10',
} as const
