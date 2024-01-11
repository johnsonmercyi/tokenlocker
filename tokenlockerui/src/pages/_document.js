import { Html, Head, Main, NextScript } from 'next/document';

function Document({ props }) {
  
  return (
    <Html lang="en">
      <Head />
      <body style={{ 
        background: "rgb(0, 0, 31)",
        color: "rgb(255, 255, 255)",
        // fontFamily: "Helvetica",
      }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document;
