import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PoliticosService } from '../../../politicos/politicos.service';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../../../stores/parliamentarians/parliamentarians.reducer';
import * as extenso from 'extenso';
import { Chart, registerables } from 'chart.js';
import { RoutesReducerInterface } from '../../../stores/routes/route.reducer';
import { setSelectedRoute } from '../../../stores/routes/route.actions';
import { RouteEnum } from '../../../constants/route-enum';
import { PARLIAMENTARIAN_TO_CAMARA_ID_MAP } from '../../../politicos/parlamentares-map';

Chart.register(...registerables);

@Component({
  selector: 'app-expenditure',
  templateUrl: './expenditure.component.html',
  styleUrls: ['./expenditure.component.scss'],
})
export class ExpenditureComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  conversation;
  expenditure;
  myChart;
  camaraDespesas: any[] = [];
  currentPage = 1;
  itemsPerPage = 20;
  loadingReceipts = false;
  selectedYear: number = 2025; 
  selectedMonth: number | null = null;
  totalReceipts = 0;
  apiError: string | null = null;
  showComparativeTable = true;
  months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Fev' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Abr' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Ago' },
    { value: 9, label: 'Set' },
    { value: 10, label: 'Out' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dez' }
  ];

  constructor(
    private politicosService: PoliticosService,
    private store: Store<{
      parliamentarians: parliamentariansReducerInterface;
      route: RoutesReducerInterface;
    }>
  ) {
    store.select('parliamentarians')
      .pipe(takeUntil(this.destroy$))
      .subscribe(parliamentarians => {
        this.conversation = parliamentarians.currentConversation;
        
        // Add null check to prevent errors
        if (!this.conversation || !this.conversation.parliamentarianRanking) {
          console.warn('Conversation or parliamentarianRanking not available yet');
          return;
        }
        
        this.politicosService
          .getExpenditureById(
            this.conversation.parliamentarianRanking.parliamentarianId
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe(expenditure => {
            this.expenditure = expenditure;
            if (this.myChart) this.myChart.destroy();
            this.loadChart();
            
            // Load Câmara expenses
            this.loadCamaraDespesas();
          });
      });

    store.dispatch(setSelectedRoute({ route: RouteEnum.EXPENDITURE }));
  }

  ngOnInit(): void {
    // Scroll to top when component initializes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  reaisPorExtenso(amount): string {
    return !amount
      ? ''
      : extenso(amount.toString().replace('.', ','), {
          mode: 'currency',
          currency: { type: 'BRL' },
        });
  }

  loadChart(): void {
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');

    const percentTotalSpent = Math.round(
      (100 * this.expenditure.cotaTotalGastou) / this.expenditure.cotaTotal
    );
    const percentTotalSaved = Math.round(
      (100 * this.expenditure.cotaTotalEconomizou) / this.expenditure.cotaTotal
    );

    const plugin = {
      id: 'tooltips',

      afterDraw(chart: Chart) {
        chart.ctx.save();

        chart.data.datasets.forEach((_dataset, i) => {
          chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
            const { x, y } = datapoint.tooltipPosition();

            const text = `${chart.data.labels[index]}: ${chart.data.datasets[i].data[index]} %`;
            const textWidth = ctx.measureText(text).width;
            chart.ctx.fillStyle = 'rgba(0,0,0,0.8)';
            chart.ctx.fillRect(
              x - (textWidth + 10) / 2,
              y - 25,
              textWidth + 10,
              20
            );

            chart.ctx.beginPath();
            chart.ctx.moveTo(x, y);
            chart.ctx.lineTo(x - 5, y - 5);
            chart.ctx.lineTo(x + 5, y - 5);
            chart.ctx.fill();
            chart.ctx.restore();

            chart.ctx.font = '12px Arial';
            chart.ctx.fillStyle = 'white';
            chart.ctx.fillText(text, x - textWidth / 2, y - 15);
            chart.ctx.restore();
          });
        });
      },
    };

    this.myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Gastou', 'Economizou'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [percentTotalSpent, percentTotalSaved],
            backgroundColor: ['#d10202', 'green'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            enabled: false,
          },
        },
      },
      plugins: [plugin],
    });
  }

  loadCamaraDespesas(): void {
    if (!this.conversation || !this.conversation.parliamentarianRanking) {
      console.error('Conversation or parliamentarianRanking is not available');
      this.apiError = 'Dados do parlamentar não disponíveis';
      this.loadingReceipts = false;
      return;
    }

    // Prevent multiple simultaneous calls
    if (this.loadingReceipts) {
      console.log('Already loading receipts, skipping duplicate call');
      return;
    }

    this.loadingReceipts = true;
    this.apiError = null;
    const parliamentarianId = this.conversation.parliamentarianRanking.parliamentarianId;
    
    console.log('Loading receipts for parliamentarian ID:', parliamentarianId);
    console.log('Year:', this.selectedYear, 'Month:', this.selectedMonth);
    
    let request: Observable<any>;
    
    if (this.selectedMonth) {
      request = this.politicosService.getCamaraDespesasByParliamentarianIdAndAnoMes(
        parliamentarianId,
        this.selectedYear,
        this.selectedMonth
      );
    } else {
      request = this.politicosService.getCamaraDespesasByParliamentarianIdAndAno(
        parliamentarianId,
        this.selectedYear
      );
    }
    
    request.subscribe({
      next: (response) => {
        console.log('API Response:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', response ? Object.keys(response) : 'null');
        console.log('Response.dados:', response?.dados);
        console.log('Response.dados type:', Array.isArray(response?.dados));
        console.log('Receipts found:', response?.dados?.length || 0);
        
        // Ensure we have the dados array - handle different response structures
        let dados = [];
        if (response) {
          if (Array.isArray(response.dados)) {
            dados = response.dados;
          } else if (Array.isArray(response)) {
            // Response might be the array directly
            dados = response;
          } else if (response.data && Array.isArray(response.data)) {
            dados = response.data;
          }
        }
        
        console.log('Final dados array:', dados);
        console.log('Dados length:', dados.length);
        
        // Set data synchronously
        this.camaraDespesas = dados;
        this.totalReceipts = this.camaraDespesas.length;
        this.loadingReceipts = false;
        this.apiError = null;
        
        // Update comparative table data and total expenses
        this.updateComparativeTableData();
        this.updateTotalExpenses();
        
        // Scroll to top after data loads
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        console.log('After setting - camaraDespesas.length:', this.camaraDespesas.length);
        console.log('loadingReceipts set to:', this.loadingReceipts);
        
        if (this.camaraDespesas.length === 0) {
          console.warn('No receipts found. Try a different year or check if the parliamentarian has expenses.');
        }
      },
      error: (error) => {
        console.error('Erro ao buscar despesas da Câmara:', error);
        console.error('Error details:', {
          message: error.message || error,
          status: error.status,
          statusText: error.statusText,
          details: error.details,
          parliamentarianId: parliamentarianId,
          year: this.selectedYear,
          month: this.selectedMonth
        });
        
        // Always reset loading state on error
        this.camaraDespesas = [];
        this.totalReceipts = 0;
        this.loadingReceipts = false;
        
        // Set user-friendly error message
        const errorMessage = typeof error === 'string' ? error : (error.message || error.statusText || 'Erro desconhecido');
        
        if (errorMessage.includes('No Câmara ID mapping')) {
          this.apiError = 'Este parlamentar não possui mapeamento para a API da Câmara.';
        } else if (errorMessage.includes('Recurso não encontrado') || errorMessage.includes('404')) {
          // Check if it's a year issue
          if (errorMessage.includes('ano=2025') || this.selectedYear === 2025) {
            this.apiError = `Nenhum dado encontrado para ${this.selectedYear}. Tente selecionar ${this.selectedYear - 1} ou outro ano.`;
          } else {
            this.apiError = `Recurso não encontrado: ${errorMessage}. Verifique o ID do deputado e o ano selecionado.`;
          }
        } else if (error.status === 403 || error.status === 0) {
          this.apiError = 'Erro de CORS ou proxy. Verifique se o servidor de desenvolvimento está rodando e o proxy está configurado corretamente.';
        } else if (error.status === 404) {
          this.apiError = `Deputado não encontrado ou sem dados para ${this.selectedYear}. Tente outro ano.`;
        } else {
          this.apiError = `Erro ao buscar recibos: ${errorMessage}. Status: ${error.status || 'N/A'}. Verifique o console para mais detalhes.`;
        }
      }
    });
  }

  get paginatedReceipts(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.camaraDespesas.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.camaraDespesas.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private scrollToFilterBar(): void {
    setTimeout(() => {
      const filterBar = document.querySelector('[data-filter-bar]');
      if (filterBar) {
        filterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback: scroll to top if filter bar not found
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }

  onYearChange(): void {
    this.currentPage = 1;
    this.loadCamaraDespesas();
    this.scrollToFilterBar();
  }

  selectMonth(month: number): void {
    // Toggle: if same month is clicked, deselect it
    if (this.selectedMonth === month) {
      this.selectedMonth = null;
    } else {
      this.selectedMonth = month;
    }
    this.currentPage = 1;
    this.loadCamaraDespesas();
    this.scrollToFilterBar();
  }

  onMonthChange(): void {
    this.currentPage = 1;
    this.loadCamaraDespesas();
    this.scrollToFilterBar();
  }

  clearMonthFilter(): void {
    this.selectedMonth = null;
    this.currentPage = 1;
    this.loadCamaraDespesas();
    this.scrollToFilterBar();
  }

  openReceipt(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  private _comparativeTableData: any[] = [];
  
  get comparativeTableData(): any[] {
    return this._comparativeTableData;
  }
  
  private updateComparativeTableData(): void {
    if (!this.camaraDespesas || this.camaraDespesas.length === 0) {
      this._comparativeTableData = [];
      return;
    }

    // Group expenses by type and calculate totals
    const expensesByType: { [key: string]: { tipoDespesa: string; valor: number; quantidade: number } } = 
      this.camaraDespesas.reduce((acc: any, despesa: any) => {
        const tipo = despesa.tipoDespesa || 'Outros';
        const valor = despesa.valor || despesa.valorLiquido || 0;
        
        if (!acc[tipo]) {
          acc[tipo] = {
            tipoDespesa: tipo,
            valor: 0,
            quantidade: 0
          };
        }
        
        acc[tipo].valor += valor;
        acc[tipo].quantidade += 1;
        
        return acc;
      }, {});

    // Convert to array and calculate percentage
    const total = Object.values(expensesByType).reduce((sum: number, item: any) => {
      return sum + (item.valor || 0);
    }, 0);
    
    this._comparativeTableData = Object.values(expensesByType)
      .map((item: any) => ({
        ...item,
        percentual: total > 0 ? ((item.valor || 0) / total * 100) : 0
      }))
      .sort((a: any, b: any) => (b.valor || 0) - (a.valor || 0));
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.myChart) {
      this.myChart.destroy();
    }
  }

  private _totalExpenses: number = 0;
  
  get totalExpenses(): number {
    return this._totalExpenses;
  }
  
  private updateTotalExpenses(): void {
    if (!this.camaraDespesas || this.camaraDespesas.length === 0) {
      this._totalExpenses = 0;
      return;
    }
    this._totalExpenses = this.camaraDespesas.reduce((sum: number, despesa: any) => {
      const valor = despesa.valor || despesa.valorLiquido || 0;
      return sum + (typeof valor === 'number' ? valor : 0);
    }, 0);
  }

  openCamaraSite(): void {
    const url = this.buildCamaraUrl();
    window.open(url, '_blank');
  }

  openCamaraComparativeTable(): void {
    const url = this.buildCamaraUrl() + '#tabela-comparativa';
    window.open(url, '_blank');
  }

  private buildCamaraUrl(): string {
    // Base URL for Câmara transparency portal
    let url = 'https://www.camara.leg.br/transparencia/gastos-parlamentares';
    
    const params: string[] = [];
    
    // Current legislature (57)
    params.push('legislatura=57');
    
    // Year filter
    if (this.selectedYear) {
      params.push(`ano=${this.selectedYear}`);
    }
    
    // Month filter (empty if not selected, otherwise use month number)
    if (this.selectedMonth) {
      params.push(`mes=${this.selectedMonth}`);
    } else {
      params.push('mes=');
    }
    
    // Search by deputy
    params.push('por=deputado');
    
    // Deputy ID (Câmara ID)
    if (this.conversation && this.conversation.parliamentarianRanking) {
      const parliamentarianId = this.conversation.parliamentarianRanking.parliamentarianId;
      const camaraId = PARLIAMENTARIAN_TO_CAMARA_ID_MAP[parliamentarianId];
      
      if (camaraId) {
        params.push(`deputado=${camaraId}`);
      } else {
        params.push('deputado=');
        console.warn(`No Câmara ID mapping found for parliamentarian ID: ${parliamentarianId}`);
      }
    } else {
      params.push('deputado=');
    }
    
    // Empty filters for UF and Partido
    params.push('uf=');
    params.push('partido=');
    
    // Construct final URL
    return url + '?' + params.join('&');
  }
}
