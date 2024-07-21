import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AssetGoalAnnualDataType } from "./asset-goal";

const HistoryTable = ({annaulAssetData}: {annaulAssetData: AssetGoalAnnualDataType[]}) => {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-right">년차</TableHead>
              <TableHead className="text-right">자본</TableHead>
              <TableHead className="text-right">저축</TableHead>
              <TableHead className="text-right">누적수익</TableHead>
              <TableHead className="text-right">기초자산</TableHead>
              <TableHead className="text-right">기말자산</TableHead>
              <TableHead className="text-right">목표자산</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {annaulAssetData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-right">{item.year.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.capital.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.savings.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.accInvestmentGain.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.baseAssets.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.totalAssets.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.targetAmount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export { HistoryTable }