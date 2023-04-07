import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme!: string;
  themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  setTheme() {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      this.themeLink.href = 'md-dark-deeppurple.css';
      this.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      this.themeLink.href = 'md-light-deeppurple.css';
      this.theme = 'light';
    }
  }

  setDarkTheme() {
    // Whenever the user explicitly chooses dark mode
    localStorage.setItem('theme', 'dark');
    this.setTheme();
  }

  setLightTheme() {
    // Whenever the user explicitly chooses light mode
    localStorage.setItem('theme', 'light');
    this.setTheme();
  }

  setOSTheme() {
    // Whenever the user explicitly chooses to respect the OS preference
    localStorage.removeItem('theme');
    this.setTheme();
  }
}
