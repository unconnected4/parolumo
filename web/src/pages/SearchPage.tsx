import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { useLookup } from '../hooks/useDictionary';
import { useCards } from '../hooks/useCards';
import { SenseCard } from '../components/SenseCard';
import { AudioButton } from '../components/AudioButton';

const SAMPLE_WORDS = ['run', 'bank', 'light'];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || 'run';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);

  const { data, isLoading, isError, error } = useLookup(activeQuery);
  const { saveCard, isSaving, savingSenseId } = useCards();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      setActiveQuery(trimmed);
      setSearchParams({ q: trimmed });
    }
  };

  const handleSelectSample = (word: string) => {
    setSearchTerm(word);
    setActiveQuery(word);
    setSearchParams({ q: word });
  };

  const handleClear = () => {
    setSearchTerm('');
    setActiveQuery('');
    setSearchParams({});
  };

  // Group senses by POS
  const lexemes = data?.lexemes || [];
  const primaryTranscription = lexemes.find((l) => l.transcription)?.transcription;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Search Bar */}
      <section className="space-y-3">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search an English word (e.g. run, bank, light)..."
            className="w-full pl-12 pr-24 py-3.5 bg-white border border-slate-300 rounded-2xl shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-lg transition-all"
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-20 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            Search
          </button>
        </form>

        {/* Sample query shortcuts */}
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1 font-medium text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Try samples:
          </span>
          {SAMPLE_WORDS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => handleSelectSample(w)}
              className={`px-2.5 py-1 rounded-full border transition-all ${
                activeQuery.toLowerCase() === w
                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-semibold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </section>

      {/* Loading state */}
      {isLoading && (
        <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium">Looking up "{activeQuery}"...</p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-4 text-rose-800">
          <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-rose-900">Word not found</h3>
            <p className="text-sm mt-1 text-rose-700">{error?.message}</p>
            <p className="text-xs mt-2 text-rose-600">
              In Step 0 mock mode, rich fixtures are provided for <strong>run</strong>, <strong>bank</strong>, and <strong>light</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Empty initial state */}
      {!isLoading && !isError && activeQuery === '' && (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl p-8">
          <SearchIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">Enter a word to explore senses</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Search for English words to see Russian translations, context meanings, and example sentences. Save specific senses to build your personal vocabulary.
          </p>
        </div>
      )}

      {/* Dictionary Results */}
      {!isLoading && !isError && lexemes.length > 0 && (
        <div className="space-y-6">
          {/* Lemma Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-3xl font-extrabold text-slate-900 capitalize tracking-tight">
                {activeQuery}
              </h2>
              {primaryTranscription && (
                <span className="text-base text-slate-500 font-mono">
                  [{primaryTranscription}]
                </span>
              )}
              <AudioButton text={activeQuery} />
            </div>
            <span className="text-xs text-slate-400">
              {lexemes.reduce((acc, l) => acc + l.senses.length, 0)} senses available
            </span>
          </div>

          {/* Senses grouped by Part of Speech */}
          <div className="space-y-8">
            {lexemes.map((lexeme, lexIdx) => (
              <div key={lexIdx} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                    {lexeme.pos}
                  </span>
                  {lexeme.transcription && lexeme.transcription !== primaryTranscription && (
                    <span className="text-xs text-slate-400 font-mono">[{lexeme.transcription}]</span>
                  )}
                </div>

                <div className="grid gap-3">
                  {lexeme.senses.map((sense) => (
                    <SenseCard
                      key={sense.id}
                      sense={sense}
                      onSave={saveCard}
                      isSaving={isSaving && savingSenseId === sense.id}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Yandex Credit Line (per web/intent.md) */}
          <footer className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
            Dictionary data provided for learning purposes. Powered by Yandex.Dictionary.
          </footer>
        </div>
      )}
    </div>
  );
}
