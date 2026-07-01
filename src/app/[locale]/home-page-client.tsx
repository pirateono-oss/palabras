'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { anagramMap } from '@/lib/words';
import { Search, Shuffle, Type, Copy, Check, SortAsc, ArrowUpDown } from 'lucide-react';

export default function PalabrasPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const [tab, setTab] = useState<'anagram' | 'unscramble' | 'counter'>('anagram');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl tool-icon shadow-lg">
          <Type className="h-7 w-7 text-white" />
        </div>
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">{dict.siteTitle}</h1>
        <p className="text-muted-foreground">{dict.siteTagline}</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {[
          { key: 'anagram', label: dict.anagramSolver, icon: Search },
          { key: 'unscramble', label: dict.wordUnscrambler, icon: Shuffle },
          { key: 'counter', label: dict.charCounter, icon: Type },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key as typeof tab)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${tab === key ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card text-foreground hover:bg-secondary border border-border'}`}>
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'anagram' && <AnagramSolver dict={dict} />}
      {tab === 'unscramble' && <WordUnscrambler dict={dict} />}
      {tab === 'counter' && <CharCounter dict={dict} />}
    </div>
  );
}

function AnagramSolver({ dict }: { dict: any }) {
  const [input, setInput] = useState('');
  const [sortBy, setSortBy] = useState<'length' | 'alpha'>('length');

  const results = useMemo(() => {
    if (input.length < 3) return [];
    const key = input.toLowerCase().split('').sort().join('');
    const found = anagramMap.get(key) || [];
    const filtered = found.filter(w => w !== input.toLowerCase());
    const unique = [...new Set(filtered)];
    if (sortBy === 'alpha') return unique.sort();
    return unique.sort((a, b) => a.length - b.length || a.localeCompare(b));
  }, [input, sortBy]);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex gap-3">
        <input value={input} onChange={e => setInput(e.target.value.toUpperCase().replace(/[^A-ZÑ]/g, ''))}
          placeholder="P E R R O"
          className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-center text-2xl font-mono tracking-[0.3em] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
          maxLength={8} />
      </div>

      {input.length >= 3 && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{results.length} {dict.anagramsFound}</p>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
              className="rounded-lg border border-border bg-background px-3 py-1 text-sm">
              <option value="length">{dict.sortBy}: {dict.length}</option>
              <option value="alpha">{dict.sortBy}: {dict.alphabetically}</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.length > 0 ? results.map((word, i) => (
              <button key={i} onClick={() => navigator.clipboard.writeText(word)}
                className="group relative rounded-lg bg-secondary/50 px-4 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary">
                {word}
                <span className="ml-2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100">{word.length}</span>
              </button>
            )) : (
              <p className="w-full py-8 text-center text-muted-foreground">{dict.noAnagrams}</p>
            )}
          </div>
        </>
      )}
      {input.length < 3 && (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 max-w-md rounded-xl bg-gradient-to-r from-primary/5 to-secondary/30 p-4 text-left">
            <p className="mb-1 flex items-center gap-1 text-sm font-medium"><span className="text-lg">💡</span> Cómo usar:</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Escribe entre 3 y 8 letras sin espacios</li>
              <li>• Ejemplo: escribe <strong>AMOR</strong> → encuentra ROMA, MORA, RAMO</li>
              <li>• Haz clic en cualquier palabra para copiarla al portapapeles</li>
              <li>• Cambia el orden por longitud o alfabéticamente</li>
            </ul>
          </div>
          <p className="text-muted-foreground">{dict.enterLetters} (3-8 letras)</p>
        </div>
      )}
    </div>
  );
}

function WordUnscrambler({ dict }: { dict: any }) {
  const [input, setInput] = useState('');

  const matches = useMemo(() => {
    const letters = input.toLowerCase().split('');
    if (letters.length < 3) return [];
    const letterCount = new Map<string, number>();
    letters.forEach(l => letterCount.set(l, (letterCount.get(l) || 0) + 1));

    const results: { word: string; len: number }[] = [];
    for (const [key, words] of anagramMap) {
      // Check if key is subset of input letters
      const keyCount = new Map<string, number>();
      key.split('').forEach(l => keyCount.set(l, (keyCount.get(l) || 0) + 1));
      let valid = true;
      for (const [l, c] of keyCount) {
        if ((letterCount.get(l) || 0) < c) { valid = false; break; }
      }
      if (valid) {
        for (const word of words) {
          if (word !== input.toLowerCase()) results.push({ word, len: word.length });
        }
      }
    }
    return [...new Set(results.map(r => r.word))].sort((a, b) => b.length - a.length || a.localeCompare(b));
  }, [input]);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex gap-3">
        <input value={input} onChange={e => setInput(e.target.value.toUpperCase().replace(/[^A-ZÑ]/g, ''))}
          placeholder="E J E M P L O"
          className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-center text-2xl font-mono tracking-[0.3em] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
          maxLength={10} />
      </div>
      <div className="mb-4 -mt-2 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/30 p-3 text-xs text-muted-foreground">
        💡 <strong>Letras desordenadas</strong> — Ejemplo: <strong>EJRMPO</strong> encuentra PERRO, RO, O, etc. Ideal para Scrabble.
      </div>
      {input.length >= 3 && (
        <>
          <p className="mb-3 text-sm text-muted-foreground">{matches.length} {dict.possibleWords}</p>
          <div className="flex flex-wrap gap-2">
            {matches.map((word, i) => (
              <button key={i} onClick={() => navigator.clipboard.writeText(word)}
                className="group relative rounded-lg bg-secondary/50 px-4 py-2 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary">
                {word}
                <span className="ml-2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100">{word.length}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CharCounter({ dict }: { dict: any }) {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const noSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    const readingTime = Math.max(1, Math.round(words / 200));

    // Top chars
    const freq = new Map<string, number>();
    for (const c of text.toLowerCase()) {
      if (/[a-záéíóúüñ]/i.test(c)) freq.set(c, (freq.get(c) || 0) + 1);
    }
    const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

    return { chars, noSpaces, words, lines, readingTime, top };
  }, [text]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-6">
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder={dict.typeText}
          className="h-48 w-full rounded-xl border border-border bg-background p-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          rows={8} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: dict.characters, value: stats.chars },
          { label: dict.words, value: stats.words },
          { label: dict.lines, value: stats.lines },
          { label: dict.withoutSpaces, value: stats.noSpaces },
          { label: dict.readingTime, value: `${stats.readingTime} min` },
        ].map(({ label, value }, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {stats.top.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="mb-3 text-sm font-medium">{dict.topChars}</p>
          <div className="flex flex-wrap gap-2">
            {stats.top.map(([char, count], i) => {
              const maxCount = stats.top[0][1];
              const pct = (count / maxCount) * 100;
              return (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
                  <span className="w-5 text-center text-lg font-bold">{char}</span>
                  <div className="h-3 w-16 overflow-hidden rounded-full bg-secondary sm:w-24">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
