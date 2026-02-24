import { Parser } from 'json2csv';
import { Application, APP_STAGES } from '../models/Application.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

const normalizePayload = (payload) => ({
  ...payload,
  appliedDate: payload.appliedDate ? new Date(payload.appliedDate) : null,
  followUpDate: payload.followUpDate ? new Date(payload.followUpDate) : null
});

const toWeekKey = (date) => {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const listApplications = asyncHandler(async (req, res) => {
  const items = await Application.find({ userId: req.user.id }).sort({ updatedAt: -1 });
  res.json({ items });
});

export const createApplication = asyncHandler(async (req, res) => {
  const app = await Application.create({
    ...normalizePayload(req.body),
    userId: req.user.id
  });

  res.status(201).json({ item: app });
});

export const getApplication = asyncHandler(async (req, res) => {
  const app = await Application.findOne({ _id: req.params.id, userId: req.user.id });
  if (!app) throw new ApiError(404, 'Application not found');
  res.json({ item: app });
});

export const updateApplication = asyncHandler(async (req, res) => {
  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    normalizePayload(req.body),
    { new: true, runValidators: true }
  );

  if (!app) throw new ApiError(404, 'Application not found');
  res.json({ item: app });
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const app = await Application.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!app) throw new ApiError(404, 'Application not found');
  res.status(204).send();
});

export const getStats = asyncHandler(async (req, res) => {
  const items = await Application.find({ userId: req.user.id }).sort({ createdAt: 1 }).lean();

  const stageCounts = APP_STAGES.reduce((acc, stage) => ({ ...acc, [stage]: 0 }), {});
  const weeklyMap = new Map();
  const today = startOfToday();

  for (const item of items) {
    stageCounts[item.stage] += 1;

    const weekKey = toWeekKey(new Date(item.createdAt));
    weeklyMap.set(weekKey, (weeklyMap.get(weekKey) || 0) + 1);
  }

  const total = items.length;
  const interviews = stageCounts.Interview;
  const offers = stageCounts.Offer;
  const rejections = stageCounts.Rejected;
  const conversionRate = total > 0 ? Number(((offers / total) * 100).toFixed(1)) : 0;

  const overdueFollowUps = items.filter(
    (item) => item.followUpDate && new Date(item.followUpDate) < today && !['Offer', 'Rejected'].includes(item.stage)
  );

  const weeklyTrend = Array.from(weeklyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, count]) => ({ week, count }));

  const applicationsByStage = APP_STAGES.map((stage) => ({ stage, count: stageCounts[stage] }));

  res.json({
    summary: { total, interviews, offers, rejections, conversionRate },
    applicationsByStage,
    weeklyTrend,
    overdueFollowUps
  });
});

export const exportCsv = asyncHandler(async (req, res) => {
  const items = await Application.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
  const parser = new Parser({
    fields: [
      'company',
      'roleTitle',
      'location',
      'jobUrl',
      'stage',
      'appliedDate',
      'followUpDate',
      'notes',
      'createdAt',
      'updatedAt'
    ]
  });

  const csv = parser.parse(items);
  res.header('Content-Type', 'text/csv');
  res.attachment('jobtrackr-applications.csv');
  res.send(csv);
});
