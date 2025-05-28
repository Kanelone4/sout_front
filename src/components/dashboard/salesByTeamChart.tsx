import { Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { MoreHorizontal } from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const SalesByTeamChart = () => {
  const data = {
    labels: ['Équipe Nord', 'Équipe Sud', 'Équipe Est', 'Équipe Ouest', 'Équipe Centrale'],
    datasets: [{
      data: [450000, 320000, 280000, 410000, 185000],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#8B5CF6',
        '#EF4444'
      ],
      borderColor: [
        '#FFFFFF'
      ],
      borderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toLocaleString()} FCFA`;
          }
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Ventes par Équipe</h3>
        <button title="Options" className="p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default SalesByTeamChart;