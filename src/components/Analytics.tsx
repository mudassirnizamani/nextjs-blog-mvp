import Script from "next/script";
import React from "react";

const Analytics = () => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-7KBS03NYMJ`}
      />
      <Script strategy="afterInteractive" id="google-analytics">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        
        gtag('config', 'G-7KBS03NYMJ');
        `}
      </Script>
    </>
  );
};

export default Analytics;
