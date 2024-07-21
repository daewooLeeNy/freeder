"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { calculateAnnualAssetsHistory } from "@/hooks/asset-goals";
import SettingDialog from "@/components/features/asset-goal/setting-dialog";
import { GoalAssetAttr, useAssetGoalAttributes } from "@/components/features/asset-goal/goal-assets-context";
import { HistoryTable } from "@/components/features/asset-goal/history-table";
import { AssetGraph } from "@/components/features/asset-goal/asset-graph";
import { formatKoreanWon, parseAmountStringToFloat } from "@/lib/currency";
import { AssetGoalAnnualDataType } from "@/components/features/asset-goal/asset-goal";


const AssetGoalCalculator = () => {
  const {
    isDividendGoal,
    currentAssets,
    annualSavings,
    targetAmount,
    investmentReturn,
    dividendYield,
    inflation,
    isApplyInflation,
    setAssetAttributes
  } = useAssetGoalAttributes();

  const [years, setYears] = useState<number | null>(null);
  const [annaulAssetData, setAnnaulAssetData] = useState<AssetGoalAnnualDataType[]>([]);
  const [actualTargetAmount, setActualTargetAmount] = useState<number | null>(null);
  const [annualDividend, setAnnualDividend] = useState<number | null>(null);

  const getChangeHandler = (attrName:keyof GoalAssetAttr) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    try {
      const numberValue = parseInt(inputValue.replaceAll(/,/g, ''))
      if (isNaN(numberValue)) {
        setAssetAttributes({[attrName]: 0})
        return;
      }

      setAssetAttributes({[attrName]: numberValue.toLocaleString()})
    } catch (e) {
      setAssetAttributes({[attrName]: inputValue})
    }
  }}

  const calculateYearsAndGraph = () => {
    const {
      years,
      annualData,
      actualTargetAmount,
      annualDividend,
    } = calculateAnnualAssetsHistory({
      isDividendGoal,
      currentAssets: currentAssets || '0',
      annualSavings: annualSavings || '0',
      targetAmount: targetAmount || '0',
      investmentReturn: investmentReturn || '0',
      dividendYield: dividendYield || '0',
      inflation: inflation || 0,
      isApplyInflation,
    }) || {};

    if(years === null) {
      return;
    }

    if (years <= 100) {
      setYears(years);
      setActualTargetAmount(actualTargetAmount);
      setAnnualDividend(annualDividend);
    } else {
      setYears(1001);
      setActualTargetAmount(actualTargetAmount);
      setAnnualDividend(annualDividend);
    }

    setAnnaulAssetData(annualData);
  };

  useEffect(() => {
    calculateYearsAndGraph();
  }, [currentAssets, annualSavings, targetAmount, investmentReturn, dividendYield, isDividendGoal, inflation, isApplyInflation]);

  // TODO 자산 <-> 배당 기준이 바뀔때 자산이 이미 계산된 적이 있는 경우는 목표금액이 이전 금액 기준으로 입력 했다고 판단하여 해당 기준(배당or자산)변환 처리 함.
  const convertTargetAmountForGoalType = (_isDividendGoal:boolean) => {
    if(!dividendYield || !targetAmount) return 0;

    if(_isDividendGoal && targetAmount && years && parseInt(dividendYield) > 0)  {
      return parseAmountStringToFloat(targetAmount) * (parseAmountStringToFloat(dividendYield) / 100)
    } else if(!_isDividendGoal && targetAmount && years && parseInt(dividendYield) > 0) {
      return parseAmountStringToFloat(targetAmount) / (parseAmountStringToFloat(dividendYield) / 100)
    }

    return 0;
  }

  const onChangeTargetAmountDividenedType = (isDividendGoal:boolean) => {
    const dividendTarget = convertTargetAmountForGoalType(isDividendGoal)
    setAssetAttributes?.({isDividendGoal: isDividendGoal, targetAmount: dividendTarget.toLocaleString()});
  }

  const onChangeSettings = (attributes:Partial<GoalAssetAttr>) => {
    if(attributes.isDividendGoal !== undefined && attributes.isDividendGoal !== isDividendGoal) {
      const dividendTarget = convertTargetAmountForGoalType(attributes.isDividendGoal)
      setAssetAttributes?.({...attributes, targetAmount: dividendTarget.toLocaleString()});
    } else {
      setAssetAttributes?.({...attributes});
    }
  }

  return (
    <main className="p-4 max-w-screen-lg mx-auto">
      <Card className="mb-4">
        <CardHeader className="relative">
          <div className="flex justify-between w-full">
            <CardTitle className="flex-1">목표 설정</CardTitle>
            <div className="flex flex-1 items-center justify-end gap-2 xs:mr-8">
              <Label htmlFor="dividend-goal-main">배당 목표</Label>
              <Switch id="dividend-goal-main" checked={isDividendGoal} onCheckedChange={onChangeTargetAmountDividenedType} />
            </div>
          </div>
          <SettingDialog inflation={inflation} isApplyInflation={isApplyInflation} isDividendGoal={isDividendGoal} onChange={onChangeSettings} className="hidden xs:block"/>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 space-4 gap-4">
              <div>
              <label htmlFor="targetAmount" className="block text-sm font-medium mb-1">
                {isDividendGoal ? "목표 연간 배당금 (원)" : "목표 금액 (원)"}
              </label>
              <Input
                id="targetAmount"
                type="text"
                value={targetAmount}
                onChange={getChangeHandler('targetAmount')}
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="investmentReturn" className="block text-sm font-medium mb-1">
                목표 투자 수익률 (%)
              </label>
              <Input
                id="investmentReturn"
                type="text"
                value={investmentReturn}
                onChange={getChangeHandler('investmentReturn')}
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="currentAssets" className="block text-sm font-medium mb-1">
                현재 자산 (원)
              </label>
              <Input
                id="currentAssets"
                type="text"
                value={currentAssets}
                onChange={getChangeHandler('currentAssets')}
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="annualSavings" className="block text-sm font-medium mb-1">
                연간 저축액 (원)
              </label>
              <Input
                id="annualSavings"
                type="text"
                value={annualSavings}
                onChange={getChangeHandler('annualSavings')}
                placeholder="0"
              />
            </div>
            
            <div>
              <label htmlFor="dividendYield" className="block text-sm font-medium mb-1">
                목표 달성 후 예상 배당 수익률 (%)
              </label>
              <Input
                id="dividendYield"
                type="text"
                value={dividendYield}
                onChange={getChangeHandler('dividendYield')}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>결과</CardTitle>
        </CardHeader>
        <CardContent>
          {years !== null ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                목표 {isDividendGoal ? "배당금" : "금액"} 달성까지 약 <span className="font-semibold underline decoration-primary">{years}</span>년이 걸립니다.
              </p>
              {actualTargetAmount && <p>달성 금액: <span className="font-semibold underline decoration-primary">{formatKoreanWon(actualTargetAmount)}</span> {isApplyInflation ? ` (물가: ↑${(inflation||0)*100}%)` : ''}</p>}
              {annualDividend && <p>달성 후 예상 배당금: <span className="font-semibold underline decoration-primary">{formatKoreanWon(annualDividend/12)}/월 </span>, <span className="font-semibold underline decoration-primary">{formatKoreanWon(annualDividend)}/연</span></p>}
            </div>
          ) : (
            <p className="text-lg font-semibold text-muted-foreground">모든 값을 입력해주세요.</p>
          )}
        </CardContent>
      </Card>
      {annaulAssetData.length > 0 && (
        <>
          <AssetGraph annaulAssetData={annaulAssetData}/>
          <HistoryTable annaulAssetData={annaulAssetData}/>
        </>
      )}
    </main>
  );
};

interface CalculatorOptions {
  inflation:number, isDividendGoal:boolean, isApplyInflation:boolean
} 

export default AssetGoalCalculator;
