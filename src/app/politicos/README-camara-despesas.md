# Client da Câmara dos Deputados - Despesas

Este client permite acessar os dados de despesas dos deputados através da API oficial da Câmara dos Deputados.

## Endpoint Base
```
https://dadosabertos.camara.leg.br/api/v2
```

## Como Usar

### 1. Injeção do Client
```typescript
import { CamaraDespesasClient } from './camara-despesas.client';

constructor(private camaraDespesasClient: CamaraDespesasClient) {}
```

### 2. Métodos Disponíveis

#### Buscar todas as despesas de um deputado
```typescript
getDespesasByDeputadoId(
  deputadoId: number,
  ano?: number,
  mes?: number,
  pagina?: number,
  itens?: number
): Observable<CamaraDespesasResponse>
```

#### Buscar despesas por ano
```typescript
getDespesasByDeputadoIdAndAno(
  deputadoId: number,
  ano: number
): Observable<CamaraDespesasResponse>
```

#### Buscar despesas por ano e mês
```typescript
getDespesasByDeputadoIdAndAnoMes(
  deputadoId: number,
  ano: number,
  mes: number
): Observable<CamaraDespesasResponse>
```

### 3. Exemplo de Uso

```typescript
// Buscar despesas do deputado ID 204554 para 2024
this.camaraDespesasClient
  .getDespesasByDeputadoIdAndAno(204554, 2024)
  .subscribe({
    next: (response) => {
      console.log('Despesas:', response.dados);
      // response.dados contém array de CamaraDespesa[]
    },
    error: (error) => {
      console.error('Erro:', error);
    }
  });
```

### 4. Estrutura da Resposta

```typescript
interface CamaraDespesasResponse {
  dados: CamaraDespesa[];
  links: {
    first: string;
    last: string;
    next: string;
    prev: string;
  };
}

interface CamaraDespesa {
  ano: number;
  mes: number;
  tipoDocumento: string;
  tipoDespesa: string;
  codDocumento: number;
  codTipoDocumento: number;
  codTipoDespesa: number;
  dataDocumento: string;
  numDocumento: string;
  valorDocumento: number;
  urlDocumento: string;
  nomeFornecedor: string;
  cnpjCpfFornecedor: string;
  valor: number;
  dataEmpenho: string;
  dataLiquidacao: string;
  dataPagamento: string;
  numRessarcimento: string;
  idLote: number;
  parcela: number;
}
```

### 5. Integração com PoliticosService

O client já está integrado ao `PoliticosService` com os seguintes métodos:

```typescript
// No PoliticosService
getCamaraDespesasByDeputadoId(deputadoId: number, ano?: number, mes?: number)
getCamaraDespesasByDeputadoIdAndAno(deputadoId: number, ano: number)
getCamaraDespesasByDeputadoIdAndAnoMes(deputadoId: number, ano: number, mes: number)
```

### 6. Exemplo no Componente

```typescript
// No componente
constructor(private politicosService: PoliticosService) {}

loadDespesas() {
  this.politicosService
    .getCamaraDespesasByDeputadoIdAndAno(204554, 2024)
    .subscribe({
      next: (response) => {
        this.despesas = response.dados;
      },
      error: (error) => {
        console.error('Erro ao buscar despesas:', error);
      }
    });
}
```

## Parâmetros da API

- `deputadoId`: ID do deputado na API da Câmara
- `ano`: Ano das despesas (opcional)
- `mes`: Mês das despesas (opcional)
- `pagina`: Número da página para paginação (opcional)
- `itens`: Quantidade de itens por página (opcional)

## Tratamento de Erros

O client inclui tratamento de erros com retry automático (2 tentativas) e logs detalhados de erro. 