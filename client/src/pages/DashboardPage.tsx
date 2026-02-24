import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { CalendarClock, Pencil, Plus, Trash2 } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ChartCard } from '../components/ui/ChartCard';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { AppFormModal } from '../components/AppFormModal';
import type { Application, Stage, StatsResponse } from '../types';
import { createApp, deleteApp, exportAppsCsv, fetchApps, fetchStats, updateApp } from '../api/apps';
import { formatDate } from '../utils/date';
import { STAGES, STAGE_STYLES } from '../utils/stage';
import { useToast } from '../context/ToastContext';

const defaultStats: StatsResponse = {
  summary: { total: 0, interviews: 0, offers: 0, rejections: 0, conversionRate: 0 },
  applicationsByStage: STAGES.map((stage) => ({ stage, count: 0 })),
  weeklyTrend: [],
  overdueFollowUps: []
};

export const DashboardPage = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [stats, setStats] = useState<StatsResponse>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const { pushToast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [appsData, statsData] = await Promise.all([fetchApps(), fetchStats()]);
      setApps(appsData);
      setStats(statsData);
    } catch {
      pushToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onExport = async () => {
    try {
      await exportAppsCsv();
      pushToast('CSV exported');
    } catch {
      pushToast('Export failed', 'error');
    }
  };

  const handleSave = async (payload: Parameters<typeof createApp>[0]) => {
    try {
      if (editing) {
        await updateApp(editing._id, payload);
        pushToast('Application updated');
      } else {
        await createApp(payload);
        pushToast('Application created');
      }
      await load();
      setEditing(null);
    } catch {
      pushToast('Save failed. Please check your data.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApp(id);
      pushToast('Application removed');
      await load();
    } catch {
      pushToast('Delete failed', 'error');
    }
  };

  const handleStageChange = async (id: string, stage: Stage) => {
    try {
      await updateApp(id, { stage });
      await load();
    } catch {
      pushToast('Stage update failed', 'error');
    }
  };

  const summaryCards = useMemo(
    () => [
      { label: 'Total Applications', value: stats.summary.total },
      { label: 'Interviews', value: stats.summary.interviews },
      { label: 'Offers', value: stats.summary.offers },
      { label: 'Rejections', value: stats.summary.rejections },
      { label: 'Conversion Rate', value: `${stats.summary.conversionRate}%` }
    ],
    [stats.summary]
  );

  return (
    <AppShell>
      <Header onExport={onExport} />
      <section id="overview" className="mx-auto max-w-7xl space-y-6 px-4 py-5 md:px-8 md:py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">Your application pipeline</h3>
            <p className="text-sm text-textMuted">Monitor momentum, close loops, and focus your next move.</p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setOpenModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-5">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-28" />)
            : summaryCards.map((item) => (
                <Card key={item.label}>
                  <p className="text-sm text-textMuted">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">{item.value}</p>
                </Card>
              ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <ChartCard title="Applications by stage" subtitle="Current pipeline distribution">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.applicationsByStage}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="rgb(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Weekly application trend" subtitle="Consistency across recent weeks">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="rgb(var(--accent))" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-danger" />
              <h3 className="font-semibold tracking-tight">Follow-up reminders</h3>
              {stats.overdueFollowUps.length > 0 ? (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-danger/15 px-2 py-1 text-xs text-danger">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-danger" />
                  {stats.overdueFollowUps.length} overdue
                </span>
              ) : null}
            </div>

            <div className="space-y-2">
              {stats.overdueFollowUps.length === 0 ? (
                <p className="rounded-xl border border-border bg-panelSoft p-3 text-sm text-textMuted">
                  No overdue follow-ups right now.
                </p>
              ) : (
                stats.overdueFollowUps.slice(0, 5).map((item) => (
                  <div key={item._id} className="rounded-xl border border-border bg-panelSoft p-3">
                    <p className="text-sm font-medium">
                      {item.company} • {item.roleTitle}
                    </p>
                    <p className="text-xs text-textMuted">Follow-up date: {formatDate(item.followUpDate)}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold tracking-tight">Applications</h3>
            <p className="text-sm text-textMuted">Inline stage updates and quick editing</p>
          </div>

          {apps.length === 0 && !loading ? (
            <div className="grid min-h-44 place-items-center rounded-xl border border-dashed border-border bg-panelSoft text-center">
              <div>
                <p className="text-base font-medium">No applications yet</p>
                <p className="text-sm text-textMuted">Add your first role to start tracking momentum.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {apps.map((item) => (
                  <div key={item._id} className="rounded-xl border border-border bg-panelSoft p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.company}</p>
                        <p className="text-xs text-textMuted">{item.roleTitle}</p>
                        <p className="text-xs text-textMuted">{item.location || 'Location not added'}</p>
                      </div>
                      <Badge label={item.stage} className={STAGE_STYLES[item.stage]} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-textMuted">Applied</p>
                        <p>{formatDate(item.appliedDate)}</p>
                      </div>
                      <div>
                        <p className="text-textMuted">Follow-up</p>
                        <p>{formatDate(item.followUpDate)}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <select
                        className="focus-ring h-9 flex-1 rounded-lg border border-border bg-panel px-2 text-xs"
                        value={item.stage}
                        onChange={(event) => void handleStageChange(item._id, event.target.value as Stage)}
                      >
                        {STAGES.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                      <button
                        className="focus-ring rounded-lg p-2 hover:bg-panel"
                        onClick={() => {
                          setEditing(item);
                          setOpenModal(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="focus-ring rounded-lg p-2 hover:bg-panel" onClick={() => void handleDelete(item._id)}>
                        <Trash2 className="h-4 w-4 text-danger" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="text-textMuted">
                      <th className="pb-3">Company</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Stage</th>
                      <th className="pb-3">Applied</th>
                      <th className="pb-3">Follow-up</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {apps.map((item) => (
                      <tr key={item._id} className="align-top">
                        <td className="py-3">
                          <p className="font-medium">{item.company}</p>
                          <p className="text-xs text-textMuted">{item.location || 'Location not added'}</p>
                        </td>
                        <td className="py-3">{item.roleTitle}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Badge label={item.stage} className={STAGE_STYLES[item.stage]} />
                            <select
                              className="focus-ring rounded-lg border border-border bg-panel px-2 py-1 text-xs"
                              value={item.stage}
                              onChange={(event) => void handleStageChange(item._id, event.target.value as Stage)}
                            >
                              {STAGES.map((stage) => (
                                <option key={stage} value={stage}>
                                  {stage}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="py-3">{formatDate(item.appliedDate)}</td>
                        <td className="py-3">{formatDate(item.followUpDate)}</td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            <button
                              className="focus-ring rounded-lg p-2 hover:bg-panelSoft"
                              onClick={() => {
                                setEditing(item);
                                setOpenModal(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button className="focus-ring rounded-lg p-2 hover:bg-panelSoft" onClick={() => void handleDelete(item._id)}>
                              <Trash2 className="h-4 w-4 text-danger" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      </section>

      <AppFormModal open={openModal} editing={editing} onClose={() => setOpenModal(false)} onSubmit={handleSave} />
    </AppShell>
  );
};
