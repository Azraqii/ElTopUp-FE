import React, { useState, useRef, useEffect } from 'react';
import type { Game } from '../../types/catalog';

interface GameSelectorProps {
  games: Game[];
  selectedGame: Game | null;
  onSelect: (game: Game) => void;
  loading: boolean;
}

const GameSelector: React.FC<GameSelectorProps> = ({ games, selectedGame, onSelect, loading }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="h-10 w-44 bg-gray-100 rounded-xl animate-pulse" />
    );
  }

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 bg-white border rounded-xl px-3 py-2 transition-colors ${
          open ? 'border-brand-blue' : 'border-gray-200 hover:border-brand-blue'
        }`}
      >
        {selectedGame?.imageUrl ? (
          <img
            src={selectedGame.imageUrl}
            alt={selectedGame.name}
            className="w-8 h-8 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gray-100 shrink-0" />
        )}
        <span className="text-sm font-semibold text-gray-800 max-w-[120px] truncate">
          {selectedGame?.name ?? 'Pilih Game'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-2 z-50 min-w-[192px] bg-white rounded-2xl shadow-lg border border-gray-100 py-2">
          <p className="text-xs font-semibold text-gray-400 px-4 pt-1 pb-2">Pilih Game</p>
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => {
                onSelect(game);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                selectedGame?.id === game.id
                  ? 'bg-blue-50 text-brand-blue'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              {game.imageUrl ? (
                <img
                  src={game.imageUrl}
                  alt={game.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              <span className="text-sm font-semibold">{game.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameSelector;
