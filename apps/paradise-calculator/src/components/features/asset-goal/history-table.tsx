import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AssetGoalAnnualDataType } from "./asset-goal";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import React from "react";
import {ChevronsUpDown} from 'lucide-react';

const HistoryTable = ({annaulAssetData, displayTargetAmount=true}: {annaulAssetData: AssetGoalAnnualDataType[], displayTargetAmount?:boolean}) => {
  const [contentOpen, setContentOpen] = React.useState(false);
  const toggleContent = () => {
    setContentOpen((old) => !old)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between" onClick={toggleContent}>
          <div>
            년도별 자산 변동 테이블
          </div>
          <ChevronsUpDown className="w-4 h-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Collapsible open={contentOpen} onOpenChange={setContentOpen}>
          <CollapsibleContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-right">년차</TableHead>
                  <TableHead className="text-right">자본</TableHead>
                  <TableHead className="text-right">저축</TableHead>
                  <TableHead className="hidden xs:block text-right">누적수익</TableHead>
                  <TableHead className="text-right">기초자산</TableHead>
                  <TableHead className="text-right">기말자산</TableHead>
                  {displayTargetAmount && 
                    <TableHead className="text-right">목표자산</TableHead>
                  }
                </TableRow>
              </TableHeader>
              <TableBody>
              {annaulAssetData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-right">{item.year.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.capital.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.savings.toLocaleString()}</TableCell>
                  <TableCell className="hidden xs:block text-right">{item.accInvestmentGain.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.baseAssets.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.totalAssets.toLocaleString()}</TableCell>
                  {displayTargetAmount && 
                    <TableCell className="text-right">{item.targetAmount?.toLocaleString()}</TableCell>
                  }
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </CollapsibleContent>
        </Collapsible>

      </CardContent>
    </Card>
  )
}

export { HistoryTable }