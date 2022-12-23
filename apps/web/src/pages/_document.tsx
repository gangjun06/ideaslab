import React from 'react'
import NextDocument, { Head, Html, Main, NextScript } from 'next/document'
import { appleDeviceSpecsForLaunchImages } from 'pwa-asset-generator'

class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <script async src="/darkmode.js" />
          {/* <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          /> */}
          {/* <script
            dangerouslySetInnerHTML={{
              __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
          page_path: window.location.pathname,
        });
      `,
            }}
          />
          <link
            rel="stylesheet"
            as="style"
            crossOrigin=""
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/static/pretendard-dynamic-subset.css"
          /> */}

          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#8AC896" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <link rel="apple-touch-icon" href="/apple-icon-180.png" />
          <link rel="icon" type="image/png" sizes="196x196" href="favicon-196.png" />

          {appleDeviceSpecsForLaunchImages.map((spec) => {
            return (
              <>
                <link
                  key={`apple-splash-${spec.portrait.width}-${spec.portrait.height}`}
                  rel="apple-touch-startup-image"
                  href={`apple-splash-${spec.portrait.width}-${spec.portrait.height}.png`}
                  media={`(device-width: ${
                    spec.portrait.width / spec.scaleFactor
                  }px) and (device-height: ${
                    spec.portrait.height / spec.scaleFactor
                  }px) and (-webkit-device-pixel-ratio: ${
                    spec.scaleFactor
                  }) and (orientation: portrait)`}
                />
                <link
                  key={`apple-splash-${spec.portrait.width}-${spec.portrait.height}`}
                  rel="apple-touch-startup-image"
                  href={`apple-splash-${spec.portrait.width}-${spec.portrait.height}.png`}
                  media={`(device-width: ${
                    spec.portrait.height / spec.scaleFactor
                  }px) and (device-height: ${
                    spec.portrait.width / spec.scaleFactor
                  }px) and (-webkit-device-pixel-ratio: ${
                    spec.scaleFactor
                  }) and (orientation: landscape)`}
                />
              </>
            )
          })}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document
