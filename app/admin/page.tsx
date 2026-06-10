'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { getFirebaseAuth, googleProvider } from '@/lib/firebase';
import {
  getPendingSubmittedEvents,
  getAllApprovedSubmittedEvents,
  approveSubmittedEvent,
  deleteSubmittedEvent,
  updateSubmittedEvent,
} from '@/lib/firebaseService';
import { SubmittedEvent } from '@/lib/firebaseTypes';
import { getOrgName } from '@/lib/utils';
import { EventForm, EventFormValues } from '@/components/EventForm';
import {
  ArrowLeft,
  Check,
  LogOut,
  Mail,
  Pencil,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isAdminUser(user: User | null): boolean {
  return !!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
}

interface AdminEventCardProps {
  event: SubmittedEvent;
  pending: boolean;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

function AdminEventCard({ event, pending, onApprove, onDelete, onEdit }: AdminEventCardProps) {
  return (
    <div className="bg-white dark:bg-warm-900 rounded-2xl border border-warm-200 dark:border-warm-800 shadow-soft p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-uta-blue mb-1">
            {getOrgName(event)}
          </p>
          <h3 className="text-lg font-bold text-warm-900 dark:text-warm-100">
            {event.title}
          </h3>
          <p className="text-sm text-warm-500 dark:text-warm-400 mt-1">
            {event.date} · {event.startTime}–{event.endTime} · {event.location}
            {event.roomNumber ? ` ${event.roomNumber}` : ''}
          </p>
          {event.foodType && (
            <p className="text-sm text-warm-500 dark:text-warm-400">
              Food: {event.foodType}
            </p>
          )}
          <p className="text-sm text-warm-700 dark:text-warm-300 mt-2 whitespace-pre-wrap">
            {event.description}
          </p>
          {(event.submitterName || event.submitterEmail) && (
            <p className="inline-flex items-center gap-1.5 text-xs text-warm-500 dark:text-warm-400 mt-3 px-2 py-1 bg-warm-100 dark:bg-warm-800 rounded-lg">
              <Mail className="w-3 h-3" />
              {[event.submitterName, event.submitterEmail]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {pending && (
            <button
              onClick={() => onApprove(event.id!)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Approve
            </button>
          )}
          <button
            onClick={() => onEdit(event.id!)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(event.id!)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-red-600/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors"
          >
            {pending ? <X className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
            {pending ? 'Reject' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [pendingEvents, setPendingEvents] = useState<SubmittedEvent[]>([]);
  const [liveEvents, setLiveEvents] = useState<SubmittedEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const isAdmin = isAdminUser(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    try {
      const [pending, live] = await Promise.all([
        getPendingSubmittedEvents(),
        getAllApprovedSubmittedEvents(),
      ]);
      setPendingEvents(pending);
      setLiveEvents(live);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setActionError('Failed to load events. Check Firestore rules and connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin, refresh]);

  const runAction = async (action: () => Promise<void>) => {
    setActionError(null);
    try {
      await action();
      await refresh();
    } catch (err) {
      console.error('Admin action failed:', err);
      setActionError('Action failed. Check Firestore rules and connection.');
    }
  };

  const handleApprove = (id: string) => runAction(() => approveSubmittedEvent(id));

  const handleDelete = (id: string, pending: boolean) => {
    const verb = pending ? 'Reject and delete' : 'Delete';
    if (!window.confirm(`${verb} this event? This cannot be undone.`)) return;
    runAction(() => deleteSubmittedEvent(id));
  };

  const handleSaveEdit = async (id: string, values: EventFormValues) => {
    await updateSubmittedEvent(id, values);
    setEditingId(null);
    await refresh();
  };

  const handleSignIn = async () => {
    try {
      await signInWithPopup(getFirebaseAuth(), googleProvider);
    } catch (err) {
      console.error('Sign-in failed:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-warm-500 dark:text-warm-400">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white dark:bg-warm-900 rounded-2xl border border-warm-200 dark:border-warm-800 shadow-soft p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-uta-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7 text-uta-orange" />
          </div>
          <h1 className="text-xl font-bold text-warm-900 dark:text-warm-100 mb-2">
            MavMunch Admin
          </h1>
          {!user ? (
            <>
              <p className="text-sm text-warm-500 dark:text-warm-400 mb-6">
                Sign in with an authorized Google account to manage event
                submissions.
              </p>
              <button onClick={handleSignIn} className="btn-primary w-full">
                Sign in with Google
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-warm-500 dark:text-warm-400 mb-6">
                {user.email} is not authorized to access this page.
              </p>
              <button
                onClick={() => signOut(getFirebaseAuth())}
                className="btn-primary w-full"
              >
                Sign out
              </button>
            </>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-warm-500 dark:text-warm-400 hover:text-uta-orange transition-colors mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-warm-500 dark:text-warm-400 hover:text-uta-orange transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to events
            </Link>
            <h1 className="text-2xl font-bold text-warm-900 dark:text-warm-100">
              Admin
            </h1>
            <p className="text-sm text-warm-500 dark:text-warm-400">
              Signed in as {user.email}
            </p>
          </div>
          <button
            onClick={() => signOut(getFirebaseAuth())}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300 hover:bg-warm-200 dark:hover:bg-warm-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>

        {actionError && (
          <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-6">
            {actionError}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-warm-500 dark:text-warm-400">
            Loading events...
          </p>
        ) : (
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-bold text-warm-900 dark:text-warm-100 mb-4">
                Pending review ({pendingEvents.length})
              </h2>
              {pendingEvents.length === 0 ? (
                <p className="text-sm text-warm-500 dark:text-warm-400">
                  No pending submissions.
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingEvents.map((event) =>
                    editingId === event.id ? (
                      <div
                        key={event.id}
                        className="bg-white dark:bg-warm-900 rounded-2xl border border-warm-200 dark:border-warm-800 shadow-soft p-5"
                      >
                        <EventForm
                          initialValues={event}
                          submitLabel="Save changes"
                          onSubmit={(values) => handleSaveEdit(event.id!, values)}
                          onCancel={() => setEditingId(null)}
                        />
                      </div>
                    ) : (
                      <AdminEventCard
                        key={event.id}
                        event={event}
                        pending
                        onApprove={handleApprove}
                        onDelete={(id) => handleDelete(id, true)}
                        onEdit={setEditingId}
                      />
                    )
                  )}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-bold text-warm-900 dark:text-warm-100 mb-4">
                Live events ({liveEvents.length})
              </h2>
              {liveEvents.length === 0 ? (
                <p className="text-sm text-warm-500 dark:text-warm-400">
                  No approved submitted events.
                </p>
              ) : (
                <div className="space-y-4">
                  {liveEvents.map((event) =>
                    editingId === event.id ? (
                      <div
                        key={event.id}
                        className="bg-white dark:bg-warm-900 rounded-2xl border border-warm-200 dark:border-warm-800 shadow-soft p-5"
                      >
                        <EventForm
                          initialValues={event}
                          submitLabel="Save changes"
                          onSubmit={(values) => handleSaveEdit(event.id!, values)}
                          onCancel={() => setEditingId(null)}
                        />
                      </div>
                    ) : (
                      <AdminEventCard
                        key={event.id}
                        event={event}
                        pending={false}
                        onApprove={handleApprove}
                        onDelete={(id) => handleDelete(id, false)}
                        onEdit={setEditingId}
                      />
                    )
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
