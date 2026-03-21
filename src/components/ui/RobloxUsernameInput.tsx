// src/components/RobloxUsernameInput.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RobloxUser {
  id: number;
  name: string;
  displayName: string;
  avatarUrl: string | null;
}

interface Props {
  value: string;
  onChange: (username: string) => void;
  apiBaseUrl: string;
}

// ─── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Avatar fallback (inisial) ────────────────────────────────────────────────
const AvatarFallback: React.FC<{ name: string }> = ({ name }) => (
  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-blue/40 flex items-center justify-center flex-shrink-0">
    <span className="text-brand-blue font-bold text-sm select-none">
      {name.charAt(0).toUpperCase()}
    </span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const RobloxUsernameInput: React.FC<Props> = ({ value, onChange, apiBaseUrl }) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<RobloxUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedUser, setSelectedUser] = useState<RobloxUser | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const debouncedQuery = useDebounce(inputValue, 450);

  // ── Fetch suggestions dari backend proxy ──────────────────────────────────
  const fetchSuggestions = useCallback(
    async (query: string) => {
      const trimmed = query.trim();

      if (trimmed.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        setErrorMsg(null);
        setNotFound(false);
        return;
      }

      // Cancel previous request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setIsLoading(true);
      setErrorMsg(null);
      setNotFound(false);

      try {
        const res = await fetch(
          `${apiBaseUrl}/roblox/search?q=${encodeURIComponent(trimmed)}`,
          { signal: abortRef.current.signal },
        );

        const data = await res.json();

        if (!res.ok) {
          // 429 = rate limit
          if (res.status === 429) {
            setErrorMsg('Terlalu banyak pencarian. Tunggu beberapa detik.');
          } else {
            setErrorMsg(data.error || 'Gagal mencari user Roblox.');
          }
          setSuggestions([]);
          setIsOpen(false);
          return;
        }

        const users: RobloxUser[] = data.users ?? [];

        if (users.length === 0) {
          setNotFound(true);
          setSuggestions([]);
          setIsOpen(false);
        } else {
          setNotFound(false);
          setSuggestions(users);
          setIsOpen(true);
          setActiveIndex(-1);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return; // request di-cancel, skip
        console.error('[RobloxUsernameInput]', err.message);
        setErrorMsg('Gagal terhubung ke server. Cek koneksi internet kamu.');
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl],
  );

  // ── Trigger fetch saat query berubah ─────────────────────────────────────
  useEffect(() => {
    // Kalau user sudah pilih dari dropdown dan tidak mengedit, skip
    if (selectedUser && inputValue === selectedUser.name) return;
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Tutup dropdown klik di luar ───────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Pilih user dari dropdown ──────────────────────────────────────────────
  const handleSelect = (user: RobloxUser) => {
    setSelectedUser(user);
    setInputValue(user.name);
    onChange(user.name);
    setIsOpen(false);
    setSuggestions([]);
    setErrorMsg(null);
    setNotFound(false);
  };

  // ── Input change ──────────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    if (selectedUser && val !== selectedUser.name) {
      setSelectedUser(null); // reset jika diedit manual
    }
  };

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen && suggestions.length > 0) setIsOpen(true);
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && isOpen && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // ── Clear button ──────────────────────────────────────────────────────────
  const handleClear = () => {
    setInputValue('');
    onChange('');
    setSelectedUser(null);
    setSuggestions([]);
    setIsOpen(false);
    setErrorMsg(null);
    setNotFound(false);
    inputRef.current?.focus();
  };

  const isDropdownOpen = isOpen && suggestions.length > 0;

  return (
    <div ref={containerRef} className="relative">
      {/* ── Input wrapper ── */}
      <div className="relative">
        {/* Ikon kiri: avatar jika sudah pilih, atau ikon user */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          {selectedUser?.avatarUrl ? (
            <img
              src={selectedUser.avatarUrl}
              alt={selectedUser.name}
              className="w-7 h-7 rounded-lg object-cover"
            />
          ) : (
            <svg
              className={`w-5 h-5 transition-colors ${isLoading ? 'text-brand-blue' : 'text-gray-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className={`w-full bg-gray-50 border-2 rounded-2xl pl-12 pr-11 py-4 text-base font-medium text-gray-800 outline-none transition-all placeholder:text-gray-300
            ${isDropdownOpen
              ? 'border-brand-blue ring-4 ring-brand-blue/10 rounded-b-none'
              : errorMsg
              ? 'border-red-300 ring-4 ring-red-100'
              : selectedUser
              ? 'border-green-400 ring-4 ring-green-100'
              : 'border-gray-100 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10'
            }`}
          placeholder="Contoh: RobloxPlayer123"
          aria-autocomplete="list"
          aria-expanded={isDropdownOpen}
          role="combobox"
        />

        {/* Kanan: spinner atau clear button */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {isLoading && (
            <svg className="w-4 h-4 text-brand-blue animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          {inputValue.length > 0 && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              aria-label="Hapus"
            >
              <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Dropdown ── */}
      {isDropdownOpen && (
        <div className="absolute left-0 right-0 z-50 bg-white border-2 border-t-0 border-brand-blue rounded-b-2xl shadow-xl shadow-brand-blue/10 overflow-hidden">
          <ul role="listbox" className="py-1 max-h-64 overflow-y-auto">
            {suggestions.map((user, idx) => (
              <li
                key={user.id}
                role="option"
                aria-selected={activeIndex === idx}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(e) => {
                  e.preventDefault(); // cegah blur sebelum select
                  handleSelect(user);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors
                  ${activeIndex === idx ? 'bg-brand-blue/5' : 'hover:bg-gray-50'}`}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-9 h-9 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <AvatarFallback name={user.name} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                  {user.displayName !== user.name && (
                    <p className="text-xs text-gray-400 truncate">{user.displayName}</p>
                  )}
                </div>
                {selectedUser?.id === user.id && (
                  <svg className="w-4 h-4 text-brand-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
            <p className="text-[11px] text-gray-400">↑↓ navigasi · Enter pilih · Esc tutup</p>
          </div>
        </div>
      )}

      {/* ── Status messages di bawah input ── */}
      <div className="mt-1.5 pl-1 min-h-[18px]">
        {/* Error */}
        {errorMsg && !isLoading && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-xs text-red-500">{errorMsg}</p>
          </div>
        )}

        {/* Tidak ditemukan */}
        {notFound && !isLoading && !errorMsg && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-gray-400">
              Username tidak ditemukan — kamu tetap bisa melanjutkan jika yakin username-nya benar.
            </p>
          </div>
        )}

        {/* User terpilih */}
        {selectedUser && !errorMsg && !notFound && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-xs text-green-600 font-medium">
              Akun ditemukan:{' '}
              <span className="font-bold">{selectedUser.displayName}</span>
              {selectedUser.displayName !== selectedUser.name && (
                <span className="text-green-500"> (@{selectedUser.name})</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RobloxUsernameInput;