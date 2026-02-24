import { z } from 'zod';
import { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { Select } from './ui/Select';
import { STAGES } from '../utils/stage';
import type { Application, Stage } from '../types';
import { toDateInput, toIsoDate } from '../utils/date';
import type { AppPayload } from '../api/apps';

const STAGE_VALUES = ['Wishlist', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected'] as const;

const schema = z.object({
  company: z.string().trim().min(1, 'Company is required'),
  roleTitle: z.string().trim().min(1, 'Role title is required'),
  location: z.string().trim().optional(),
  jobUrl: z.string().trim().url('Enter a valid URL').or(z.literal('')),
  stage: z.enum(STAGE_VALUES),
  appliedDate: z.string().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().max(3000, 'Notes are too long').optional()
});

type FormState = {
  company: string;
  roleTitle: string;
  location: string;
  jobUrl: string;
  stage: Stage;
  appliedDate: string;
  followUpDate: string;
  notes: string;
};

const toForm = (app?: Application | null): FormState => ({
  company: app?.company ?? '',
  roleTitle: app?.roleTitle ?? '',
  location: app?.location ?? '',
  jobUrl: app?.jobUrl ?? '',
  stage: app?.stage ?? 'Wishlist',
  appliedDate: toDateInput(app?.appliedDate),
  followUpDate: toDateInput(app?.followUpDate),
  notes: app?.notes ?? ''
});

interface Props {
  open: boolean;
  editing?: Application | null;
  onClose: () => void;
  onSubmit: (payload: AppPayload) => Promise<void>;
}

export const AppFormModal = ({ open, editing, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState<FormState>(toForm(editing));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(toForm(editing));
    setErrors({});
  }, [editing, open]);

  const handleSave = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        nextErrors[issue.path.join('.')] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      await onSubmit({
        ...parsed.data,
        appliedDate: toIsoDate(parsed.data.appliedDate),
        followUpDate: toIsoDate(parsed.data.followUpDate)
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={editing ? 'Edit application' : 'Add application'}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Company"
          value={form.company}
          onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
          error={errors.company}
        />
        <Input
          placeholder="Role title"
          value={form.roleTitle}
          onChange={(event) => setForm((prev) => ({ ...prev, roleTitle: event.target.value }))}
          error={errors.roleTitle}
        />
        <Input
          placeholder="Location"
          value={form.location}
          onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
          error={errors.location}
        />
        <Input
          placeholder="https://job-url.com"
          value={form.jobUrl}
          onChange={(event) => setForm((prev) => ({ ...prev, jobUrl: event.target.value }))}
          error={errors.jobUrl}
        />
        <Select
          value={form.stage}
          onChange={(event) => setForm((prev) => ({ ...prev, stage: event.target.value as Stage }))}
          error={errors.stage}
        >
          {STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </Select>
        <Input
          type="date"
          value={form.appliedDate}
          onChange={(event) => setForm((prev) => ({ ...prev, appliedDate: event.target.value }))}
          error={errors.appliedDate}
        />
        <Input
          type="date"
          value={form.followUpDate}
          onChange={(event) => setForm((prev) => ({ ...prev, followUpDate: event.target.value }))}
          error={errors.followUpDate}
        />
      </div>

      <div className="mt-4">
        <textarea
          className="focus-ring min-h-24 w-full rounded-xl border border-border bg-panelSoft p-3 text-sm"
          placeholder="Notes"
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
        />
        {errors.notes ? <p className="mt-1 text-xs text-danger">{errors.notes}</p> : null}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => void handleSave()} disabled={saving}>
          {saving ? 'Saving...' : editing ? 'Save changes' : 'Create'}
        </Button>
      </div>
    </Modal>
  );
};
