'use client';

import { useState } from 'react';
import { SubmittedEvent } from '@/lib/firebaseTypes';

export type EventFormValues = Pick<
  SubmittedEvent,
  | 'title'
  | 'eventType'
  | 'organizationName'
  | 'departmentName'
  | 'location'
  | 'roomNumber'
  | 'date'
  | 'startTime'
  | 'endTime'
  | 'description'
  | 'foodType'
  | 'submitterName'
  | 'submitterEmail'
>;

interface EventFormProps {
  initialValues?: Partial<EventFormValues>;
  submitLabel: string;
  showSubmitterFields?: boolean;
  onSubmit: (values: EventFormValues) => Promise<void>;
  onCancel?: () => void;
}

const inputCls =
  'w-full px-3 py-2.5 bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700 rounded-xl text-sm font-medium text-warm-900 dark:text-warm-100 placeholder:text-warm-400 focus:outline-none focus:border-uta-orange';
const labelCls =
  'block text-sm font-semibold text-warm-700 dark:text-warm-300 mb-1.5';

export function EventForm({
  initialValues,
  submitLabel,
  showSubmitterFields = false,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const [values, setValues] = useState<EventFormValues>({
    title: '',
    eventType: 'student-org',
    organizationName: '',
    departmentName: '',
    location: '',
    roomNumber: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    foodType: '',
    submitterName: '',
    submitterEmail: '',
    ...initialValues,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set =
    (field: keyof EventFormValues) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (values.endTime <= values.startTime) {
      setError('End time must be after start time.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Event title *</label>
        <input
          type="text"
          required
          value={values.title}
          onChange={set('title')}
          placeholder="e.g. Free Pizza Night"
          className={inputCls}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Hosted by *</label>
          <select
            required
            value={values.eventType}
            onChange={set('eventType')}
            className={inputCls}
          >
            <option value="student-org">Student organization</option>
            <option value="department">Department</option>
            <option value="university">University</option>
          </select>
        </div>

        {values.eventType === 'student-org' && (
          <div>
            <label className={labelCls}>Organization name *</label>
            <input
              type="text"
              required
              value={values.organizationName}
              onChange={set('organizationName')}
              placeholder="e.g. ACM @ UTA"
              className={inputCls}
            />
          </div>
        )}

        {values.eventType === 'department' && (
          <div>
            <label className={labelCls}>Department name *</label>
            <input
              type="text"
              required
              value={values.departmentName}
              onChange={set('departmentName')}
              placeholder="e.g. Computer Science"
              className={inputCls}
            />
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Location *</label>
          <input
            type="text"
            required
            value={values.location}
            onChange={set('location')}
            placeholder="e.g. SWSH Building"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Room number</label>
          <input
            type="text"
            value={values.roomNumber}
            onChange={set('roomNumber')}
            placeholder="e.g. 221"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Date *</label>
          <input
            type="date"
            required
            value={values.date}
            onChange={set('date')}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Start time *</label>
          <input
            type="time"
            required
            value={values.startTime}
            onChange={set('startTime')}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>End time *</label>
          <input
            type="time"
            required
            value={values.endTime}
            onChange={set('endTime')}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Food type</label>
        <input
          type="text"
          value={values.foodType}
          onChange={set('foodType')}
          placeholder="e.g. Pizza, tacos, snacks"
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Description *</label>
        <textarea
          required
          rows={4}
          value={values.description}
          onChange={set('description')}
          placeholder="What's the event about? Any details on the food?"
          className={inputCls}
        />
      </div>

      {showSubmitterFields && (
        <div className="pt-2 border-t border-warm-200 dark:border-warm-800">
          <p className="text-xs text-warm-500 dark:text-warm-400 mb-3">
            Optional — only visible to moderators, in case we need to follow up.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Your name</label>
              <input
                type="text"
                value={values.submitterName}
                onChange={set('submitterName')}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Your email</label>
              <input
                type="email"
                value={values.submitterEmail}
                onChange={set('submitterEmail')}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-60">
          {submitting ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
