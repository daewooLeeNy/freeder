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
import { calculateRequiredROI } from "@/hooks/roi";


const GoalInterestCalculator = () => {
  const {
    currentAssets,
    annualSavings,
    targetAmount,
    years,
    setAssetAttributes
  } = useAssetGoalAttributes();

  const [roi, setROI] = useState<number | null>(null);

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
    const roi = calculateRequiredROI(parseAmountStringToFloat(currentAssets!), parseAmountStringToFloat(annualSavings!), parseAmountStringToFloat(targetAmount!), parseAmountStringToFloat(years!))
    setROI(roi);
  };

  useEffect(() => {
    if(currentAssets && annualSavings && targetAmount && years) {
      calculateYearsAndGraph();
    }
  }, [currentAssets, annualSavings, targetAmount, years]);

  return (
    <main className="w-full">
      <h1 className="text-lg font-bold mb-4">
        목표 수익율 계산하기
      </h1>
      <Card className="mb-4">
        <CardHeader className="relative">
          <div className="flex justify-between w-full">
            <CardTitle className="flex-1">목표 설정</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 space-4 gap-4">
              <div>
                <label htmlFor="targetAmount" className="block text-sm font-medium mb-1">
                  {"목표 금액 (원)"}
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
                <label htmlFor="years" className="block text-sm font-medium mb-1">
                  {"목표 기간(년)"}
                </label>
                <Input
                  id="years"
                  type="text"
                  value={years}
                  onChange={getChangeHandler('years')}
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
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>결과</CardTitle>
        </CardHeader>
        <CardContent>
          {roi !== null ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                목표 금액 {formatKoreanWon(targetAmount?.replace(/,/g, '') || '')}을 달성하기 위해 {years}년 동안 <span className="font-semibold underline decoration-primary">평균 {(roi! * 100).toFixed(2)}% 수익율</span>을 목표로 해야 합니다.
              </p>
              <p>목표 수익율: <span className="font-semibold underline decoration-primary">연평균 {(roi! * 100).toFixed(2)}% </span></p>
            </div>
          ) : (
            <p className="text-lg font-semibold text-muted-foreground">모든 값을 입력해주세요.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

interface CalculatorOptions {
  inflation:number, isDividendGoal:boolean, isApplyInflation:boolean
} 

export default GoalInterestCalculator;
