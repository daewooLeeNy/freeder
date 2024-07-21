import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKoreanWon } from "@/lib/currency";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AssetGoalAnnualDataType } from "./asset-goal";

const AssetGraph = ({annaulAssetData}: {annaulAssetData: AssetGoalAnnualDataType[]}) => {
  return (
    <Card className="mb-4">
            <CardHeader>
              <CardTitle>연도별 자산 증가 그래프</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={annaulAssetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: "년도", position: "insideBottom", offset: -10 }} />
                  <YAxis
                    fontSize={'10px'}
                    tickFormatter={(value) => `${(value / 1000000).toLocaleString()}백만`}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      formatKoreanWon(String(value)),
                      name,
                    ]}
                  />
                  <Legend align="right"/>
                  <Area
                    type="monotone"
                    dataKey="capital"
                    stackId="1"
                    name="누적자본"
                    fill="#FFB200"
                    stroke="#FFB200"
                  />
                  <Area
                    type="monotone"
                    dataKey="accInvestmentGain"
                    stackId="1"
                    name="투자 수익"
                    fill="#EB5B00"
                    stroke="#EB5B00"
                  />
                  <Area type="monotone" dataKey="targetAmount" name="목표 금액" fillOpacity="0" stroke="#B60071" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
  )
}

export { AssetGraph }