import {Injectable} from '@angular/core';
import {Expenditure, ParliamentarianSingleResponse} from './ParlamentarianResponseDtos';

@Injectable({
    providedIn: 'root'
})
export class PoliticosMapper {

    toExpenditure(parliamentarianSingleResponse: ParliamentarianSingleResponse): Expenditure {
        const parliamentarianRanking = parliamentarianSingleResponse.data.parliamentarianRanking;
        const parliamentarian = parliamentarianSingleResponse.data.parliamentarianRanking.parliamentarian;
        const staffs = parliamentarian.staffs;
        const stateQuota = parliamentarianSingleResponse.data.stateQuota;
        const staffQuota = parliamentarianSingleResponse.data.staffQuota;
        const quotas = parliamentarian.quotas;

        const expenditure = new Expenditure();

        expenditure.nome = parliamentarian.nickname;
        expenditure.pontos = parliamentarianRanking.scoreWastage;

        expenditure.cotaParlamentarTotal = parliamentarianRanking.parliamentarianQuotaMaxYear;
        expenditure.contaParlamentarGastou = parliamentarianRanking.parliamentarian.quotaAmountSum;
        expenditure.cotaParlamentarEconomizou = (expenditure.cotaParlamentarTotal - expenditure.contaParlamentarGastou);
        expenditure.cotaGabineteTotal = parliamentarianRanking.parliamentarianStaffMaxYear;
        expenditure.cotaGabineteGastou = parliamentarianRanking.parliamentarianStaffAmountUsed;
        expenditure.cotaGabineteEconomizou = (expenditure.cotaGabineteTotal - expenditure.cotaGabineteGastou);
        expenditure.cotaTotal = parliamentarianRanking.parliamentarianQuotaTotal;
        expenditure.cotaTotalGastou = (expenditure.contaParlamentarGastou + expenditure.cotaGabineteGastou);
        expenditure.cotaTotalEconomizou = Math.round((expenditure.cotaTotal - expenditure.cotaTotalGastou) * 100) / 100;
        expenditure.expenses = quotas.map(quota => ({
            tipo: quota.type,
            valor: quota.amount,
            data: quota.date
        }));
        expenditure.acessoresQuantidade = staffs?.[0]?.count;
        expenditure.acessoresGastoTotal = staffs?.[0]?.amount;
        expenditure.acessoresGastoMedio = (expenditure.acessoresGastoTotal / expenditure.acessoresQuantidade);
        expenditure.stateQuota = stateQuota;
        expenditure.staffQuota = staffQuota;

        return expenditure;
    }
}
