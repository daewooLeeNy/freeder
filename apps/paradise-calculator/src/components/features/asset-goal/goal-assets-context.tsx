'use client'
import React from "react";

interface GoalAssetAttr {
  isDividendGoal: boolean; // 배당금 목표 여부
  currentAssets?: string;
  annualSavings?: string;
  targetAmount?: string;
  investmentReturn?: string;
  dividendYield?: string;
  inflation?: number;
  years?: string;
  isApplyInflation:boolean
}

interface GoalAsset extends GoalAssetAttr {
  setAssetAttributes: (attributes:Partial<GoalAssetAttr>) => void
}


const INFLATION_RATE = 0.03; // 3% 인플레이션
const DefaultAssetGoalAttr:GoalAssetAttr = {
  currentAssets: '100,000,000',
  annualSavings: '20,000,000',
  targetAmount: '1,000,000,000',
  investmentReturn: "10",
  dividendYield: "5",
  years: '10',
  isDividendGoal: false,
  inflation: INFLATION_RATE,
  isApplyInflation:true,
}

const GoalAssetContext = React.createContext<GoalAsset>(DefaultAssetGoalAttr as GoalAsset)
const GoalAssetProvider = ({assetAttributes, children}:{assetAttributes?: GoalAssetAttr, children:React.ReactNode}) => {
  const [_assetAttributes, setAssetAttributesState] = React.useState<GoalAssetAttr>(assetAttributes || DefaultAssetGoalAttr);
  const setAssetAttributes = (attributes:Partial<GoalAssetAttr>) => {
    setAssetAttributesState((old : GoalAssetAttr) => {
      return {
        ...(old || {}),
        ...attributes
      } as GoalAssetAttr
    })
  }

  return (
    <GoalAssetContext.Provider value={{..._assetAttributes, setAssetAttributes}}>
      {children}
    </GoalAssetContext.Provider>
  )
}

const useAssetGoalAttributes = () => {
  return React.useContext(GoalAssetContext)
}
export { GoalAssetProvider, useAssetGoalAttributes }
export { type GoalAsset, type GoalAssetAttr }