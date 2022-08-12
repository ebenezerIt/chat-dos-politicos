import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Desperdicio, ParliamentarianListResponse, ParliamentarianSingleResponse} from './ParlamentarianResponseDtos';
import {PoliticosClient} from './politicos.client';

@Injectable({
    providedIn: 'root'
})
export class PoliticosMapper {

    toDesperdicio(parliamentarianSingleResponse: ParliamentarianSingleResponse): Desperdicio {
        const parliamentarianRanking = parliamentarianSingleResponse.data.parliamentarianRanking;
        const parliamentarian = parliamentarianSingleResponse.data.parliamentarianRanking.parliamentarian;
        const staffs = parliamentarian.staffs;
        const stateQuota = parliamentarianSingleResponse.data.stateQuota;
        const staffQuota = parliamentarianSingleResponse.data.staffQuota;
        const quotas = parliamentarian.quotas;

        const desperdicio = new Desperdicio();

        desperdicio.nome = parliamentarian.nickname;
        desperdicio.pontos = parliamentarianRanking.scoreWastage;

        desperdicio.cotaParlamentarTotal = parliamentarianRanking.parliamentarianQuotaMaxYear;
        desperdicio.contaParlamentarGastou = parliamentarianRanking.parliamentarian.quotaAmountSum;
        desperdicio.cotaParlamentarEconomizou = (desperdicio.cotaParlamentarTotal - desperdicio.contaParlamentarGastou);
        desperdicio.cotaGabineteTotal = parliamentarianRanking.parliamentarianStaffMaxYear;
        desperdicio.cotaGabineteGastou = parliamentarianRanking.parliamentarianStaffAmountUsed;
        desperdicio.cotaGabineteEconomizou = (desperdicio.cotaGabineteTotal - desperdicio.cotaGabineteGastou);
        desperdicio.cotaTotal = parliamentarianRanking.parliamentarianQuotaTotal;
        desperdicio.cotaTotalGastou = (desperdicio.contaParlamentarGastou + desperdicio.cotaGabineteGastou);
        desperdicio.cotaTotalEconomizou = Math.round((desperdicio.cotaTotal - desperdicio.cotaTotalGastou) * 100) / 100;
        desperdicio.gastos = quotas.map(quota => ({
            tipo: quota.type,
            valor: quota.amount,
            data: quota.date
        }));
        desperdicio.acessoresQuantidade = staffs?.[0]?.count;
        desperdicio.acessoresGastoTotal = staffs?.[0]?.amount;
        desperdicio.acessoresGastoMedio = (desperdicio.acessoresGastoTotal / desperdicio.acessoresQuantidade);

        return desperdicio;
    }
}
