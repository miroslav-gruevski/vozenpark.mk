'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { languages, setLanguageToStorage } from '@/lib/i18n';
import type { Language } from '@/types';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguageToStorage(lang);
    onLanguageChange(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 px-3 py-2 rounded-lg
          bg-slate-50 border border-slate-200
          hover:bg-slate-100 hover:border-slate-300
          transition-all duration-200
          text-sm font-medium text-slate-700
        "
      >
        <Globe className="w-4 h-4 text-slate-500" />
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.name}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="
            absolute right-0 mt-2 w-52 py-1
            bg-white border border-slate-200
            rounded-xl shadow-lg
            z-50
          "
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`
                w-full px-4 py-2.5 flex items-center gap-3
                text-left text-sm transition-colors
                ${lang.code === currentLanguage 
                  ? 'bg-blue-50 text-[#0066CC]' 
                  : 'text-slate-700 hover:bg-slate-50'
                }
              `}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="flex-1">{lang.name}</span>
              {lang.code === currentLanguage && (
                <Check className="w-4 h-4 text-[#0066CC]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
