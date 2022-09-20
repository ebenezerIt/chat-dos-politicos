import { Component } from '@angular/core';
import { PoliticosService } from '../../../politicos/politicos.service';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../../../stores/parliamentarians/parliamentarians.reducer';
import * as extenso from 'extenso';
import { Chart, registerables } from 'chart.js';
import { RoutesReducerInterface } from '../../../stores/routes/route.reducer';
import { setSelectedRoute } from '../../../stores/routes/route.actions';
import { RouteEnum } from '../../../constants/route-enum';

Chart.register(...registerables);

@Component({
    selector: 'app-expenditure',
    templateUrl: './expenditure.component.html',
    styleUrls: ['./expenditure.component.scss']
})
export class ExpenditureComponent {
    conversation;
    expenditure;
    myChart;

    constructor(private politicosService: PoliticosService,
                private store: Store<{ parliamentarians: parliamentariansReducerInterface, route: RoutesReducerInterface }>) {
        store.select('parliamentarians').subscribe(parliamentarians => {
            this.conversation = parliamentarians.currentConversation;
            this.politicosService.getExpenditureById(this.conversation.parliamentarianRanking.parliamentarianId)
                .subscribe((expenditure) => {
                    this.expenditure = expenditure;
                    this.loadChart();
                });
        });

        store.dispatch(setSelectedRoute({route: RouteEnum.EXPENDITURE}));

    }

    reaisPorExtenso(amount): string {
        return !amount ? '' : extenso(amount.toString().replace('.', ','), {mode: 'currency', currency: {type: 'BRL'}});
    }

    loadChart(): void {
        const canvas = document.getElementById('chart') as HTMLCanvasElement;
        const ctx = canvas?.getContext('2d');

        const percentTotalSpent = Math.round((100 * this.expenditure.cotaTotalGastou) / this.expenditure.cotaTotal);
        const percentTotalSaved = Math.round((100 * this.expenditure.cotaTotalEconomizou) / this.expenditure.cotaTotal);

        const plugin = {
            id: 'tooltips',

            afterDraw(chart: Chart) {
                chart.ctx.save();

                chart.data.datasets.forEach((_dataset, i) => {
                    chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
                        const {x, y} = datapoint.tooltipPosition();

                        const text = `${chart.data.labels[index]}: ${chart.data.datasets[i].data[index]} %`;
                        const textWidth = ctx.measureText(text).width;
                        chart.ctx.fillStyle = 'rgba(0,0,0,0.8)';
                        chart.ctx.fillRect(x - ((textWidth + 10) / 2), y - 25, textWidth + 10, 20);

                        chart.ctx.beginPath();
                        chart.ctx.moveTo(x, y);
                        chart.ctx.lineTo(x - 5, y - 5);
                        chart.ctx.lineTo(x + 5, y - 5);
                        chart.ctx.fill();
                        chart.ctx.restore();

                        chart.ctx.font = '12px Arial';
                        chart.ctx.fillStyle = 'white';
                        chart.ctx.fillText(text, x - (textWidth / 2), y - 15);
                        chart.ctx.restore();

                    });
                });
            }
        };

        this.myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'Gastou',
                    'Economizou',
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [percentTotalSpent, percentTotalSaved],
                    backgroundColor: [
                        '#d10202',
                        'green',
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                plugins: {
                    tooltip: {
                        enabled: false
                    },

                }
            },
            plugins: [plugin]
        });

    }

}
