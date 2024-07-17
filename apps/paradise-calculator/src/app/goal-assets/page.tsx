"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, Settings2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GraphDataType {
  year: number;
  totalAssets: number;
  investmentGain: number;
  baseAssets: number;
  targetAmount: number;
}
const INFLATION_RATE = 0.03; // 3% 인플레이션

const AssetGoalCalculator = () => {
  const [currentAssets, setCurrentAssets] = useState("100000000");
  const [annualSavings, setAnnualSavings] = useState("20000000");
  const [targetAmount, setTargetAmount] = useState("1000000000");
  const [investmentReturn, setInvestmentReturn] = useState("10");
  const [dividendYield, setDividendYield] = useState("5");
  const [years, setYears] = useState<number | null>(null);
  const [graphData, setGraphData] = useState<GraphDataType[]>([]);
  const [actualTargetAmount, setActualTargetAmount] = useState<number | null>(null);
  const [annualDividend, setAnnualDividend] = useState<number | null>(null);
  const [isDividendGoal, setIsDividendGoal] = useState<boolean>(false);
  const [inflation, setInflation] = useState<number>(INFLATION_RATE);


  const calculateYearsAndGraph = () => {
    const current = parseFloat(currentAssets);
    const savings = parseFloat(annualSavings);
    const target = parseFloat(targetAmount);
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
    let captal = current;
    let accInvestmentGain = 0;
    const newGraphData = [];
    let inflationAdjustedTarget = isDividendGoal ? target / dividendRate : target;

    while (totalAssets < inflationAdjustedTarget && yearsToReach <= 100) {
      captal += savings;

      const investmentGain = totalAssets * returnRate;
      totalAssets += investmentGain + savings;
      accInvestmentGain += investmentGain;

      // 인플레이션 적용
      // totalAssets /= 1 + INFLATION_RATE;
      inflationAdjustedTarget *= 1 + inflation;

      newGraphData.push({
        year: yearsToReach + 1,
        totalAssets: Math.round(totalAssets),
        investmentGain: Math.round(investmentGain),
        accInvestmentGain: Math.round(accInvestmentGain),
        baseAssets: Math.round(captal),
        targetAmount: Math.round(inflationAdjustedTarget),
      });

      yearsToReach++;
    }

    if (yearsToReach <= 100) {
      setYears(yearsToReach);
      setActualTargetAmount(Math.round(totalAssets));
      setAnnualDividend(Math.round(totalAssets * dividendRate));
    } else {
      setYears(1001);
      setActualTargetAmount(null);
      setAnnualDividend(null);
    }

    setGraphData(newGraphData);
  };

  useEffect(() => {
    calculateYearsAndGraph();
  }, [currentAssets, annualSavings, targetAmount, investmentReturn, dividendYield, isDividendGoal, inflation]);

  const handleCreateShortcut = () => {
    if ("chrome" in window && "runtime" in window.chrome) {
      chrome.runtime.sendMessage({ action: "createShortcut" });
    } else {
      alert("이 기능은 Chrome 브라우저 확장 프로그램에서만 사용 가능합니다.");
    }
  };

  const formatKoreanWon = (value: number | string) => {
    return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(parseInt(String(value)));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex items-center justify-between p-4 max-w-screen-lg mx-auto bg-primary text-primary-foreground">
        <h1 className="text-xl font-bold">자산 목표 계산기</h1>
        <Button variant="secondary" size="icon" onClick={handleCreateShortcut}>
          <Download className="h-4 w-4" />
        </Button>
      </main>
      <main className="p-4 max-w-screen-lg mx-auto">
        <Card className="mb-4">
          <CardHeader className="relative">
            <CardTitle>목표 달성 계산</CardTitle>
            <SettingDialog inflation={inflation} onChange={setInflation} />
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
              <div>
                <label htmlFor="targetAmount" className="block text-sm font-medium mb-1">
                  {isDividendGoal ? "목표 연간 배당금 (원)" : "목표 금액 (현재 가치, 원)"}
                </label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0"
                />
              </div>
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
              <div className="flex items-center space-x-2">
                <Switch id="dividend-goal" checked={isDividendGoal} onCheckedChange={setIsDividendGoal} />
                <Label htmlFor="dividend-goal">배당금 목표로 계산</Label>
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
                  목표 {isDividendGoal ? "배당금" : "금액"} 달성까지 약 {years}년이 걸립니다.
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
          <>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>연도별 자산 증가 그래프</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: "년도", position: "insideBottom", offset: -5 }} />
                    <YAxis
                      tickFormatter={(value) => `${value / 1000000}백만`}
                      label={{ value: "금액 (백만 원)", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        formatKoreanWon(String(value)),
                        name,
                        // name === "baseAssets" ? "기본 자산" : name === "investmentGain" ? "투자 수익" : "목표 금액",
                      ]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="baseAssets"
                      stackId="1"
                      name="기본 자산"
                      fill="#8884d8"
                      stroke="#8884d8"
                    />
                    <Area
                      type="monotone"
                      dataKey="accInvestmentGain"
                      stackId="1"
                      name="투자 수익"
                      fill="#82ca9d"
                      stroke="#82ca9d"
                    />
                    <Area type="monotone" dataKey="targetAmount" name="목표 금액" fill="#ffc658" stroke="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <ul>
                  {graphData.map((item, index) => (
                    <li key={item.year}>
                      {item.baseAssets} + {item.investmentGain} = {item.totalAssets} {"<"} {item.targetAmount}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

interface SettingDialogProps {
  inflation: number
  onChange: (value:number) => void
}
const SettingDialog: React.FC<SettingDialogProps> = ({ inflation, onChange }) => {
  const [_inflation, setInflation] = useState(inflation);
  React.useEffect(() => {
    setInflation(_inflation)
  }, [inflation])

  const onChangeHandler:React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setInflation?.(Number(event.target.value)/100)
  };

  const onSave = () => {
    onChange?.(Number(_inflation)/100)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Settings2 size={18} className="absolute top-4 right-8" />
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>설정</DialogTitle>
          <DialogDescription>
            계산에 사용된 설정 값을 변경 할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start space-x-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link">인플레이션(%)</Label>
            <div className="flex items-center gap-2">
              <Input type="number" id="inflation" placeholder="인플레이션을 입력해주세요" value={ _inflation > 0 ? _inflation  * 100 : ''} onChange={onChangeHandler} />
              <span>%</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose>
            <Button type="button" variant="secondary" onClick={onSave}>
                저장
              </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AssetGoalCalculator;
