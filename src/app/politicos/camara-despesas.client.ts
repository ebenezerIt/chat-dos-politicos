import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { map, Observable, throwError, timeout } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CamaraDespesa {
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

export interface CamaraDespesasResponse {
  dados: CamaraDespesa[];
  links: {
    first: string;
    last: string;
    next: string;
    prev: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CamaraDespesasClient {
  baseUrl = environment.camaraApiUrl;

  constructor(private httpClient: HttpClient) {}

  getDespesasByDeputadoId(
    deputadoId: number,
    ano?: number,
    mes?: number,
    pagina?: number,
    itens?: number
  ): Observable<CamaraDespesasResponse> {
    // Build the target API URL with query parameters
    const apiParams = new URLSearchParams();
    if (ano) apiParams.append('ano', ano.toString());
    if (mes) apiParams.append('mes', mes.toString());
    if (pagina) apiParams.append('pagina', pagina.toString());
    if (itens) apiParams.append('itens', itens.toString());
    const queryString = apiParams.toString();
    const targetUrl = `https://dadosabertos.camara.leg.br/api/v2/deputados/${deputadoId}/despesas${queryString ? '?' + queryString : ''}`;
    
    // If using CORS proxy (production), wrap the URL
    // If using dev proxy, use relative path
    let url: string;
    if (this.baseUrl.includes('allorigins.win')) {
      // allorigins.win format: https://api.allorigins.win/raw?url=ENCODED_URL
      url = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    } else if (this.baseUrl.includes('corsproxy')) {
      // corsproxy.io format: https://corsproxy.io/?ENCODED_URL
      url = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
    } else {
      // Development proxy or direct API - use relative path
      url = `${this.baseUrl}/deputados/${deputadoId}/despesas`;
    }

    // Only add params if NOT using CORS proxy (params are already in URL for proxy)
    let params = new HttpParams();
    
    if (!this.baseUrl.includes('allorigins.win') && !this.baseUrl.includes('corsproxy')) {
      // For dev proxy or direct API, use HttpParams
      if (ano) {
        params = params.set('ano', ano.toString());
      }
      if (mes) {
        params = params.set('mes', mes.toString());
      }
      if (pagina) {
        params = params.set('pagina', pagina.toString());
      }
      if (itens) {
        params = params.set('itens', itens.toString());
      }
    }

    console.log('Câmara API Request:', { url, params: params.toString(), deputadoId, ano, mes });

    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }),
      params: params
    };

    // For CORS proxy, we need to handle text response and parse it
    const responseType = (this.baseUrl.includes('allorigins.win')) ? 'text' : 'json';
    
    // Remove Content-Type header for CORS proxy (it might cause issues)
    const finalHeaders = new HttpHeaders();
    if (!this.baseUrl.includes('allorigins.win') && !this.baseUrl.includes('corsproxy')) {
      finalHeaders.set('Accept', 'application/json');
      finalHeaders.set('Content-Type', 'application/json');
    } else {
      finalHeaders.set('Accept', '*/*');
    }
    
    const finalHttpOptions = {
      headers: finalHeaders,
      params: params,
      responseType: responseType as any
    };
    
    return this.httpClient
      .get<any>(url, finalHttpOptions)
      .pipe(
        timeout(30000), // 30 second timeout to prevent hanging
        map(response => {
          console.log('Câmara API Raw Response:', response);
          console.log('Response type:', typeof response);
          
          // allorigins.win returns the response as a string, so we need to parse it
          if (this.baseUrl.includes('allorigins.win')) {
            let responseToParse = response;
            
            // If response is a string, parse it
            if (typeof response === 'string') {
              // Check if response is XML error
              if (response.trim().startsWith('<')) {
                // Parse XML error
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(response, 'text/xml');
                const status = xmlDoc.querySelector('status')?.textContent || 'Unknown';
                const title = xmlDoc.querySelector('title')?.textContent || 'Erro';
                const detail = xmlDoc.querySelector('detail')?.textContent || 'Erro desconhecido';
                const instance = xmlDoc.querySelector('instance')?.textContent || '';
                
                console.error('Câmara API XML Error:', { status, title, detail, instance });
                
                // Throw a more descriptive error
                const errorMessage = `${title}: ${detail}${instance ? ` (${instance})` : ''}`;
                throw new Error(errorMessage);
              }
              
              try {
                responseToParse = JSON.parse(response);
                console.log('Parsed JSON from string:', responseToParse);
              } catch (e) {
                console.error('Failed to parse JSON string:', e);
                console.error('Response was:', response);
                throw new Error('Invalid JSON response from CORS proxy');
              }
            }
            
            // Check if parsed response has error structure
            if (responseToParse && (responseToParse.status === 404 || responseToParse.status === '404')) {
              throw new Error(`Recurso não encontrado: ${responseToParse.detail || 'Verifique o ID do deputado e o ano'}`);
            }
            
            console.log('Final parsed response:', responseToParse);
            return responseToParse as CamaraDespesasResponse;
          }
          
          console.log('Direct API response (no proxy):', response);
          return response as CamaraDespesasResponse;
        }),
        retry(2),
        catchError(this.handleError)
      );
  }

  getDespesasByDeputadoIdAndAno(
    deputadoId: number,
    ano: number
  ): Observable<CamaraDespesasResponse> {
    return this.getDespesasByDeputadoId(deputadoId, ano);
  }

  getDespesasByDeputadoIdAndAnoMes(
    deputadoId: number,
    ano: number,
    mes: number
  ): Observable<CamaraDespesasResponse> {
    return this.getDespesasByDeputadoId(deputadoId, ano, mes);
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    let errorDetails: any = {
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      url: error.url
    };

    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
      errorDetails.clientError = error.error;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, mensagem: ${error.message}`;
      errorDetails.serverError = error.error;
      
      // Check if it's a 404 error (deputy not found)
      if (error.status === 404) {
        errorMessage = 'Deputado não encontrado na API da Câmara. O ID pode estar incorreto ou o deputado pode não estar mais ativo.';
      }
    }
    
    console.error('Erro na API da Câmara:', errorMessage);
    console.error('Detalhes completos do erro:', errorDetails);
    
    // Return error with more details
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      statusText: error.statusText,
      details: errorDetails
    }));
  }
}
