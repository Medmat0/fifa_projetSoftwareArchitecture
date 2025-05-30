import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerStatsService } from '../../services/manager-stats.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-stats-dashboard',
  templateUrl: './stats-dashboard.component.html',
  styleUrls: ['./stats-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class StatsDashboardComponent implements OnInit {
  private charts: { [key: string]: Chart } = {};

  constructor(private statsService: ManagerStatsService) {}

  ngOnInit() {
    this.loadStats();
  }
  private loadStats() {
    this.statsService.getReservationStats().subscribe({
      next: (data) => {
        console.log('Stats data received:', data);
        if (!data || (!data.byDay && !data.byWeek && !data.byMonth)) {
          console.error('Invalid data format received:', data);
          return;
        }
        this.createDayChart(data.byDay);
        this.createWeekChart(data.byWeek);
        this.createMonthChart(data.byMonth);
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        // TODO: Add a MatSnackBar or similar to show error to user
      }
    });
  }
  private createDayChart(data: { [key: string]: number }) {
    const canvas = document.getElementById('dayChart') as HTMLCanvasElement;
    if (!canvas) return;

    // Format dates to be more readable
    const formattedData = Object.entries(data).reduce((acc, [date, value]) => {
      const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });
      acc[formattedDate] = value;
      return acc;
    }, {} as { [key: string]: number });

    const labels = Object.keys(formattedData);
    const values = Object.values(formattedData);

    if (this.charts['day']) {
      this.charts['day'].destroy();
    }

    this.charts['day'] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Réservations par jour',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }
  private createWeekChart(data: { [key: string]: number }) {
    const canvas = document.getElementById('weekChart') as HTMLCanvasElement;
    if (!canvas) return;

    // Format week labels to be more readable
    const formattedData = Object.entries(data).reduce((acc, [weekKey, value]) => {
      const [year, week] = weekKey.split('-W');
      const formattedWeek = `Semaine ${week}`;
      acc[formattedWeek] = value;
      return acc;
    }, {} as { [key: string]: number });

    const labels = Object.keys(formattedData);
    const values = Object.values(formattedData);

    if (this.charts['week']) {
      this.charts['week'].destroy();
    }

    this.charts['week'] = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Réservations par semaine',
          data: values,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }
  private createMonthChart(data: { [key: string]: number }) {
    const canvas = document.getElementById('monthChart') as HTMLCanvasElement;
    if (!canvas) return;

    // Format month labels to be more readable
    const formattedData = Object.entries(data).reduce((acc, [monthKey, value]) => {
      const [year, month] = monthKey.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      const formattedMonth = date.toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric'
      });
      acc[formattedMonth] = value;
      return acc;
    }, {} as { [key: string]: number });

    const labels = Object.keys(formattedData);
    const values = Object.values(formattedData);

    if (this.charts['month']) {
      this.charts['month'].destroy();
    }

    this.charts['month'] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Réservations par mois',
          data: values,
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }
}
