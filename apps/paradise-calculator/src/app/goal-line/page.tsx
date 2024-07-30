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
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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

  const getChangeHandler = (attrName:keyof GoalAssetAttr, allowPoint = false) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      if(allowPoint && inputValue.indexOf(".") >= 0) {
        if(inputValue.split(".").length > 1) {
          const fragment = inputValue.split(".")
          setAssetAttributes({[attrName]: [fragment[0], fragment.slice(1).join('')].join(".")})
          return;
        }

        setAssetAttributes({[attrName]: inputValue})
        return;
      }

      try {
        const numberValue = parseFloat(inputValue.replaceAll(/,/g, ''))
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
    <main className="w-full">
      <h1 className="text-lg font-bold">
        🏖 낙원 시간(🏁) 계산기 <span className="text-sm font-medium">(은퇴시기 계산하기)</span>
      </h1>
      <p className="text-sm">여러분의 낙원(경제적 자유)까지 얼마나 걸리는지 계산해보세요. 여러분은 이미 낙원🏖에 한발자국👟👟 다가갔습니다.</p>

      <Card className="my-4">
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
                {isDividendGoal ? "낙원(목표) 연배당금₩" : "낙원(목표) 금액₩"}
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
                onChange={getChangeHandler('investmentReturn', true)}
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
                onChange={getChangeHandler('dividendYield', true)}
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
                🏖낙원🏖 {isDividendGoal ? "배당금" : "금액"} 달성까지 약 <span className="font-semibold underline decoration-primary">{years}</span>년이 걸립니다.
              </p>
              {actualTargetAmount && <p>달성 금액: &nbsp;
                <TargetAmountDescription actualTargetAmount={actualTargetAmount}/> {isApplyInflation ? ` (물가상승률: ↑${(inflation||0)*100}%)` : ''}</p>}
              {annualDividend && <p>달성 후 예상 배당금:&nbsp;
              <MonthlyDividendDescription
                  years={String(years)}
                  annualDividend={annualDividend}
                  actualTargetAmount={actualTargetAmount}
                  dividendYield={dividendYield}
                  inflation={inflation}
                  isApplyInflation={isApplyInflation}
                />
              , <span className="font-semibold underline decoration-primary">{formatKoreanWon(annualDividend)}/연</span></p>}
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


const TargetAmountDescription = (props:{actualTargetAmount:number|null} & Partial<GoalAssetAttr>) => {
  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer">
          <AccentNumberText value={props.actualTargetAmount!} />
      </HoverCardTrigger>
      <HoverCardContent className="w-96">
          낙원을 위한 목표 금액을 더 빠르게 달성하려면 투자 수익율을 높이거나 저축금액을 늘려야 합니다.
          <ul className="list-decimal ml-4">
            <li>절약하기</li>
            <li>소득 높이기</li>
            <li>투자 공부</li>
          </ul>
          <br/>
          당장 소득금액을 높이기 어렵다면 소비금액을 줄여보세요.
          아무리 소득이 높아도 그만큼 소비한다면 목표를 달성 하기 어렵다는 점을 기억하세요.
          <br/><br/> 여러분의 슬기로운 저축과 투자를 응원합니다. 💰💰
        
      </HoverCardContent>
    </HoverCard>
  )
}


const MonthlyDividendDescription = (props:{annualDividend:number; actualTargetAmount:number|null} & Partial<GoalAssetAttr>) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
          <span className="font-semibold underline decoration-primary cursor-pointer">{formatKoreanWon(props.annualDividend/12)}/월 </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-96">
        {props.years}년 후 {props.dividendYield}%의 배당수익율로 월 <AccentNumberText value={props.annualDividend/12} />의 배당수입을 만들 수 있습니다. <br/>
        영구적인 배당(낙원)을 유지하기 위해서는 자산(<AccentNumberText value={props.actualTargetAmount!}/>)이 매년 <AccentText value={`물가상승률${(props.isApplyInflation ? `(${props.inflation! * 100}%)` : '')}`}/>만큼 증가해야 합니다.<br/>
        배당중 일부는 다시 자산으로 재투자를 하거나 배당을 제외하고 물가상승을 따라가는 자산에 투자해야 합니다.
      </HoverCardContent>
    </HoverCard>
  )
}

const AccentNumberText = ({value}:{value:number|string}) => {
  return (
    <AccentText value={formatKoreanWon(value)}/>
  )
}

const AccentText = ({value}:{value:number|string}) => {
  return (
    <span className="font-semibold underline decoration-primary">{value}</span>
  )
}


export default AssetGoalCalculator;
