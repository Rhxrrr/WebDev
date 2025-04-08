import { ref, watchEffect, onMounted } from 'vue'

export const darkMode = ref(false)

export function useTheme() {
  const toggleTheme = () => {
    darkMode.value = !darkMode.value
  }

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  watchEffect(() => {
    applyTheme(darkMode.value)
  })

  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Only auto-apply dark mode if no preference is saved
    if (savedTheme === null) {
      darkMode.value = prefersDark
    } else {
      darkMode.value = savedTheme === 'dark'
    }
    
    // Force apply the initial theme
    applyTheme(darkMode.value)
  })

  return { darkMode, toggleTheme }
}