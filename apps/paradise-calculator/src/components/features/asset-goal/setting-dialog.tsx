import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
import { cn } from "@/lib/utils";
import { Settings2 } from "lucide-react";
import React from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { GoalAssetAttr } from "./goal-assets-context";

type CalculatorOptions = Partial<Pick<GoalAssetAttr, 'inflation' | 'isDividendGoal' | 'isApplyInflation'>>

interface SettingDialogProps extends CalculatorOptions {
  displayTargetType?: boolean
  className?:string
  onChange: (options:CalculatorOptions) => void
}
const SettingDialog: React.FC<SettingDialogProps> = ({  isApplyInflation, isDividendGoal, inflation = 0, displayTargetType = true, className, onChange }) => {
  const [_inflation, setInflation] = React.useState<string>(String(inflation*100));
  const [_isDividendGoal, setIsDividendGoal] = React.useState(isDividendGoal);
  const [_isApplyInflation, setIsApplyInflation] = React.useState(isApplyInflation);

  React.useEffect(() => {
    setInflation(String(inflation*100))
    setIsApplyInflation(isApplyInflation)
    setIsDividendGoal(isDividendGoal)
  }, [inflation, isApplyInflation, isDividendGoal])

  const onSave = () => {
    onChange?.({inflation: parseInt(String(_inflation))/100, isDividendGoal: _isDividendGoal, isApplyInflation: _isApplyInflation})
  }

  const onOpenChangeHandler = (open:boolean) => {
    // 팝업 닫을때 props 기준으로 초기화
    if(!open) {
      setInflation(String(inflation*100))
      setIsApplyInflation(isApplyInflation)
      setIsDividendGoal(isDividendGoal)
    }
  }

  return (
    <Dialog onOpenChange={onOpenChangeHandler}>
      <DialogTrigger asChild>
        <Settings2 size={18} className={cn("absolute top-[18px] right-7", className)} />
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader className="text-left">
          <DialogTitle>설정</DialogTitle>
          <DialogDescription>
            계산에 사용된 설정 값을 변경 할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start mt-4 space-y-4">
          <div className="w-full flex flex-1 gap-4">
            <Label htmlFor="apply-inflation" className="w-26">물가상승률 반영</Label>
            <Switch id="apply-inflation" checked={_isApplyInflation} onCheckedChange={setIsApplyInflation} />
          </div>
          <div className="w-full grid flex-1 gap-2">
            <Label htmlFor="link">물가상승률(%)</Label>
            <div className="flex items-center gap-2">
              <Input type="text" id="inflation" placeholder="물가상승률을 입력해주세요" value={ Number(_inflation) > 0 ? _inflation : ''} onChange={(e) => setInflation(e.target.value)} />
              <span>%</span>
            </div>
          </div>
          
          {displayTargetType && 
            <div className="w-full flex flex-1 gap-4">
              <Label htmlFor="dividend-goal" className="w-26">배당 목표로 계산</Label>
              <Switch id="dividend-goal" checked={_isDividendGoal} onCheckedChange={setIsDividendGoal} />
            </div>
          }
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

export default SettingDialog
export { type SettingDialogProps, type CalculatorOptions }