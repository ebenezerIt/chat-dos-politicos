import { Component, OnInit } from '@angular/core';
import { PoliticosService } from '../../../politicos/politicos.service';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../../../stores/parliamentarians/parliamentarians.reducer';
import * as extenso from 'extenso'
import { Chart, registerables } from 'chart.js';
import { EmptyObject } from 'chart.js/types/basic';
import { routesReducerInterface } from '../../../stores/routes/route.reducer';
import { setSelectedRoute } from '../../../stores/routes/route.actions';
import { RouteEnum } from '../../../enums/route-enum';

Chart.register(...registerables);

@Component({
    selector: 'app-spending',
    templateUrl: './spending.component.html',
    styleUrls: ['./spending.component.scss']
})
export class SpendingComponent implements OnInit {
    conversation;
    expenses;
    myChart;

    constructor(private politicosService: PoliticosService,
                private store: Store<{ parliamentarians: parliamentariansReducerInterface, route: routesReducerInterface }>) {
        store.select('parliamentarians').subscribe(parliamentarians => {
            this.conversation = parliamentarians.currentConversation;
            this.politicosService.getDesperdicioById(this.conversation.parliamentarianRanking.parliamentarianId).subscribe((expenses) => {
                this.expenses = expenses
                // @TODO
                // console.log("expenses", this.expenses)
                if (this.myChart) this.myChart.destroy();
                this.loadChart();
            })
        });

        store.dispatch(setSelectedRoute({route: RouteEnum.Spending}));

    }


    ngOnInit(): void {
    }

    reaisPorExtenso(amount): string {
        return !amount ? '' : extenso(amount.toString().replace('.', ','), {mode: 'currency', currency: {type: 'BRL'}});
    }

    loadChart(): void {
        const canvas = document.getElementById('chart') as HTMLCanvasElement;
        const ctx = canvas?.getContext('2d');

        const percentTotalSpent = Math.round(( 100 * this.expenses.cotaTotalGastou) / this.expenses.cotaTotal)
        const percentTotalSaved = Math.round(( 100 * this.expenses.cotaTotalEconomizou) / this.expenses.cotaTotal)

        const plugin = {
            id: "tooltips",

            afterDraw(chart: Chart, args, options) {
                const { ctx } = chart
                ctx.save();

                chart.data.datasets.forEach((dataset, i) => {
                    chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
                        const {x, y} = datapoint.tooltipPosition();

                        const text = chart.data.labels[index]+ ': '+ chart.data.datasets[i].data[index]+ ' %';
                        const textWidth = ctx.measureText(text).width
                        ctx.fillStyle = 'rgba(0,0,0,0.8)'
                        ctx.fillRect(x - ((textWidth + 10) / 2), y - 25, textWidth + 10, 20)

                        ctx.beginPath();
                        ctx.moveTo(x, y)
                        ctx.lineTo(x - 5, y - 5);
                        ctx.lineTo(x + 5, y - 5);
                        ctx.fill();
                        ctx.restore();

                        ctx.font = '12px Arial';
                        ctx.fillStyle = 'white';
                        ctx.fillText(text, x - (textWidth / 2), y - 15)
                        ctx.restore();

                    })
                })
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
        },);

    }

}
