import { Order } from '../../api/admin';

interface StatsChartProps {
  orders: Order[];
}

const StatsChart = ({ orders }: StatsChartProps) => {
  // Calculate daily revenue for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyRevenue = last7Days.map((date) => {
    const dayOrders = orders.filter(
      (order) => order.createdAt.split('T')[0] === date && order.paymentStatus === 'PAID'
    );
    return dayOrders.reduce((sum, order) => sum + order.total, 0);
  });

  const maxRevenue = Math.max(...dailyRevenue, 1);

  // Calculate status distribution
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Przychód (ostatnie 7 dni)</h3>
        <div className="space-y-2">
          {last7Days.map((date, index) => {
            const revenue = dailyRevenue[index];
            const percentage = (revenue / maxRevenue) * 100;
            return (
              <div key={date} className="flex items-center gap-3">
                <div className="w-20 text-xs text-gray-600">
                  {new Date(date).toLocaleDateString('pl-PL', { weekday: 'short' })}
                </div>
                <div className="flex-1">
                  <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-pink-500 to-yellow-500 rounded-lg transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-900">
                      {revenue > 0 && `${revenue.toFixed(2)} zł`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Rozkład statusów zamówień</h3>
        <div className="space-y-3">
          {Object.entries(statusCounts).map(([status, count]) => {
            const percentage = (count / orders.length) * 100;
            return (
              <div key={status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{status}</span>
                  <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsChart;
