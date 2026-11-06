import { useState } from 'react';
import { ArrowRight, CheckCircle2, Plus, Send, Tag } from 'lucide-react';
import type { FormConfig, RegisterAnswers } from '../types';

interface RegisterFormProps {
  config: FormConfig;
  onSubmit: (answers: RegisterAnswers) => Promise<void>;
  onViewTable: () => void;
}

function buildEmptyAnswers(config: FormConfig): RegisterAnswers {
  return config.questions.reduce((accumulator, question) => {
    accumulator[question.id] = '';
    return accumulator;
  }, {} as RegisterAnswers);
}

export default function RegisterForm({ config, onSubmit, onViewTable }: RegisterFormProps) {
  const [answers, setAnswers] = useState<RegisterAnswers>(() => buildEmptyAnswers(config));
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterAnswers, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (fieldId: keyof RegisterAnswers, value: string) => {
    setAnswers((previous) => ({ ...previous, [fieldId]: value }));
    setErrors((previous) => {
      if (!previous[fieldId]) return previous;
      const next = { ...previous };
      delete next[fieldId];
      return next;
    });
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof RegisterAnswers, string>> = {};

    config.questions.forEach((question) => {
      if (question.required && !answers[question.id]?.trim()) {
        nextErrors[question.id] = 'Kolom ini wajib diisi';
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(answers);
      setAnswers(buildEmptyAnswers(config));
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Gagal menyimpan data. Silakan coba lagi.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setAnswers(buildEmptyAnswers(config));
    setErrors({});
    setSubmitError(null);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="mx-auto my-12 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-geomin">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-slate-900">Register Berhasil Dicatat!</h2>
        <p className="mb-6 text-sm text-slate-600">
          Data surat/nota dinas telah berhasil ditambahkan ke tabel register Unit Geomin.
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center space-x-2 rounded-xl bg-geomin px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-geomin-dark"
          >
            <Plus className="h-4 w-4" />
            <span>Input Surat Lain</span>
          </button>
          <button
            type="button"
            onClick={onViewTable}
            className="flex items-center space-x-2 rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-200"
          >
            <span>Lihat Tabel Data</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="rounded-2xl border border-slate-200 border-t-8 border-t-geomin bg-white p-6 shadow-sm">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-geomin">Lampiran 2</p>
        <h1 className="text-2xl font-bold text-slate-900">{config.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{config.description}</p>
      </div>

      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {config.questions.map((question) => {
          const hasError = Boolean(errors[question.id]);

          return (
            <div key={question.id} className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                {question.title}
                {question.required && <span className="ml-1 text-rose-500">*</span>}
              </label>

              {question.type === 'dropdown' && (
                <div className="flex gap-4 pt-1">
                  {question.options?.map((option) => (
                    <label
                      key={option}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 p-3 font-bold transition-all ${
                        answers[question.id] === option
                          ? option === 'MASUK'
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-amber-600 bg-amber-50 text-amber-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(event) => handleChange(question.id, event.target.value)}
                        className="sr-only"
                      />
                      <Tag className="h-4 w-4" />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'short_text' && (
                <input
                  type="text"
                  value={answers[question.id]}
                  onChange={(event) => handleChange(question.id, event.target.value)}
                  placeholder={question.placeholder}
                  className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-geomin ${
                    hasError ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
              )}

              {question.type === 'date' && (
                <input
                  type="date"
                  value={answers[question.id]}
                  onChange={(event) => handleChange(question.id, event.target.value)}
                  className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-geomin sm:w-64 ${
                    hasError ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
              )}

              {question.type === 'long_text' && (
                <textarea
                  rows={3}
                  value={answers[question.id]}
                  onChange={(event) => handleChange(question.id, event.target.value)}
                  placeholder={question.placeholder}
                  className={`w-full rounded-xl border bg-slate-50 p-3 text-sm text-slate-800 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-geomin ${
                    hasError ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
              )}

              {hasError && (
                <p className="text-xs font-medium text-rose-500">{errors[question.id]}</p>
              )}
            </div>
          );
        })}

        {submitError && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {submitError}
          </p>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center space-x-2 rounded-xl bg-geomin px-8 py-3 font-bold text-white shadow-md transition-all hover:bg-geomin-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            <span>{submitting ? 'Menyimpan...' : 'Simpan Ke Register'}</span>
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Reset Form
          </button>
        </div>
      </div>
    </form>
  );
}
