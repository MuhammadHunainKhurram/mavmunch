'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EventForm, EventFormValues } from '@/components/EventForm';
import { submitEvent } from '@/lib/firebaseService';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values: EventFormValues) => {
    await submitEvent(values);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-warm-500 dark:text-warm-400 hover:text-uta-orange transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to events
        </Link>

        {submitted ? (
          <div className="bg-white dark:bg-warm-900 rounded-2xl border border-warm-200 dark:border-warm-800 shadow-soft p-8 text-center">
            <div className="w-16 h-16 bg-uta-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-uta-orange" />
            </div>
            <h1 className="text-2xl font-bold text-warm-900 dark:text-warm-100 mb-2">
              Thanks for submitting!
            </h1>
            <p className="text-sm text-warm-500 dark:text-warm-400 mb-6">
              Your event is pending review and will show up on MavMunch once a
              moderator approves it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="btn-primary"
              >
                Submit another event
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700 transition-colors"
              >
                Back to events
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-warm-900 rounded-2xl border border-warm-200 dark:border-warm-800 shadow-soft p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-warm-900 dark:text-warm-100 mb-1">
              Submit a food event
            </h1>
            <p className="text-sm text-warm-500 dark:text-warm-400 mb-6">
              Free food on campus, or a food event anywhere in DFW. Submissions
              are reviewed before they go live.
            </p>
            <EventForm
              submitLabel="Submit event"
              showSubmitterFields
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </main>
    </div>
  );
}
