"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const AssetGoalCalculator = () => {
  const [currentAssets, setCurrentAssets] = useState("");
  const [annualSavings, setAnnualSavings] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDividend, setTargetDividend] = useState("");
  const [investmentReturn, setInvestmentReturn] = useState("");
  const [dividendYield, setDividendYield] = useState("");
  const [years, setYears] = useState<null | number | string>(null);
  const [graphData, setGraphData] = useState<any>([]);
  const [actualTargetAmount, setActualTargetAmount] = useState<null | number>(null);
  const [annualDividend, setAnnualDividend] = useState<null | number>(null);
  const [goalType, setGoalType] = useState("amount");

  const INFLATION_RATE = 0.03; // 3% 인플레이션

  const calculateYearsAndGraph = () => {
    const current = parseFloat(currentAssets);
    const savings = parseFloat(annualSavings);
    const target =
      goalType === "amount" ? parseFloat(targetAmount) : parseFloat(targetDividend) / (parseFloat(dividendYield) / 100);
    const returnRate = parseFloat(investmentReturn) / 100;
    const dividendRate = parseFloat(dividendYield) / 100;

    if (isNaN(current) || isNaN(savings) || isNaN(target) || isNaN(returnRate) || isNaN(dividendRate)) {
      setYears(null);
      setGraphData([]);
      setActualTargetAmount(null);
      setAnnualDividend(null);
      return;
    }

    let totalAssets = current;
    let yearsToReach = 0;
    const newGraphData = [];
    let inflationAdjustedTarget = target;

    while (totalAssets < inflationAdjustedTarget && yearsToReach <= 100) {
      const investmentReturn = totalAssets * returnRate;
      newGraphData.push({
        year: yearsToReach,
        totalAssets: Math.round(totalAssets),
        investmentReturn: Math.round(investmentReturn),
        annualSavings: savings,
        targetAmount: Math.round(inflationAdjustedTarget),
      });

      totalAssets = totalAssets * (1 + returnRate) + savings;
      totalAssets /= 1 + INFLATION_RATE;
      inflationAdjustedTarget *= 1 + INFLATION_RATE;

      yearsToReach++;
    }

    if (yearsToReach <= 100) {
      const finalInvestmentReturn = totalAssets * returnRate;
      newGraphData.push({
        year: yearsToReach,
        totalAssets: Math.round(totalAssets),
        investmentReturn: Math.round(finalInvestmentReturn),
        annualSavings: savings,
        targetAmount: Math.round(inflationAdjustedTarget),
      });
      setYears(yearsToReach);
      setActualTargetAmount(Math.round(totalAssets));
      setAnnualDividend(Math.round(totalAssets * dividendRate));
    } else {
      setYears("100년 이상");
      setActualTargetAmount(null);
      setAnnualDividend(null);
    }

    setGraphData(newGraphData);
  };

  useEffect(() => {
    calculateYearsAndGraph();
  }, [currentAssets, annualSavings, targetAmount, targetDividend, investmentReturn, dividendYield, goalType]);

  const handleCreateShortcut = () => {
    if ("chrome" in window && "runtime" in window.chrome) {
      chrome.runtime.sendMessage({ action: "createShortcut" });
    } else {
      alert("이 기능은 Chrome 브라우저 확장 프로그램에서만 사용 가능합니다.");
    }
  };

  const formatKoreanWon = (value: number) => {
    return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(value);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 flex justify-between items-center p-4 max-w-screen-lg bg-primary bg-white text-primary-foreground mx-auto">
        <h1 className="text-xl font-bold">자산 목표 계산기</h1>
        <Button variant="secondary" size="icon" onClick={handleCreateShortcut}>
          <Download className="h-4 w-4" />
        </Button>
      </header>
      <main className="p-4 max-w-screen-lg mx-auto">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>목표 달성 계산</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentAssets" className="block text-sm font-medium mb-1">
                  현재 자산 (원)
                </label>
                <Input
                  id="currentAssets"
                  type="number"
                  value={currentAssets}
                  onChange={(e) => setCurrentAssets(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="annualSavings" className="block text-sm font-medium mb-1">
                  연간 저축액 (원)
                </label>
                <Input
                  id="annualSavings"
                  type="number"
                  value={annualSavings}
                  onChange={(e) => setAnnualSavings(e.target.value)}
                  placeholder="0"
                />
              </div>
              <RadioGroup value={goalType} onValueChange={setGoalType} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="amount" id="amount" />
                  <Label htmlFor="amount">목표 금액</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dividend" id="dividend" />
                  <Label htmlFor="dividend">목표 배당금</Label>
                </div>
              </RadioGroup>
              {goalType === "amount" ? (
                <div>
                  <label htmlFor="targetAmount" className="block text-sm font-medium mb-1">
                    목표 금액 (현재 가치, 원)
                  </label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="0"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="targetDividend" className="block text-sm font-medium mb-1">
                    목표 연간 배당금 (원)
                  </label>
                  <Input
                    id="targetDividend"
                    type="number"
                    value={targetDividend}
                    onChange={(e) => setTargetDividend(e.target.value)}
                    placeholder="0"
                  />
                </div>
              )}
              <div>
                <label htmlFor="investmentReturn" className="block text-sm font-medium mb-1">
                  목표 투자 수익률 (%)
                </label>
                <Input
                  id="investmentReturn"
                  type="number"
                  value={investmentReturn}
                  onChange={(e) => setInvestmentReturn(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="dividendYield" className="block text-sm font-medium mb-1">
                  목표 달성 후 예상 배당 수익률 (%)
                </label>
                <Input
                  id="dividendYield"
                  type="number"
                  value={dividendYield}
                  onChange={(e) => setDividendYield(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">결과</CardTitle>
          </CardHeader>
          <CardContent>
            {years !== null ? (
              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  목표 {goalType === "amount" ? "금액" : "배당금"} 달성까지 약 {years}년이 걸립니다.
                </p>
                {actualTargetAmount && <p>실제 달성 금액: {formatKoreanWon(actualTargetAmount)} (인플레이션 고려)</p>}
                {annualDividend && <p>목표 달성 후 예상 연간 배당금: {formatKoreanWon(annualDividend)}</p>}
              </div>
            ) : (
              <p className="text-lg font-semibold text-muted-foreground">모든 값을 입력해주세요.</p>
            )}
          </CardContent>
        </Card>
        {graphData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>연도별 자산 증가 그래프</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: "년도", position: "insideBottom", offset: -5 }} />
                  <YAxis tickFormatter={(value) => `${value / 1000000}`} />
                  <Tooltip formatter={(value) => formatKoreanWon(Number(value))} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="totalAssets"
                    stackId="1"
                    name="순자산"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                  <Area
                    type="monotone"
                    dataKey="investmentReturn"
                    stackId="1"
                    name="투자 수익"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                  <Area
                    type="monotone"
                    dataKey="targetAmount"
                    name="목표 금액"
                    stroke="#ffc658"
                    fill="#ffc658"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AssetGoalCalculator;
