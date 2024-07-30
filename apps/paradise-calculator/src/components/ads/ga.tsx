import Script from "next/script"

const GoogleAnalytics:React.FC = () => {
  const initGA = () => {
    
  }

  return (
    <Script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=UA-61646850-3`}
      crossOrigin="anonymous"
      onLoad={initGA}
    />
  )
}