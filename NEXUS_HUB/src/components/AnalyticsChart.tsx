import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Task } from '../types';

interface AnalyticsChartProps {
  tasks: Task[];
}

export function AnalyticsChart({ tasks }: AnalyticsChartProps) {
  // Compute counts
  const total = tasks.length;
  const toDoCount = tasks.filter(t => t.status === 'TO_DO').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const reviewCount = tasks.filter(t => t.status === 'REVIEW').length;
  const doneCount = tasks.filter(t => t.status === 'DONE').length;

  const data = [
    { name: 'Completed', value: doneCount, color: '#2F6B3F' }, // forest green
    { name: 'Review Needed', value: reviewCount, color: '#F7C85C' }, // gold
    { name: 'In Progress', value: inProgressCount, color: '#7FB77E' }, // sage green
    { name: 'To Do', value: toDoCount, color: '#94a3b8' } // slate-400
  ].filter(d => d.value > 0);

  // If no tasks, show a default empty slice just for visualization
  const hasTasks = total > 0;
  const chartData = hasTasks ? data : [{ name: 'No Tasks', value: 1, color: '#e2e8f0' }];

  const completePercent = hasTasks ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div id="analytics-chart-container" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex-1 w-full">
        <h3 className="font-semibold text-slate-800 text-lg mb-1">Progress Analytics</h3>
        <p className="text-sm text-slate-500 mb-4">
          Real-time analysis of project milestone assignments and completed scopes.
        </p>

        {hasTasks ? (
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-semibold text-slate-600 border-b border-slate-100 pb-2">
              <span>Status Segment</span>
              <span>Task Frequency</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-3 h-3 rounded-full bg-forest" /> Done
              </span>
              <span className="font-mono text-slate-600 font-semibold">{doneCount}/{total} ({Math.round((doneCount/total)*100)}%)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-3 h-3 rounded-full bg-gold" /> In Review
              </span>
              <span className="font-mono text-slate-600 font-semibold">{reviewCount}/{total} ({Math.round((reviewCount/total)*100)}%)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-3 h-3 rounded-full bg-sage" /> In Progress
              </span>
              <span className="font-mono text-slate-600 font-semibold">{inProgressCount}/{total} ({Math.round((inProgressCount/total)*100)}%)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-3 h-3 rounded-full bg-slate-400" /> To Do
              </span>
              <span className="font-mono text-slate-600 font-semibold">{toDoCount}/{total} ({Math.round((toDoCount/total)*100)}%)</span>
            </div>
          </div>
        ) : (
          <div className="text-slate-400 text-sm italic py-8 text-center bg-slate-50 rounded-lg">
            Create tasks to begin computing analytics metrics.
          </div>
        )}
      </div>

      <div className="relative w-48 h-48 flex items-center justify-center flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [hasTasks ? `${value} tasks` : '0 tasks', name]}
              contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Labeled Overall Completion Rate in Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointing-events-none">
          <span className="text-2xl font-bold font-mono text-slate-800">{completePercent}%</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Completed</span>
        </div>
      </div>
    </div>
  );
}
